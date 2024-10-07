const express =require('express');
const { isAuthenticateUser, authorizeRoles } = require('../middleware/authmiddleware');
const { mobileOtp, mobileOtpVerify, mailOtp, mailOtpVerify } = require('../controllers/otpController');

const router = express.Router();
const multer = require('multer');
const path = require('path')

const upload = multer({storage: multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(  __dirname,'..' , 'uploads/user' ) )
    },
    filename: function(req, file, cb ) {
        cb(null, file.originalname)
    }
}) })

// router.post('/generateOTP/mobile/', mobileOtp);
// router.post('/verifyOTP/mobile/',mobileOtpVerify);
router.post('/generateOTP/mail/',upload.single('avatar'), mailOtp);
router.post('/verifyOTP/mail/', mailOtpVerify);




module.exports=router;