const express =require('express');
const { isAuthenticateUser, authorizeRoles } = require('../middleware/authmiddleware');
const {newOrder, getSingleOrder, myOrders, orders, updateOrder, deleteOrder} = require("../controllers/orderController");
const router = express.Router();



router.post('/order/new',isAuthenticateUser, newOrder)
router.get('/order/:id',isAuthenticateUser, getSingleOrder)
router.get('/myorders',isAuthenticateUser, myOrders)

//Admin Routes

router.get('/orders',isAuthenticateUser,authorizeRoles('admin'), orders)
router.put('/order/:id',isAuthenticateUser,authorizeRoles('admin'), updateOrder)
router.delete('/order/:id',isAuthenticateUser,authorizeRoles('admin'), deleteOrder)






module.exports=router;