const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { isCitizen, isOfficial } = require("../middleware/roleMiddleware");
const { validateObjectIdParam } = require("../middleware/validateObjectId");
const {
  enforcePollLocationAccess,
} = require("../middleware/pollAccessMiddleware");
const { voteRateLimit, reportRateLimit } = require("../middleware/voteRateLimitMiddleware");

const { castVote, getPollResults } = require("../controllers/voteController");

router.post(
  "/:id/vote",
  auth,
  isCitizen,
  validateObjectIdParam("id"),
  enforcePollLocationAccess,
  voteRateLimit,
  castVote,
);
router.get(
  "/:id/results",
  auth,
  isOfficial,
  validateObjectIdParam("id"),
  enforcePollLocationAccess,
  reportRateLimit,
  getPollResults,
);

module.exports = router;
