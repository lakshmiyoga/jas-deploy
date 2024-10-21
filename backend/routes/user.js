const express =require('express');
const { userRegister,userLogin, logoutUser,requestPasswordReset, resetPassword, getUserProfile, updateUserProfile, changePassword, getAllUsers, getUser, updateUser, deleteUser} = require('../controllers/userController');
const router = express.Router();
const {isAuthenticateUser, authorizeRoles} = require("../middleware/authmiddleware")
const multer = require('multer');
const path = require('path')
const multerS3 = require('multer-s3');
const s3 = require('../config/awsConfig'); // Adjust the path according to your project structure

// const upload = multer({storage: multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, path.join(  __dirname,'..' , 'uploads/user' ) )
//     },
//     filename: function(req, file, cb ) {
//         const uniqueSuffix = Date.now();
//         // const fileExtension = path.extname(file.originalname);
//         cb(null, uniqueSuffix + file.originalname)
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



router.post('/register',upload.single('avatar'),userRegister);
router.post('/login', userLogin);
router.get('/logout', logoutUser);
router.post('/password/forgot', requestPasswordReset);
router.post('/password/reset/:token', resetPassword);
router.put('/password/change',isAuthenticateUser, changePassword);
router.get('/myProfile', isAuthenticateUser, getUserProfile);
router.put('/update', isAuthenticateUser,upload.single('avatar'), updateUserProfile);


//Admin routes
router.get('/admin/users',isAuthenticateUser,authorizeRoles('admin'), getAllUsers);
router.get('/admin/user/:id',isAuthenticateUser,authorizeRoles('admin'), getUser)
router.put('/admin/user/:id',isAuthenticateUser,authorizeRoles('admin'),upload.none(), updateUser)
router.delete('/admin/user/:id',isAuthenticateUser,authorizeRoles('admin'), deleteUser);



module.exports=router;