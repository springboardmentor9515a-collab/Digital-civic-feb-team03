const express = require("express");
const router = express.Router();
const Petition = require("../models/Petition");

/* ===========================
   GET ALL PETITIONS
=========================== */
router.get("/", async (req, res) => {
  const petitions = await Petition.find();
  res.json(petitions);
});

/* ===========================
   GET SINGLE PETITION
=========================== */
router.get("/:id", async (req, res) => {
  const petition = await Petition.findById(req.params.id);
  res.json(petition);
});

/* ===========================
   SIGN PETITION
=========================== */
router.post("/:id/sign", async (req, res) => {
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