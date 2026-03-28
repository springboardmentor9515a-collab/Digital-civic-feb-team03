const express = require('express');
const router = express.Router();
const { generateReports, exportReports } = require('../controllers/reportsController');
// const { protect, isOfficial } = require('../middleware/authMiddleware'); // Uncomment when middleware is ready

// Routes for Reporting APIs (Milestone 4 - Task 3)
// GET / (Auth required, Role = official)
router.get('/', /* protect, isOfficial, */ generateReports);

// GET /export (Auth required, Role = official)
router.get('/export', /* protect, isOfficial, */ exportReports);

module.exports = router;
