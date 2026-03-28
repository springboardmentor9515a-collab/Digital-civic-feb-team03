const express = require('express');
const router = express.Router();
const { getPetitionsForOfficial, respondToPetition } = require('../controllers/governanceController');
// const { protect, isOfficial } = require('../middleware/authMiddleware'); // Uncomment when middleware is ready

// Routes for Governance APIs (Milestone 4 - Task 2)
// GET /petitions (Auth required, Role = official)
router.get('/petitions', /* protect, isOfficial, */ getPetitionsForOfficial);

// POST /petitions/:id/respond (Auth required, Role = official)
router.post('/petitions/:id/respond', /* protect, isOfficial, */ respondToPetition);

module.exports = router;
