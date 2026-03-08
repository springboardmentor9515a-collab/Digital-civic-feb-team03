const express = require("express");
const router = express.Router();

const {
  castVote,
  getPollResults
} = require("../controllers/voteController");

router.post("/:id/vote", castVote);
router.get("/:id/results", getPollResults);

module.exports = router;