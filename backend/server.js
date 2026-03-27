const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const signatureRoutes = require("./src/routes/signatureRoutes");
const petitionRoutes = require("./src/routes/petitionRoutes");
const pollRoutes = require("./src/routes/pollRoutes");
const voteRoutes = require("./src/routes/voteRoutes");
const analyticsRoutes = require("./src/routes/analyticsRoutes");

dotenv.config();
connectDB();

const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/petitions", signatureRoutes);
app.use("/api/petitions", petitionRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/polls", voteRoutes);
app.use("/api/reports", analyticsRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
