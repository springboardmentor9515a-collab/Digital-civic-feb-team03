const mongoose = require("mongoose");
const Vote = require("../models/Vote");
const Poll = require("../models/Poll");

const sanitizePlainText = (value) =>
  String(value)
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();

// Cast a vote
exports.castVote = async (req, res) => {
  try {
    const selectedOption = sanitizePlainText(req.body?.selectedOption || "");
    const pollId = req.params.id;
    const userId = req.user._id;

    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    if (!selectedOption) {
      return res.status(400).json({ message: "selectedOption is required" });
    }

    const normalizedPollOptions = (poll.options || []).map((option) =>
      sanitizePlainText(option).toLowerCase(),
    );
    if (!normalizedPollOptions.includes(selectedOption.toLowerCase())) {
      return res.status(400).json({ message: "Invalid selected option" });
    }

    const vote = new Vote({
      poll: pollId,
      user: userId,
      selectedOption,
    });

    await vote.save();

    res.status(201).json({
      success: true,
      message: "Vote recorded",
      vote,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "User already voted in this poll",
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getPollResults = async (req, res) => {
  try {
    const pollId = req.params.id;

    const poll = await Poll.findById(pollId).select("_id");
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    const results = await Vote.aggregate([
      {
        $match: {
          poll: new mongoose.Types.ObjectId(pollId),
        },
      },
      {
        $group: {
          _id: "$selectedOption",
          votes: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
