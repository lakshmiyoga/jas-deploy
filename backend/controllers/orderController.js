const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require('../utils/errorHandler');
const Order = require("../models/order")



//create new order

const newOrder = catchAsyncError(async(req, res, next)=>{
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;
    

    const order = new Order({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id
    })
    console.log(order)

    await order.save();

    res.status(200).json({
        success: true,
        order
    })
})


//get single order

const getSingleOrder = catchAsyncError(async(req, res, next)=>{

    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if(!order) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        order
    })

})

//Get Loggedin User Orders 

const myOrders = catchAsyncError(async (req, res, next) => {

    const orders = await Order.find({user: req.user.id});

    res.status(200).json({
        success: true,
        orders
    })
})

//Admin: Get All Orders - api/v1/orders

const orders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

//Admin: Update Order / Order Status - api/v1/order/:id

const updateOrder =  catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(order.orderStatus == 'Delivered') {
        return next(new ErrorHandler('Order has been already delivered!', 400))
    }
    //Updating the product stock of each order item
    // order.orderItems.forEach(async orderItem => {
    //     await updateStock(orderItem.product, orderItem.quantity)
    // })

    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();
    await order.save();

    res.status(200).json({
        success: true
    })
    
});

//Admin: Delete Order - api/v1/order/:id

const deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id);
    if(!order) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404))
    }

    // await order.remove();
    res.status(200).json({
        success: true
    })
})

module.exports = {newOrder, getSingleOrder,myOrders, orders, updateOrder,deleteOrder};