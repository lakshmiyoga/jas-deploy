
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require('../utils/errorHandler');

const _ = require('lodash');
// const express = require('express');

const OTP = require('../models/numberotp');
const mailOTP = require('../models/emailotp');
const twilio = require('twilio');
const crypto = require("crypto");
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
// const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { generateToken, sendToken } = require('../middleware/authmiddleware');
const User = require('../models/userModel');


const validator = require("validator");
const dummyRegister = require('../models/dummyRegister');

// dotenv.config({ path: path.join(__dirname, '../config/config.env') });




const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken) {
    throw new Error("Twilio account SID and auth token must be set as environment variables.");
  }
  
  const client = twilio(accountSid, authToken);
  


//generate mobile otp
const mailOtp = catchAsyncError(async (req, res, next) => {
    const { name, email, password, mobile } = req.body;
    console.log("REGISTER",req.body)
  
    let avatar;
  
    let BASE_URL = process.env.BACKEND_URL;
    if (process.env.NODE_ENV === "production") {
      BASE_URL = `${req.protocol}://${req.get('host')}`
    }
  
  
    if (req.file) {
        console.log("req.file",req.file)
  
      const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
      
      if (fileExtension !== 'jpg' && fileExtension !== 'png' && fileExtension !== 'jpeg') {
        return next(new ErrorHandler('Only .jpg and .png files are allowed'));
      }
    //   avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
    avatar = req.file.location;
    }
  
    // Name validation
    if ( !name) {
      return next(new ErrorHandler('Please enter Name', 400));
    }
    if ( name.trim().length < 2) {
      return next(new ErrorHandler('Name must be at least 2 characters long', 400));
    }
  
    // Email validation
    if (!email || !validator.isEmail(email)) {
      return next(new ErrorHandler('Please enter a valid email', 400));
    }
  
    // Password validation
    // if (!password || password.length < 6) {
    //   return next(new ErrorHandler('Password must be at least 6 characters long', 400));
    // }
    try {
      let user = await User.findOne({ email }).select('+password');
      if (user) {
        return next(new ErrorHandler('Email already exists', 400));
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const hashedOTP = Math.floor(100000 + Math.random() * 900000);
  
  
      try {
        const existingOTP = await mailOTP.findOne({ email });
       console.log(existingOTP,"existingOTP");
        if (existingOTP) {
          // If the mobile number exists, delete the old data
          await mailOTP.findOneAndDelete({ email });
        }
        // Save the OTP document to the database
        await mailOTP.create({email , 
          hashedOTP ,
          name,
          email,
          password: hashedPassword,
          mobile,
          avatar, 
        });
        // setTimeout(async () => {
        //   await mailOTP.findOneAndDelete({ email });
        // }, 1 * 60 * 1000);
    
      } catch (error) {
        return next(new ErrorHandler(error.message, 500))
      }
    
    
      // Send OTP via email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SEND_MAIL, // Your Gmail email address
          pass: process.env.MAIL_PASS // Your Gmail password
        }
      });
    
      const mailOptions = {
        from: 'abangokul@gmail.com',
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP for verification is: ${hashedOTP}`
      };

      const dummyuserData = await mailOTP.findOne({ email }).select('+password');
    
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        //   console.log(error);
        //   res.status(500).json({ error: 'Failed to send OTP' });
          return next(new ErrorHandler("Failed to send OTP", 500))
        } else {
          console.log('Email sent: ' + info.response);
          
          res.status(200).json({ message: 'OTP sent successfully',dummyuserData,status:200 });
        }
      });
  
  
      // const dummyregUser = new dummyRegister({
      //   name,
      //   email,
      //   password: hashedPassword,
      //   mobile,
      //   avatar,
      //   otp:hashedOTP,
      // });
  
      // console.log("regUser",regUser)
  
      // await dummyregUser.save();
      // sendToken(dummyregUser, 201, res);
      
    } catch (error) {
      console.log("error",error)
      return next(new ErrorHandler(error.message, 500));
  
    }
  });

// exports.mobileOtp= catchAsyncError(async (req, res, next) => {
//     const { mobileNumber } = req.body;

//     if(!mobileNumber){
//         return next(new ErrorHandler("Please provide the Number", 500))
//     }
//     const hashedOTP = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
  
//     try {
//       const existingOTP = await OTP.findOne({ mobileNumber });
  
//       if (existingOTP) {
//         await OTP.findOneAndDelete({ mobileNumber });
//       }
//       await OTP.create({ mobileNumber, hashedOTP });
//       setTimeout(async () => {
//         await OTP.findOneAndDelete({ mobileNumber });
//       }, 1 * 60 * 1000);
//     } catch (error) {
//       return next(new ErrorHandler('Failed to send OTP', 500))
//     }
  
//     // Send OTP via Twilio
//     client.messages.create({
//       body: `Your OTP is ${hashedOTP}`,
//       from: twilioPhoneNumber,
//       to: mobileNumber
//     })
//     .then(() => {
//       res.status(200).json({ message: 'OTP sent successfully', status: 200 });
//     })
//     .catch((error) => {
//       return next(new ErrorHandler('Failed to send OTP Check the Number', 500))
//     });
// })

// //verify mobile otp


const mailOtpVerify = catchAsyncError(async (req, res, next) => {
       const { email, hashedOTP ,otpdata} = req.body;
       console.log("hashedOTP",hashedOTP)
   if(!email){
    return next(new ErrorHandler("email not found", 500))
   }
  if(!hashedOTP){
    return next(new ErrorHandler("Please enter OTP", 500))
   }

  if(email,hashedOTP){
    try {
      const storedOTP = await mailOTP.findOne({ email });
  
      if (storedOTP) {
        const providedHashedOTP = crypto.createHash("sha256").update(hashedOTP).digest("hex");
        
        if (providedHashedOTP === storedOTP.hashedOTP) {
          const currentTime = new Date();
          const otpTimestamp = new Date(storedOTP.timestamp);
          
          if (currentTime - otpTimestamp <= 1 * 60 * 1000) {
            // res.status(200).json({ message: 'Email verified successfully',status:200 });
            const regUser = new User({
                name:otpdata.dummyuserData.name,
                email:otpdata.dummyuserData.email,
                password:otpdata.dummyuserData.password,
                mobile:otpdata.dummyuserData.mobile,
                avatar:otpdata.dummyuserData.avatar
              });
          
              console.log("regUser",regUser)
          
              await regUser.save();
              sendToken(regUser, 201, res);
            await mailOTP.deleteOne({ _id: storedOTP._id });
          } 
          
          else {
             next(new ErrorHandler("OTP has expired", 400))
            await mailOTP.deleteOne({ _id: storedOTP._id }); // Delete the expired OTP
          }
        } else {
          next(new ErrorHandler("Invalid OTP", 400))
        //   await mailOTP.deleteOne({ _id: storedOTP._id });
        }
      } else {
       return next(new ErrorHandler("OTP not found", 400))
      }
    } catch (error) {
       return next(new ErrorHandler(error.message, 500))
    }

  }
else{
    return next(new ErrorHandler("Failed to verify OTP", 500))
}
  
  });
  

// exports.mobileOtpVerify= catchAsyncError(async (req, res, next) => {
    
//     const { mobileNumber, hashedOTP } = req.body;
//     if(!mobileNumber){
//         return next(new ErrorHandler("Please Enter Mobile Number", 500))
//     }
//     else if(!hashedOTP){
//         return next(new ErrorHandler("Please Enter OTP", 500))
//     }

//     if(mobileNumber && hashedOTP){

//     try {
//     const storedOTP = await OTP.findOne({ mobileNumber });

//     if (storedOTP) {
//       const providedHashedOTP = crypto.createHash("sha256").update(hashedOTP).digest("hex");
      
//       if (providedHashedOTP === storedOTP.hashedOTP) {
//         const currentTime = new Date();
//         const otpTimestamp = new Date(storedOTP.timestamp);
        
//         if (currentTime - otpTimestamp <= 1 * 60 * 1000) {
//           // OTP is valid
//           res.status(200).json({message : 'Mobile number verified successfully',status:200 });
//           await OTP.deleteOne({ _id: storedOTP._id }); // Delete the expired OTP
//         } 
//         else {
//           next(new ErrorHandler('OTP has expired', 400))
//           await OTP.deleteOne({ _id: storedOTP._id }); // Delete the expired OTP
//         }
//       } else {
//         next(new ErrorHandler('Invalid OTP', 400))
//         await OTP.deleteOne({ _id: storedOTP._id }); 
//       }
//     } else {
//       return next(new ErrorHandler('OTP not found', 400))
//     }
//   } catch (error) {
//     return next(new ErrorHandler(error.message, 500))

//   }

// }
// else{
//   return next(new ErrorHandler("Failed to verify OTP", 500))

// }
  
// })

// //generate mail otp

// exports.mailOtp= catchAsyncError(async (req, res, next) => {
//     const { email } = req.body;
//     if(!email){
//         return next(new ErrorHandler("Enter the mail", 500))
//     }
//   const hashedOTP = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

//   try {
//     const existingOTP = await mailOTP.findOne({ email });

//     if (existingOTP) {
//       // If the mobile number exists, delete the old data
//       await mailOTP.findOneAndDelete({ email });
//     }
//     // Save the OTP document to the database
//     await mailOTP.create({email , hashedOTP });
//     setTimeout(async () => {
//       await mailOTP.findOneAndDelete({ email });
//     }, 1 * 60 * 1000);

//   } catch (error) {
//     return next(new ErrorHandler(error.message, 500))
//   }


//   // Send OTP via email
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.SEND_MAIL, // Your Gmail email address
//       pass: process.env.MAIL_PASS // Your Gmail password
//     }
//   });

//   const mailOptions = {
//     from: 'abangokul@gmail.com',
//     to: email,
//     subject: 'OTP Verification',
//     text: `Your OTP for verification is/n/n: ${hashedOTP}`
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//     //   console.log(error);
//     //   res.status(500).json({ error: 'Failed to send OTP' });
//       return next(new ErrorHandler("Failed to send OTP", 500))
//     } else {
//       console.log('Email sent: ' + info.response);
//       res.status(200).json({ message: 'OTP sent successfully',status:200 });
//     }
//   });
// })

// // verify mail otp

// exports.mailOtpVerify= catchAsyncError(async (req, res, next) => {
//     const { email, hashedOTP } = req.body;
//    if(!email){
//     return next(new ErrorHandler("Please enter email", 500))
//    }
//   if(!hashedOTP){
//     return next(new ErrorHandler("Please enter OTP", 500))
//    }

//   if(email,hashedOTP){
//     try {
//       const storedOTP = await mailOTP.findOne({ email });
  
//       if (storedOTP) {
//         const providedHashedOTP = crypto.createHash("sha256").update(hashedOTP).digest("hex");
        
//         if (providedHashedOTP === storedOTP.hashedOTP) {
//           const currentTime = new Date();
//           const otpTimestamp = new Date(storedOTP.timestamp);
          
//           if (currentTime - otpTimestamp <= 1 * 60 * 1000) {
//             res.status(200).json({ message: 'Email verified successfully',status:200 });
//             await mailOTP.deleteOne({ _id: storedOTP._id });
//           } 
          
//           else {
//              next(new ErrorHandler("OTP has expired", 400))
//             await mailOTP.deleteOne({ _id: storedOTP._id }); // Delete the expired OTP
//           }
//         } else {
//           next(new ErrorHandler("Invalid OTP", 400))
//           await mailOTP.deleteOne({ _id: storedOTP._id });
//         }
//       } else {
//        return next(new ErrorHandler("OTP not found", 400))
//       }
//     } catch (error) {
//        return next(new ErrorHandler(error.message, 500))
//     }

//   }
// else{
//     return next(new ErrorHandler("Failed to verify OTP", 500))
// }
// })


module.exports = { mailOtp ,mailOtpVerify };