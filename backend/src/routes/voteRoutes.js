const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { isCitizen } = require("../middleware/roleMiddleware");
const { validateObjectIdParam } = require("../middleware/validateObjectId");
const {
  enforcePollLocationAccess,
} = require("../middleware/pollAccessMiddleware");
const { voteRateLimit } = require("../middleware/voteRateLimitMiddleware");

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
  validateObjectIdParam("id"),
  enforcePollLocationAccess,
  getPollResults,
);

module.exports = router;
