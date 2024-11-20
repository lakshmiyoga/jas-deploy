const express =require('express');
const { isAuthenticateUser, authorizeRoles } = require('../middleware/authmiddleware');
const {getSinglePorterOrder, getPorterResponse,getCancelResponse, getPackedOrder, postPackedOrder, refundOrder,getAllPackedOrder} = require("../controllers/porterController");
const router = express.Router();



// router.post('/order/new',isAuthenticateUser, newOrder)
// router.get('/order/:id',isAuthenticateUser, getSingleOrder)
// router.get('/myorders',isAuthenticateUser, myOrders)
// router.post('/get-quote',isAuthenticateUser, getQuote)


//Admin Routes

router.post('/admin/porter/orders',isAuthenticateUser, getSinglePorterOrder)
router.post('/admin/porter/createResponse',isAuthenticateUser, getPorterResponse)
router.post('/admin/porter/cancelOrder',isAuthenticateUser,authorizeRoles('admin'), getCancelResponse)
router.post('/admin/packedOrder',isAuthenticateUser,authorizeRoles('admin'), postPackedOrder)
router.post('/admin/getPackedOrder',isAuthenticateUser, getPackedOrder)
router.get('/admin/PackedOrder/all',isAuthenticateUser,authorizeRoles('admin'), getAllPackedOrder)
router.post('/admin/refund',isAuthenticateUser,authorizeRoles('admin'), refundOrder)


// router.post('/admin/porter/create/orders',isAuthenticateUser,authorizeRoles('admin'), porterOrder)
// router.put('/admin/order/:id',isAuthenticateUser,authorizeRoles('admin'), updateOrder)
// router.delete('/admin/order/:id',isAuthenticateUser,authorizeRoles('admin'), deleteOrder)
// router.get('/admin/orders-summary',isAuthenticateUser,authorizeRoles('admin'), getOrderSummaryByDate);
// router.get('/admin/user-summary',isAuthenticateUser,authorizeRoles('admin'), getUserSummaryByDate);
// router.get('/admin/orders-summary/sendmail/jasadmin/orderreport', getOrderSummaryByDate);
// router.get('/admin/user-summary/sendmail/jasadmin/userreport', getUserSummaryByDate);


// router.get('/admin/orders-summary', getOrderSummaryByDate);







module.exports=router;