const express =require('express');
const { createProducts, getProducts, getSingleProduct,updateProducts, deleteProducts, createReview, getReviews, deleteReview, getAdminProducts } = require('../controllers/productController');
const {isAuthenticateUser, authorizeRoles} = require("../middleware/authmiddleware")
const router = express.Router();
const multer = require('multer');
const path = require('path');
const multerS3 = require('multer-s3');
const s3 = require('../config/awsConfig');

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);  // Accept the file
    } else {
      cb(new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed!'), false);  // Reject the file
    }
  };
  
  
  // Multer S3 upload configuration
  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.S3_BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE,  // Automatically set content type
      key: function (req, file, cb) {
        cb(null,`Product/${Date.now().toString()}-${file.originalname}`); // You can customize the file path and name
      },
    }),
    fileFilter: fileFilter,  // Apply the file filter here
    limits: { fileSize: 5 * 1024 * 1024 }, // Optional: Limit the file size to 5 MB
  });


// const upload = multer({storage: multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, path.join( __dirname,'..' , 'uploads/Product' ) )
//     },
//     filename: function(req, file, cb ) {
//         const uniqueSuffix = Date.now();
//         cb(null,uniqueSuffix + file.originalname)
//     }
// }) })


router.post('/products',isAuthenticateUser,authorizeRoles('admin'),createProducts);
router.get('/getproducts', getProducts);
// router.put('/product/:id',updateProducts);
router.get('/product/:id',getSingleProduct);
router.put('/review',isAuthenticateUser,createReview);
router.get('/reviews',getReviews);
router.delete('/review',deleteReview);

//Admin Routes
router.get('/admin/products',isAuthenticateUser, authorizeRoles('admin'), getAdminProducts);
router.post('/admin/product/new',isAuthenticateUser, authorizeRoles('admin'), upload.array('images'), createProducts);
router.delete('/admin/product/:id',isAuthenticateUser, authorizeRoles('admin'), deleteProducts);
router.put('/admin/product/:id',isAuthenticateUser, authorizeRoles('admin'),upload.array('images'), updateProducts);




module.exports=router;
