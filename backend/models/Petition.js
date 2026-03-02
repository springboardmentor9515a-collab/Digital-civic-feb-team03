const mongoose = require("mongoose");

const petitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
<<<<<<< HEAD
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"]
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"]
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["infrastructure", "environment", "public_safety", "education", "healthcare", "other"]
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true
    },
    status: {
      type: String,
      enum: ["under_review", "active", "resolved", "rejected"],
      default: "under_review"
=======
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
>>>>>>> 84b2565ce2f335c23ecbafd0118031e76927295a
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
<<<<<<< HEAD
    },
    signatures: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        signedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
=======
    }
  },
  {
    timestamps: true
  }
>>>>>>> 84b2565ce2f335c23ecbafd0118031e76927295a
);

module.exports = mongoose.model("Petition", petitionSchema);