const Poll = require("../models/Poll");

// Create Poll
const createPoll = async (req, res) => {
  try {
    const { title, options, targetLocation } = req.body;

    const poll = new Poll({
      title,
      options,
      targetLocation,
      createdBy: null,
    });

    await poll.save();

    res.status(201).json({
      success: true,
      message: "Poll created successfully",
      poll
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Polls
const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find();

    res.status(200).json({
      success: true,
      polls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
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