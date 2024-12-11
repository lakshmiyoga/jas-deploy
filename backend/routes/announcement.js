const express = require('express');
const { createAnnouncement, getAllAnnouncement, getSingleAnnouncement, updateAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');
const router = express.Router();
const multer = require('multer');
const { isAuthenticateUser, authorizeRoles } = require("../middleware/authmiddleware");
const multerS3 = require('multer-s3');
const s3 = require('../config/awsConfig'); // Adjust the path to your AWS config

// File filter for allowed image types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png','image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Invalid file type. Only JPG, JPEG, PNG ,and WEBP are allowed!'), false);
    }
  };
  
  // Configure multer for S3
  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.S3_BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        cb(null, `announcement/images/${Date.now().toString()}-${file.originalname}`);
      },
    }),
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit the file size to 5 MB
  });


  // File filter for allowed video types
// const videoFileFilter = (req, file, cb) => {
//     const allowedTypes = ['video/mp4', 'video/mkv', 'video/webm'];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true); // Accept the file
//     } else {
//       cb(new Error('Invalid file type. Only MP4, MKV, and WEBM are allowed!'), false);
//     }
//   };
  
//   // Configure multer for video uploads
//   const videoUpload = multer({
//     storage: multerS3({
//       s3: s3,
//       bucket: process.env.S3_BUCKET_NAME,
//       contentType: multerS3.AUTO_CONTENT_TYPE,
//       key: function (req, file, cb) {
//         cb(null, announcement/videos/${Date.now().toString()}-${file.originalname});
//       },
//     }),
//     fileFilter: videoFileFilter,
//     limits: { fileSize: 50 * 1024 * 1024 }, // Limit the file size to 50 MB
//   });



// Route to get all categories
router.get('/announcement', getAllAnnouncement);

// Route to get a category by ID
router.get('/announcement/:id', getSingleAnnouncement);

// Route to create a new category (admin access)
router.post('/announcement/create', isAuthenticateUser, authorizeRoles('admin'), upload.array('images'), createAnnouncement);

// Route to update a category (admin access)
router.put('/announcement/:id', isAuthenticateUser, authorizeRoles('admin'), upload.array('images'), updateAnnouncement);

// Route to delete a category (admin access)
router.delete('/announcement/:id', isAuthenticateUser, authorizeRoles('admin'), deleteAnnouncement);

module.exports = router;