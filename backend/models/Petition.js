const mongoose = require("mongoose");

const petitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      index: true
    },
    location: {
      type: String,
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ["active", "under_review", "closed"],
      default: "under_review",
      index: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Petition", petitionSchema);