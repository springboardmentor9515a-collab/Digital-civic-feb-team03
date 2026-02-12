const User = require("../models/user");
const jwt = require("jsonwebtoken");

// 🔐 Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};



// ================= REGISTER =================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, location } = req.body;

    // 1️⃣ Check if all fields exist
    if (!name || !email || !password || !role || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 3️⃣ Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      location,
    });

    // 4️⃣ Generate token
    const token = generateToken(user._id);

    // 5️⃣ Send response
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4️⃣ Generate token
    const token = generateToken(user._id);

    // 5️⃣ Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
