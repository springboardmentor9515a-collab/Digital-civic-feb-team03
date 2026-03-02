<<<<<<< HEAD
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const petitionRoutes = require("./routes/petitionRoutes");

dotenv.config();
connectDB();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/petitions", petitionRoutes);


=======
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import petitionRoutes from "./routes/petitionRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/civicx")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/api/petitions", petitionRoutes);

>>>>>>> 84b2565ce2f335c23ecbafd0118031e76927295a
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

<<<<<<< HEAD
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
=======
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
>>>>>>> 84b2565ce2f335c23ecbafd0118031e76927295a
