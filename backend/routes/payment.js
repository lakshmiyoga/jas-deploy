const express =require('express');
const { isAuthenticateUser, authorizeRoles } = require('../middleware/authmiddleware');
const {payment, verifyPayment} = require("../controllers/paymentController");
const router = express.Router();



router.post('/payment/orders',isAuthenticateUser,payment )
router.post('/payment/verify',isAuthenticateUser, verifyPayment )




module.exports=router;