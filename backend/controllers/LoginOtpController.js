const express = require('express');
const router = express.Router();
const Userlogin = require('../models/userModel');
const twilio = require('twilio');
const jwt = require('jsonwebtoken');
const catchAsyncError = require("../middleware/catchAsyncError");
const { sendToken } = require('../middleware/authmiddleware');
const nodemailer = require('nodemailer');

const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

// Generate and send OTP

const generateOtp = catchAsyncError(async (req, res, next) => {
    const { input, inputType } = req.body;
    console.log("input inputType", input, inputType);

    // Validate email or phone
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    const isPhone = /^(\+?[1-9]\d{1,14}|\d{10})$/.test(input);

    if (!isEmail && !isPhone) {
        return res.status(400).json({ error: `Invalid ${inputType}!` });
    }

    // Generate OTP and expiry time
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 30 * 1000);

    try {
        let user;

        // Check if a user already exists with this email or phone
        if (isPhone && inputType === 'phone') {
            user = await Userlogin.findOne({ mobile: input });
        } else {
            user = await Userlogin.findOne({ email: input });
        }

        console.log("User found:", user);

        // If user exists, update OTP; otherwise, create a new user
        if (user) {
            user.otp = otp;
            user.otpExpiry = otpExpiry;
        } else {
            user = new Userlogin({
                email: isEmail ? input : undefined,
                mobile: isPhone ? input : undefined,
                otp,
                otpExpiry,
            });
        }

        // Save user with the OTP
        await user.save();

        // Send OTP via SMS if it's a phone number
        if (isPhone && inputType === 'phone') {
            try {
                const response = await client.messages.create({
                    body: `Your OTP is ${otp}`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: input.startsWith('+91') ? input : `+91${input}`,  // Prefix +91 if missing
                });
                console.log("mobile response", response);
                return res.status(201).json({ message: `OTP sent successfully to ${input.startsWith('+') ? input : `+91${input}`}.` });
            } catch (twilioError) {
                console.error('Twilio Error:', twilioError);
                return res.status(twilioError.status || 500).json({
                    error: twilioError.message,
                });
            }
        } else {

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.SEND_MAIL, // Your Gmail email address
                    pass: process.env.MAIL_PASS // Your Gmail password
                }
            });

            const mailOptions = {
                from: 'jasfruitsandvegetables@gmail.com',
                to: input,
                subject: 'OTP Verification',
                text: `Your OTP for verification is: ${otp}`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                try {
                    if (error) {
                        console.log("mailerror", error)
                        return next(new ErrorHandler("Failed to send OTP", 500))
                    } else {
                        console.log('Email sent: ' + info.response);

                        return res.status(201).json({ message: `OTP sent via ${input}.` });
                    }
                } catch (nodeMailerError) {
                    console.error('nodemailer Error:', nodeMailerError);
                    return next(new ErrorHandler("Failed to send OTP", 500))
                }
            });

        }
    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: 'Error processing request' });
    }
});


const verifyOtp = catchAsyncError(async (req, res, next) => {
    const { input, otp } = req.body;
    console.log("verify messages", input, otp);
    if (!input) {
        return res.status(400).json({ success: false, message: 'Invalid Email or PhoneNo!' });
    }
    if (!otp) {
        return res.status(400).json({ success: false, message: 'Please Enter OTP!' });
    }

    try {
        // Find the user based on email or phone
        const user = await Userlogin.findOne({
            $or: [{ email: input }, { mobile: input }]
        });

        // Check if user exists and OTP matches
        if (!user || user.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP!' });
        }

        // Check if OTP has expired
        if (user.otpExpiry < new Date()) {
            return res.status(400).json({ success: false, message: 'OTP has expired!' });
        }

        // Clear OTP after successful verification
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        // Send response with token and user data
        //    return res.status(200).json({
        //         success: true,
        //         token,
        //         message: 'OTP verified successfully.',
        //         user,
        //     });

        // Send response with token and user data
        return sendToken(user, 201, res);

    } catch (error) {
        console.error("Error during OTP verification:", error);
        return res.status(500).json({ success: false, message: 'Error during OTP verification.' });
    }
});


module.exports = { generateOtp, verifyOtp };