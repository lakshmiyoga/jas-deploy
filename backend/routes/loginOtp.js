const express =require('express');
const { isAuthenticateUser, authorizeRoles } = require('../middleware/authmiddleware');
const { generateOtp, verifyOtp} = require("../controllers/LoginOtpController");
const router = express.Router();



router.post('/send-otp', generateOtp);
router.post('/verify-otp', verifyOtp);




module.exports=router;