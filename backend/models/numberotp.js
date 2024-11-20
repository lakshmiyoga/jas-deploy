const mongoose = require("mongoose");
const crypto = require("crypto");

const otpSchema = new mongoose.Schema({
    mobileNumber: {
      type: String,
      required: true
    },
    hashedOTP: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      // expires: 180 // Set expiration to 3 minutes (180 seconds)
    }
  });

// Pre-save middleware to hash the OTP before saving
otpSchema.pre("save", function(next) {
    if (!this.isModified("hashedOTP")) {
        return next();
    }
    
    try {
        // Hash the OTP using SHA-256 algorithm
        const hashedOTP = crypto.createHash("sha256").update(this.hashedOTP).digest("hex");
        this.hashedOTP = hashedOTP;
        next();
    } catch (error) {
        next(error);
    }
});

// Create a model using the OTP schema
const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;