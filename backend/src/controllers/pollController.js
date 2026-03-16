const Poll = require("../models/Poll");

const sanitizePlainText = (value) =>
  String(value)
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const sanitizeOptions = (options = []) => {
  const cleanedOptions = options
    .map((option) => sanitizePlainText(option))
    .filter((option) => option.length > 0);

  const uniqueOptions = [];
  const seen = new Set();

  for (const option of cleanedOptions) {
    const key = option.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueOptions.push(option);
    }
  }

  return uniqueOptions;
};

// Create Poll
const createPoll = async (req, res) => {
  try {
    const { title, options, targetLocation } = req.body;

    const sanitizedTitle = sanitizePlainText(title);
    const sanitizedLocation = sanitizePlainText(targetLocation);
    const sanitizedOptions = sanitizeOptions(
      Array.isArray(options) ? options : [],
    );

    if (!sanitizedTitle || !sanitizedLocation || sanitizedOptions.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Title, targetLocation and at least two valid poll options are required",
      });
    }

    const poll = new Poll({
      title: sanitizedTitle,
      options: sanitizedOptions,
      targetLocation: sanitizedLocation,
      createdBy: req.user?._id || null,
    });

    await poll.save();

    res.status(201).json({
      success: true,
      message: "Poll created successfully",
      poll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Polls
const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find(req.locationFilter || {}).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      polls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Poll
const getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    res.status(200).json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPoll,
  getPolls,
  getPollById,
};
