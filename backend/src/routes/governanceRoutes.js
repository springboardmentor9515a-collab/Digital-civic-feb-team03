const express = require("express");
const {
  getPetitionsForOfficial,
  respondToPetition,
} = require("../controllers/governanceController");
const auth = require("../middleware/authMiddleware");
const { isOfficial } = require("../middleware/roleMiddleware");
const { validateObjectIdParam } = require("../middleware/validateObjectId");
const {
  enforcePetitionLocationAccess,
} = require("../middleware/petitionAccessMiddleware");
const {
  responseRateLimit,
  reportRateLimit,
} = require("../middleware/voteRateLimitMiddleware");

const router = express.Router();

router.get(
  "/petitions",
  auth,
  isOfficial,
  reportRateLimit,
  getPetitionsForOfficial,
);

router.post(
  "/petitions/:id/respond",
  auth,
  isOfficial,
  validateObjectIdParam("id"),
  enforcePetitionLocationAccess,
  responseRateLimit,
  respondToPetition,
);

module.exports = router;
