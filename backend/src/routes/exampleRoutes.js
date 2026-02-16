const express = require("express");
const auth = require("../middleware/authMiddleware");
const { isCitizen, isOfficial } = require("../middleware/roleMiddleware");

const router = express.Router();

// Example controller function (placeholder)
const dashboardController = (req, res) => {
  res.json({
    message: `Welcome ${req.user.name}!`,
    role: req.user.role,
    dashboard: req.user.role === "official" ? "Official Dashboard" : "Citizen Dashboard"
  });
};

// Usage example: Official-only route
router.get("/official-dashboard", auth, isOfficial, dashboardController);

// Usage example: Citizen-only route
router.get("/citizen-dashboard", auth, isCitizen, dashboardController);

// Usage example: Any authenticated user
router.get("/profile", auth, (req, res) => {
  res.json({
    message: "User profile",
    user: req.user
  });
});

module.exports = router;
