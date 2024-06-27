const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require('../utils/errorHandler');
const Order = require("../models/order")
const nodeCron = require('node-cron');
const nodemailer = require('nodemailer');

// const fetch = require('node-fetch');



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
    console.log("cartItems",cartItems)

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



const getOrderSummaryByDate = catchAsyncError(async (req, res) => {
    try {
        const { date } = req.query;
        console.log("ordersummarydate",date)
        // Assuming date is in YYYY-MM-DD format
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        const orders = await Order.find({
            createdAt: { $gte: startDate, $lt: endDate },
            paymentStatus: 'CHARGED',
        });

        const orderSummary = [];

        orders.forEach(order => {
            order.orderItems.forEach(item => {
                const existingItem = orderSummary.find(summary => summary.productName === item.name);
                if (existingItem) {
                    existingItem.totalWeight += item.productWeight;
                    existingItem.totalPrice += item.productWeight * item.price;
                } else {
                    orderSummary.push({
                        productName: item.name,
                        totalWeight: item.productWeight,
                        totalPrice: item.productWeight * item.price,
                    });
                   
                }
            });
        });

        res.status(200).json({ orderSummary });
        console.log(orderSummary)
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
// Function to send email
const sendEmaildata = async (orderSummary) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SEND_MAIL, // Your Gmail email address
            pass: process.env.MAIL_PASS // replace with your email password or app-specific password
        },
    });

    let summaryHtml = '<h1>Order Summary for Today</h1><table border="1"><tr><th>Product Name</th><th>Total Weight (kg)</th><th>Total Price (Rs.)</th></tr>';

    orderSummary.forEach(({ productName, totalWeight, totalPrice }) => {
        summaryHtml += `<tr><td>${productName}</td><td>${totalWeight}</td><td>${totalPrice}</td></tr>`;
    });

    let totalWeight = 0;
    let totalPrice = 0;
    orderSummary.forEach(({ totalWeight: weight, totalPrice: price }) => {
        totalWeight += parseFloat(weight) || 0;
        totalPrice += parseFloat(price) || 0;
    });

    summaryHtml += `<tr><td><strong>Total</strong></td><td><strong>${totalWeight.toFixed(2)}</strong></td><td><strong>Rs. ${totalPrice.toFixed(2)}</strong></td></tr>`;
    summaryHtml += '</table>';

    let info = await transporter.sendMail({
        from: process.env.SEND_MAIL,
        to: 'jasfruitsandvegetables@gmail.com',
        subject: 'Items Daily order summary ',
        html: summaryHtml,
    });

    console.log('Message sent: %s', info.messageId);
};

// Schedule task to run at 10 PM every day
nodeCron.schedule('30 16 * * *', async () => {
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0]; // Get YYYY-MM-DD format
    // console.log(formattedDate);
    
    try {
        const fetch = (await import('node-fetch')).default; // Dynamic import of node-fetch
        const response = await fetch(`http://localhost:8000/api/v1/admin/orders-summary/sendmail/jasadmin/orderreport?date=${formattedDate}`, {
            headers: {
                'Content-Type': 'application/json',
                // Add any other headers as needed
                // You may need to include authentication headers or tokens here
            },
            credentials: 'include', // Send cookies with the request if needed
        });
        console.log(response)
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        if (data.orderSummary) {
            await sendEmaildata(data.orderSummary);
        }
    } catch (error) {
        console.error('Error fetching order summary or sending email:', error);
    }
});

module.exports = {newOrder, getSingleOrder,myOrders, orders, updateOrder,deleteOrder,getOrderSummaryByDate};