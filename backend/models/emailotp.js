const mongoose = require("mongoose");
const crypto = require("crypto");
const validator = require('validator');

const otpSchema = new mongoose.Schema({

    hashedOTP: {
      type: String,
      required: true
    },
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
      },
      email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: {
          validator: validator.isEmail,
          message: 'Please enter a valid email'
        }
      },
      password: {
        type: String,
        required: true,
        // minlength: 6,
        select: false
      },
    
      mobile: {
        type: String,
        required: true,
       
      },
      avatar: {
        type: String,
        default: 'default_avatar.jpg' // Assuming you have a default avatar
      },
      role: {
        type: String,
        enum: ['user', 'admin'], // Only 'user' and 'admin' roles are allowed
        default: 'user'
      },
      resetPasswordToken: String,
      resetPasswordTokenExpire: Date,
      createdAt: {
        type: Date,
        default: Date.now
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
const OTP = mongoose.model("mailOTP", otpSchema);

module.exports = OTP;