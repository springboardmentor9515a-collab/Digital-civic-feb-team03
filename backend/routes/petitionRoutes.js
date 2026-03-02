<<<<<<< HEAD
const express = require("express");
const { createPetition, getPetitions, getPetitionById } = require("../controllers/petitionController");
const auth = require("../src/middleware/authMiddleware");
const { isCitizen } = require("../src/middleware/roleMiddleware");
=======
import express from "express";
import Petition from "../models/Petition.js";
>>>>>>> 84b2565ce2f335c23ecbafd0118031e76927295a

const router = express.Router();

/* ===========================
<<<<<<< HEAD
   CREATE PETITION (Auth required, Citizen only)
=========================== */
router.post("/", auth, isCitizen, createPetition);

/* ===========================
   GET ALL PETITIONS (Public endpoint with filters)
=========================== */
router.get("/", getPetitions);

/* ===========================
   GET SINGLE PETITION BY ID (Public endpoint)
=========================== */
router.get("/:id", getPetitionById);

module.exports = router;
=======
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
>>>>>>> 84b2565ce2f335c23ecbafd0118031e76927295a
