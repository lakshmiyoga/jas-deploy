const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require('../utils/errorHandler');
const Order = require("../models/order")



//create new order

const newOrder = catchAsyncError(async(req, res, next)=>{
    const {
        order_id,
        user_id,
        user,
        cartItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentStatus,
    } = req.body;
    // console.log(req.body)

    const newOrder = new Order({
        order_id,
        user_id,
        user,
        orderItems: cartItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentStatus,
    });

    await newOrder.save();
    res.status(201).json({ success: true, order: newOrder });
})


//get single order for user 

const getSingleOrder = catchAsyncError(async(req, res, next)=>{
    //    console.log(req.params)
    const {id} = req.params
    // console.log(id)
    const order = await Order.findOne({'order_id':id}).populate('user', 'name email');
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
    // console.log(req)
    const orders = await Order.find({'user_id': req.user.id});
    // const orders = await Order.find();
// console.log(orders)
    res.status(200).json({
        success: true,
        orders
    })
})

//Admin: Get All Orders - api/v1/admin/orders

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

const updateOrder = catchAsyncError(async (req, res, next) => {
    // Find the order using the custom order_id field
    const order = await Order.findOne({ order_id: req.params.id });

    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('Order has already been delivered!', 400));
    }

    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();
    await order.save();

    res.status(200).json({
        success: true
    });
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