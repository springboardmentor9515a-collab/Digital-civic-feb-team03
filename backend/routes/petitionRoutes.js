const express = require("express");
const { createPetition, getPetitions, getPetitionById } = require("../controllers/petitionController");
const auth = require("../src/middleware/authMiddleware");
const { isCitizen } = require("../src/middleware/roleMiddleware");

const router = express.Router();

/* ===========================
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
