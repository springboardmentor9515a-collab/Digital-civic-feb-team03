const express = require("express");
const { registerUser, loginUser, getMe, getLocations } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", auth, getMe);
router.get("/locations", auth, getLocations);

module.exports = router;
