const Petition = require("../models/Petition");
const { logAction } = require("../utils/logger");

const ALLOWED_STATUSES = new Set([
  "under_review",
  "active",
  "resolved",
  "rejected",
]);

const ALLOWED_RESPONSE_STATUSES = new Set(["active", "resolved", "rejected"]);

const normalizeLocation = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const sanitizeText = (value) =>
  String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();

exports.getPetitionsForOfficial = async (req, res) => {
  try {
    if (!req.user?.location) {
      return res.status(403).json({
        success: false,
        message: "Official location is required",
      });
    }

    const requestedLocation = sanitizeText(
      req.query.location || req.user.location,
    );
    const userLocation = sanitizeText(req.user.location);

    if (
      requestedLocation &&
      normalizeLocation(requestedLocation) !== normalizeLocation(userLocation)
    ) {
      return res.status(403).json({
        success: false,
        message: "Cross-location access is not allowed",
      });
    }

    const status = sanitizeText(req.query.status);
    if (status && !ALLOWED_STATUSES.has(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status filter",
      });
    }

    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 20, 1),
      100,
    );

    const filter = {
      location: new RegExp(`^${escapeRegExp(userLocation)}$`, "i"),
    };

    if (status) {
      filter.status = status;
    }

    const [petitions, total] = await Promise.all([
      Petition.find(filter)
        .populate("creator", "name email location")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Petition.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      petitions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPetitions: total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      filters: {
        location: userLocation,
        status: status || null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.respondToPetition = async (req, res) => {
  try {
    const petitionId = req.params.id;
    const responseText = sanitizeText(req.body?.responseText);
    const nextStatus = sanitizeText(req.body?.status || "resolved");

    if (!responseText) {
      return res.status(400).json({
        success: false,
        message: "responseText is required",
      });
    }

    if (responseText.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "responseText must be at most 2000 characters",
      });
    }

    if (!ALLOWED_RESPONSE_STATUSES.has(nextStatus)) {
      return res.status(400).json({
        success: false,
        message: "status must be one of: active, resolved, rejected",
      });
    }

    const petition = await Petition.findByIdAndUpdate(
      petitionId,
      {
        $set: {
          status: nextStatus,
          officialResponse: responseText,
          officialRespondedBy: req.user._id,
          officialRespondedAt: new Date(),
        },
      },
      { new: true },
    )
      .populate("creator", "name email location")
      .populate("officialRespondedBy", "name email location role");

    if (!petition) {
      return res.status(404).json({
        success: false,
        message: "Petition not found",
      });
    }

    await logAction("respond_to_petition", {
      userId: req.user._id,
      petitionId,
      location: req.user.location,
      status: nextStatus,
      responseText,
    });

    return res.status(200).json({
      success: true,
      message: "Petition response submitted",
      petition,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
