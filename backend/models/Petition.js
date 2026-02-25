import mongoose from "mongoose";

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

export default mongoose.model("Petition", petitionSchema);