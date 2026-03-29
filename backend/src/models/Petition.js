const mongoose = require("mongoose");

const petitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "infrastructure",
        "environment",
        "public_safety",
        "education",
        "healthcare",
        "other",
      ],
      index: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["under_review", "active", "resolved", "rejected"],
      default: "under_review",
      index: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    signatures: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        signedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    officialResponse: {
      type: String,
      trim: true,
      maxlength: [2000, "Official response cannot exceed 2000 characters"],
      default: null,
    },
    officialRespondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    officialRespondedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Petition", petitionSchema);
