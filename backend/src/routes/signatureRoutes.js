const express = require("express");
const router = express.Router();

const {
  signPetition,
  getSignatureCount,
} = require("../controllers/signatureController");

const auth = require("../middleware/authMiddleware");
const { isCitizen } = require("../middleware/roleMiddleware");

// Sign Petition (Protected)
router.post("/:id/sign", auth, isCitizen, signPetition);

// Get Signature Count (Public)
router.get("/:id/signatures/count", getSignatureCount);

module.exports = router;