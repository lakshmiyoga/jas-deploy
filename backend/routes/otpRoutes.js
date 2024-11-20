const express =require('express');
const { isAuthenticateUser, authorizeRoles } = require('../middleware/authmiddleware');
const { mobileOtp, mobileOtpVerify, mailOtp, mailOtpVerify } = require('../controllers/otpController');

const router = express.Router();
const multer = require('multer');
const path = require('path')
const multerS3 = require('multer-s3');
const s3 = require('../config/awsConfig');

// const upload = multer({storage: multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, path.join(  __dirname,'..' , 'uploads/user' ) )
//     },
//     filename: function(req, file, cb ) {
//         cb(null, file.originalname)
//     }
// }) })

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);  // Accept the file
    } else {
      cb(new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed!'), false);  // Reject the file
    }
  };

  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.S3_BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE,  // Automatically set content type
      key: function (req, file, cb) {
        cb(null, `user/${Date.now().toString()}-${file.originalname}`); // You can customize the file path and name
      },
    }),
    fileFilter: fileFilter,  // Apply the file filter here
      limits: { fileSize: 5 * 1024 * 1024 }, // Optional: Limit the file size to 5 MB
  });
  

// router.post('/generateOTP/mobile/', mobileOtp);
// router.post('/verifyOTP/mobile/',mobileOtpVerify);
router.post('/generateOTP/mail/',upload.single('avatar'), mailOtp);
router.post('/verifyOTP/mail/', mailOtpVerify);




module.exports=router;