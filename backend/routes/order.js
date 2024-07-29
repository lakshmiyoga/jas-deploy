const express =require('express');
const { isAuthenticateUser, authorizeRoles } = require('../middleware/authmiddleware');
const {newOrder, getSingleOrder, myOrders, orders, updateOrder, deleteOrder,getOrderSummaryByDate,getUserSummaryByDate,getQuote,porterOrder,getRemoveResponse} = require("../controllers/orderController");
const router = express.Router();



router.post('/order/new',isAuthenticateUser, newOrder)
router.get('/order/:id',isAuthenticateUser, getSingleOrder)
router.get('/myorders',isAuthenticateUser, myOrders)
router.post('/get-quote',isAuthenticateUser, getQuote)


//Admin Routes

router.get('/admin/orders',isAuthenticateUser,authorizeRoles('admin'), orders)
router.post('/admin/porter/create/orders',isAuthenticateUser,authorizeRoles('admin'), porterOrder)
router.put('/admin/order/:id',isAuthenticateUser,authorizeRoles('admin'), updateOrder)
router.delete('/admin/order/:id',isAuthenticateUser,authorizeRoles('admin'), deleteOrder)
router.get('/admin/orders-summary',isAuthenticateUser,authorizeRoles('admin'), getOrderSummaryByDate);
router.get('/admin/user-summary',isAuthenticateUser,authorizeRoles('admin'), getUserSummaryByDate);
router.get('/admin/orders-summary/sendmail/jasadmin/orderreport', getOrderSummaryByDate);
router.get('/admin/user-summary/sendmail/jasadmin/userreport', getUserSummaryByDate);
router.post('/admin/removeOrder',isAuthenticateUser,authorizeRoles('admin'), getRemoveResponse)


// router.get('/admin/orders-summary', getOrderSummaryByDate);







module.exports=router;