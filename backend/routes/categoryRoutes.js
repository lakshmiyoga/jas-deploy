const express = require('express');
const { getAllCategories, getSingleCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
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
        cb(null, `category/${Date.now().toString()}-${file.originalname}`);
      },
    }),
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit the file size to 5 MB
  });


// Route to get all categories
router.get('/category', getAllCategories);

// Route to get a category by ID
router.get('/category/:id', getSingleCategory);

// Route to create a new category (admin access)
router.post('/category/create', isAuthenticateUser, authorizeRoles('admin'), upload.array('images'), createCategory);

// Route to update a category (admin access)
router.put('/category/:id', isAuthenticateUser, authorizeRoles('admin'), upload.array('images'), updateCategory);

// Route to delete a category (admin access)
router.delete('/category/:id', isAuthenticateUser, authorizeRoles('admin'), deleteCategory);

module.exports = router;
