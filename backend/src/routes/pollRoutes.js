const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { isCitizen, isOfficial } = require('../middleware/roleMiddleware');
const pollController = require('../controllers/pollController');

// POST /api/polls - Create a new poll (Official only)
router.post('/', auth, isOfficial, pollController.createPoll);

// GET /api/polls - Get all polls
router.get('/', auth, pollController.getPolls);

// GET /api/polls/:id - Get poll by ID
router.get('/:id', auth, pollController.getPollById);

// POST /api/polls/:id/vote - Vote on a poll (Citizen only)
router.post('/:id/vote', auth, isCitizen, pollController.voteOnPoll);

module.exports = router;
