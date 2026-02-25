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

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});