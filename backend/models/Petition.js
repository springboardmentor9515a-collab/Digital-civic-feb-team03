const mongoose = require("mongoose");

const petitionSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
    location: String,
    status: {
      type: String,
      default: "active"
    },
    signatures: [
      {
        signedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Petition", petitionSchema);