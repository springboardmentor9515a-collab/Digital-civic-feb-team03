const express = require("express");
const router = express.Router();

const {
  createPoll,
  getPolls,
  getPollById
} = require("../controllers/pollController");

router.post("/", createPoll);
router.get("/", getPolls);
router.get("/:id", getPollById);

module.exports = router;