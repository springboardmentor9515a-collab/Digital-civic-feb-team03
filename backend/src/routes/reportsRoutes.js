const express = require("express");
const {
  generateReports,
  exportReports,
} = require("../controllers/reportsController");
const auth = require("../middleware/authMiddleware");
const { isOfficial } = require("../middleware/roleMiddleware");
const { reportRateLimit } = require("../middleware/voteRateLimitMiddleware");

const router = express.Router();

router.get("/", auth, isOfficial, reportRateLimit, generateReports);

router.get("/export", auth, isOfficial, reportRateLimit, exportReports);

module.exports = router;
