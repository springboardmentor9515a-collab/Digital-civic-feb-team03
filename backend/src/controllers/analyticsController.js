const Petition = require("../models/Petition");
const Signature = require("../models/Signature");
const Vote = require("../models/Vote");

const parseMonthRange = (query) => {
  const now = new Date();
  const monthsBack = Number.parseInt(query.monthsBack, 10);
  const safeMonthsBack = Number.isFinite(monthsBack) && monthsBack > 0 ? Math.min(monthsBack, 36) : 12;

  const from = new Date(now.getFullYear(), now.getMonth() - (safeMonthsBack - 1), 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return { from, to, monthsBack: safeMonthsBack };
};

const monthLabelExpression = {
  $dateToString: {
    format: "%Y-%m",
    date: "$createdAt",
  },
};

exports.getPetitionsPerStatus = async (req, res) => {
  try {
    const { from, to, monthsBack } = parseMonthRange(req.query);

    const data = await Petition.aggregate([
      {
        $match: {
          createdAt: { $gte: from, $lt: to },
        },
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
      {
        $sort: {
          status: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      monthsBack,
      range: { from, to },
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSignaturesPerPetition = async (req, res) => {
  try {
    const { from, to, monthsBack } = parseMonthRange(req.query);

    const data = await Signature.aggregate([
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
        $group: {
          _id: {
            petitionId: "$petition._id",
            title: "$petition.title",
            status: "$petition.status",
            location: "$petition.location",
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
            status: "$_id.status",
            location: "$_id.location",
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
          status: "$_id.status",
          location: "$_id.location",
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
    ]);

    return res.status(200).json({
      success: true,
      monthsBack,
      range: { from, to },
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPollVotesPerLocation = async (req, res) => {
  try {
    const { from, to, monthsBack } = parseMonthRange(req.query);

    const data = await Vote.aggregate([
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
      {
        $sort: {
          totalVotes: -1,
          location: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      monthsBack,
      range: { from, to },
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
