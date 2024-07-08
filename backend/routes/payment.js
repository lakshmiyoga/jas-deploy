// const express =require('express');
// const { isAuthenticateUser, authorizeRoles } = require('../middleware/authmiddleware');
// const { initiatePayment, handleResponse} = require("../controllers/paymentController");
// const router = express.Router();



// router.post('/initiateJuspayPayment',isAuthenticateUser,initiatePayment )
// router.post('/handleJuspayResponse',isAuthenticateUser, handleResponse )




// module.exports=router;

const express =require('express');
const { isAuthenticateUser, authorizeRoles } = require('../middleware/authmiddleware');
const {payment,handleResponse, paymentSuccess, orderRefund} = require("../controllers/paymentController");
const router = express.Router();



router.post('/payment/orders',isAuthenticateUser,payment )
// router.post('/payment/verify',isAuthenticateUser, verifyPayment )
router.get('/handleJuspayResponse/:id',isAuthenticateUser, handleResponse )
router.post('/refund',orderRefund);
// router.get('/order/payments/:id',getOrderpayments);
// router.get('/all/payments',getAllPayments );
// router.get('/payment/order/all',getOrder );
router.post('/paymentsuccess/:orderId',paymentSuccess);
// router.get('/payment/confirm',isAuthenticateUser, orderConfirmation)
// router.get('/payment-failed',isAuthenticateUser, paymentFailed )




module.exports=router;