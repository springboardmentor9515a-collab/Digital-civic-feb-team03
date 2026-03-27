const express = require("express");
const auth = require("../middleware/authMiddleware");
const { isOfficial } = require("../middleware/roleMiddleware");
const { reportRateLimit } = require("../middleware/voteRateLimitMiddleware");
const {
  getPetitionsPerStatus,
  getSignaturesPerPetition,
  getPollVotesPerLocation,
} = require("../controllers/analyticsController");

const router = express.Router();

// Strict role-based access: analytics reports are official-only.
router.get("/petitions/status", auth, isOfficial, reportRateLimit, getPetitionsPerStatus);
router.get("/signatures/petition", auth, isOfficial, reportRateLimit, getSignaturesPerPetition);
router.get("/votes/location", auth, isOfficial, reportRateLimit, getPollVotesPerLocation);

module.exports = router;
