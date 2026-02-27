const express = require("express");
const Petition = require("../models/Petition");
const auth = require("../src/middleware/authMiddleware");
const { isCitizen } = require("../src/middleware/roleMiddleware");
const jwt = require("jsonwebtoken");
const User = require("../src/models/user");

const router = express.Router();

/* ===========================
   GET ALL PETITIONS
=========================== */
router.get("/", async (req, res) => {
  try {
    let query = {};

    // Support for query parameters
    if (req.query.location) query.location = req.query.location;
    if (req.query.category) query.category = req.query.category;
    if (req.query.status) query.status = req.query.status;

    // "Soft Auth" for Location-Based Access:
    // If an official is logged in, restrict to their location.
    // If no one is logged in or it's a citizen, show all (public).
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user && user.role === "official") {
          query.location = user.location;
        }
      } catch (err) {
        // Token invalid or expired, proceed as public user
      }
    }

    const petitions = await Petition.find(query);
    res.json(petitions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================
   GET SINGLE PETITION
=========================== */
router.get("/:id", async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);

    if (!petition) {
      return res.status(404).json({ message: "Petition not found" });
    }

    res.json(petition);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================
   SIGN PETITION
=========================== */
router.post("/:id/sign", auth, isCitizen, async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);

    if (!petition) {
      return res.status(404).json({ message: "Petition not found" });
    }

    petition.signatures.push({
      signedAt: new Date()
    });

    await petition.save();

    res.json({
      message: "Signed successfully",
      totalSignatures: petition.signatures.length
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;