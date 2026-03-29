const Petition = require("../models/Petition");
const Signature = require("../models/Signature");
const Vote = require("../models/Vote");
const { logAction } = require("../utils/logger");

const ALLOWED_STATUSES = new Set([
  "under_review",
  "active",
  "resolved",
  "rejected",
]);

const parseDateOrNull = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const sanitizeText = (value) =>
  String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const normalizeLocation = (value) => sanitizeText(value).toLowerCase();

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const monthLabelExpression = {
  $dateToString: {
    format: "%Y-%m",
    date: "$createdAt",
  },
};

const resolveRange = (query) => {
  const now = new Date();
  const defaultFrom = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const defaultTo = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const from =
    parseDateOrNull(query.fromDate || query.from || query.startDate) ||
    defaultFrom;
  const to =
    parseDateOrNull(query.toDate || query.to || query.endDate) || defaultTo;

  if (from >= to) {
    throw new Error("fromDate must be earlier than toDate");
  }

  return { from, to };
};

const resolveLocation = (req) => {
  const userLocation = sanitizeText(req.user?.location || "");

  if (!userLocation) {
    const error = new Error("Official location is required");
    error.statusCode = 403;
    throw error;
  }

  const requestedLocation = sanitizeText(req.query.location || userLocation);
  if (
    requestedLocation &&
    normalizeLocation(requestedLocation) !== normalizeLocation(userLocation)
  ) {
    const error = new Error("Cross-location access is not allowed");
    error.statusCode = 403;
    throw error;
  }

  return userLocation;
};

const resolveStatusFilter = (query) => {
  const status = sanitizeText(query.status);
  if (!status) return null;

  if (!ALLOWED_STATUSES.has(status)) {
    const error = new Error("Invalid status filter");
    error.statusCode = 400;
    throw error;
  }

  return status;
};

const buildAggregatedReport = async ({ from, to, location, status }) => {
  const locationRegex = new RegExp(`^${escapeRegExp(location)}$`, "i");

  const petitionMatch = {
    createdAt: { $gte: from, $lt: to },
    location: locationRegex,
  };

  if (status) {
    petitionMatch.status = status;
  }

  const signaturesPetitionMatch = {
    "petition.location": locationRegex,
  };

  if (status) {
    signaturesPetitionMatch["petition.status"] = status;
  }

  const [petitionsPerStatus, signaturesPerPetition, pollVotesPerLocation] =
    await Promise.all([
      Petition.aggregate([
        {
          $match: petitionMatch,
        },
        {
          $group: {
            _id: {
              status: "$status",
              month: monthLabelExpression,
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.status": 1,
            "_id.month": 1,
          },
        },
        {
          $group: {
            _id: "$_id.status",
            total: { $sum: "$count" },
            monthly: {
              $push: {
                month: "$_id.month",
                count: "$count",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            status: "$_id",
            total: 1,
            monthly: 1,
          },
        },
      ]),
      Signature.aggregate([
        {
          $match: {
            createdAt: { $gte: from, $lt: to },
          },
        },
        {
          $lookup: {
            from: "petitions",
            localField: "petition",
            foreignField: "_id",
            as: "petition",
          },
        },
        {
          $unwind: "$petition",
        },
        {
          $match: signaturesPetitionMatch,
        },
        {
          $group: {
            _id: {
              petitionId: "$petition._id",
              title: "$petition.title",
              month: monthLabelExpression,
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.title": 1,
            "_id.month": 1,
          },
        },
        {
          $group: {
            _id: {
              petitionId: "$_id.petitionId",
              title: "$_id.title",
            },
            totalSignatures: { $sum: "$count" },
            monthly: {
              $push: {
                month: "$_id.month",
                count: "$count",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            petitionId: "$_id.petitionId",
            title: "$_id.title",
            totalSignatures: 1,
            monthly: 1,
          },
        },
        {
          $sort: {
            totalSignatures: -1,
            title: 1,
          },
        },
      ]),
      Vote.aggregate([
        {
          $match: {
            createdAt: { $gte: from, $lt: to },
          },
        },
        {
          $lookup: {
            from: "polls",
            localField: "poll",
            foreignField: "_id",
            as: "poll",
          },
        },
        {
          $unwind: "$poll",
        },
        {
          $match: {
            "poll.targetLocation": locationRegex,
          },
        },
        {
          $group: {
            _id: {
              location: "$poll.targetLocation",
              month: monthLabelExpression,
            },
            votes: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.location": 1,
            "_id.month": 1,
          },
        },
        {
          $group: {
            _id: "$_id.location",
            totalVotes: { $sum: "$votes" },
            monthly: {
              $push: {
                month: "$_id.month",
                votes: "$votes",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            location: "$_id",
            totalVotes: 1,
            monthly: 1,
          },
        },
      ]),
    ]);

  return {
    petitionsPerStatus,
    signaturesPerPetition,
    pollVotesPerLocation,
  };
};

const toCsvCell = (value) => {
  const serialized = value == null ? "" : String(value);
  if (/[,"\n]/.test(serialized)) {
    return `"${serialized.replace(/"/g, '""')}"`;
  }
  return serialized;
};

const toCsvRow = (values) => values.map(toCsvCell).join(",");

const buildCsv = (report) => {
  const lines = [
    toCsvRow(["section", "key", "label", "month", "value", "total"]),
  ];

  for (const row of report.petitionsPerStatus) {
    if (!row.monthly?.length) {
      lines.push(
        toCsvRow([
          "petitions_per_status",
          row.status,
          row.status,
          "",
          0,
          row.total,
        ]),
      );
      continue;
    }

    for (const monthlyRow of row.monthly) {
      lines.push(
        toCsvRow([
          "petitions_per_status",
          row.status,
          row.status,
          monthlyRow.month,
          monthlyRow.count,
          row.total,
        ]),
      );
    }
  }

  for (const row of report.signaturesPerPetition) {
    if (!row.monthly?.length) {
      lines.push(
        toCsvRow([
          "signatures_per_petition",
          row.petitionId,
          row.title,
          "",
          0,
          row.totalSignatures,
        ]),
      );
      continue;
    }

    for (const monthlyRow of row.monthly) {
      lines.push(
        toCsvRow([
          "signatures_per_petition",
          row.petitionId,
          row.title,
          monthlyRow.month,
          monthlyRow.count,
          row.totalSignatures,
        ]),
      );
    }
  }

  for (const row of report.pollVotesPerLocation) {
    if (!row.monthly?.length) {
      lines.push(
        toCsvRow([
          "poll_votes_per_location",
          row.location,
          row.location,
          "",
          0,
          row.totalVotes,
        ]),
      );
      continue;
    }

    for (const monthlyRow of row.monthly) {
      lines.push(
        toCsvRow([
          "poll_votes_per_location",
          row.location,
          row.location,
          monthlyRow.month,
          monthlyRow.votes,
          row.totalVotes,
        ]),
      );
    }
  }

  return `${lines.join("\n")}\n`;
};

exports.generateReports = async (req, res) => {
  try {
    const location = resolveLocation(req);
    const status = resolveStatusFilter(req.query);
    const { from, to } = resolveRange(req.query);
    const report = await buildAggregatedReport({ from, to, location, status });

    return res.status(200).json({
      success: true,
      generatedAt: new Date(),
      filters: {
        location,
        status,
        from,
        to,
      },
      data: report,
    });
  } catch (error) {
    const statusCode =
      error.statusCode ||
      (error.message.includes("must be earlier") ? 400 : 500);
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

exports.exportReports = async (req, res) => {
  try {
    const location = resolveLocation(req);
    const status = resolveStatusFilter(req.query);
    const { from, to } = resolveRange(req.query);
    const format = sanitizeText(req.query.format || "csv").toLowerCase();

    if (!["csv", "json"].includes(format)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported format. Use format=csv or format=json",
      });
    }

    const report = await buildAggregatedReport({ from, to, location, status });

    await logAction("export_reports", {
      userId: req.user._id,
      location,
      status,
      format,
      from,
      to,
    });

    if (format === "json") {
      return res.status(200).json({
        success: true,
        generatedAt: new Date(),
        filters: {
          location,
          status,
          from,
          to,
        },
        data: report,
      });
    }

    const csvContent = buildCsv(report);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="report-${timestamp}.csv"`,
    );

    return res.status(200).send(csvContent);
  } catch (error) {
    const statusCode =
      error.statusCode ||
      (error.message.includes("must be earlier") ? 400 : 500);
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
