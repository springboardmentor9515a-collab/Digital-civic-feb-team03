import express from "express";
import Petition from "../models/Petition.js";

const router = express.Router();

/* ===========================
   GET ALL PETITIONS
=========================== */
router.get("/", async (req, res) => {
  try {
    const petitions = await Petition.find();
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

export default router;