const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["citizen", "official"],
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // 🆕 ADD THESE OPTIONAL VERIFICATION FIELDS
    governmentId: {
      type: String,
      default: null,
      sparse: true, // Allows multiple null values
    },

    verificationDocument: {
      type: String, // Will store file path/URL when verification is implemented
      default: null,
    },
  },
  { timestamps: true }
);

//  Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//  Compare password during login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);