const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { isOfficial } = require("../middleware/roleMiddleware");
const { validateObjectIdParam } = require("../middleware/validateObjectId");
const {
  attachLocationFilter,
  enforcePollLocationAccess,
} = require("../middleware/pollAccessMiddleware");
const pollController = require("../controllers/pollController");

// POST /api/polls - Create a new poll (Official only)
router.post("/", auth, isOfficial, pollController.createPoll);

// GET /api/polls - Get all polls
router.get("/", auth, attachLocationFilter, pollController.getPolls);

// GET /api/polls/:id - Get poll by ID
router.get(
  "/:id",
  auth,
  validateObjectIdParam("id"),
  enforcePollLocationAccess,
  pollController.getPollById,
);

module.exports = router;
