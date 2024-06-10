const express =require('express');
const { createProducts, getProducts, getSingleProduct,updateProducts, deleteProducts, createReview, getReviews, deleteReview, getAdminProducts } = require('../controllers/productController');
const {isAuthenticateUser, authorizeRoles} = require("../middleware/authmiddleware")
const router = express.Router();
const multer = require('multer');
const path = require('path');


const upload = multer({storage: multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join( __dirname,'..' , 'uploads/Product' ) )
    },
    filename: function(req, file, cb ) {
        cb(null, file.originalname)
    }
}) })


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
