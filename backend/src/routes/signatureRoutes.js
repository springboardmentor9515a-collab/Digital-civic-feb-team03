const express = require("express");
const router = express.Router();

const {
  signPetition,
  getSignatureCount,
} = require("../controllers/signatureController");

const auth = require("../middleware/authMiddleware");
const { isCitizen } = require("../middleware/roleMiddleware");
const { validateObjectIdParam } = require("../middleware/validateObjectId");
const {
  enforcePetitionLocationAccess,
} = require("../middleware/petitionAccessMiddleware");
const {
  responseRateLimit,
  reportRateLimit,
} = require("../middleware/voteRateLimitMiddleware");

// Sign Petition (Protected)
router.post(
  "/:id/sign",
  auth,
  isCitizen,
  validateObjectIdParam("id"),
  enforcePetitionLocationAccess,
  responseRateLimit,
  signPetition,
);

// Get Signature Count (Protected and location-scoped)
router.get(
  "/:id/signatures/count",
  auth,
  validateObjectIdParam("id"),
  enforcePetitionLocationAccess,
  reportRateLimit,
  getSignatureCount,
);

module.exports = router;
