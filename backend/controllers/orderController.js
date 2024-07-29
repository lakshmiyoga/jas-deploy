const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require('../utils/errorHandler');
const Order = require("../models/order")
const Payment = require("../models/paymentModel")
const nodeCron = require('node-cron');
const nodemailer = require('nodemailer');
const path = require('path');
const axios = require('axios');
const PorterModel = require('../models/porterModel');

// const fetch = require('node-fetch');



//create new order

const newOrder = catchAsyncError(async (req, res, next) => {
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
    // console.log("neworder",newOrder)

    await newOrder.save();
    res.status(201).json({ success: true, order: newOrder });
})


//get single order for user 

const getSingleOrder = catchAsyncError(async (req, res, next) => {
    //    console.log(req.params)
    const { id } = req.params
    // console.log(id)
    const order = await Payment.findOne({ 'order_id': id }).populate('user', 'name email');
    // console.log(order)
    if (!order) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        order
    })

})

//get Quote
const getQuote = catchAsyncError(async (req, res, next) => {
    //    console.log(req.params)
    const { pickup_details, drop_details, customer } = req.body;
    const apiEndpoint = 'https://pfe-apigw-uat.porter.in/v1/get_quote';
    // const apiKey = 'fdbe7c47-25ce-4b15-90c7-ccce2027841d';
//    console.log(req.body)
    try {
      const requestData = {
        pickup_details,
        drop_details,
        customer
      };
//   console.log(requestData)

      const response = await axios.post(apiEndpoint, requestData, {
        headers: {
          'X-API-KEY': process.env.PORTER_API_KEY,
          'Content-Type': 'application/json'
        }
      });
    // console.log(response.data)
      return res.json(response.data);
    } catch (error) {
        // console.log(error.response.status)
        // console.log(error.response.data.message)
        return next(new ErrorHandler(error.response.data.message, error.response.status));
    //   return res.status(500).json({ message: 'Error sending data', error });
    }

})

//create porter order
const porterOrder = catchAsyncError(async (req, res, next) => {
    //    console.log(req.params)
    const  {order_id,request_id,user,user_id,porterData, updatedItems}  = req.body;
    const apiEndpoint = 'https://pfe-apigw-uat.porter.in/v1/orders/create';

    const porterOrderExist = await PorterModel.findOne({order_id});

    const createPorter = async() => {
        try{
            const response = await axios.post(apiEndpoint, porterData, {
                headers: {
                  'X-API-KEY': process.env.PORTER_API_KEY,
                  'Content-Type': 'application/json'
                }
              });
              const porterOrder= response.data;
              if(order_id && request_id && user_id && porterData && porterOrder){
                const Data = new PorterModel({
                    order_id:order_id,
                    request_id:request_id,
                    user:user,
                    user_id :user_id ,
                    porterData:porterData ,
                    porterOrder:{},
                    porterResponse:{},
                    updatedItems:updatedItems
                });
                // console.log("Data",Data)
                await Data.save();
                if(Data){
                    const onepayments = await PorterModel.findOne({ request_id: porterOrder && porterOrder.request_id });
                    if (onepayments) {
                        const porterResponse = await PorterModel.findOneAndUpdate({ request_id: porterOrder.request_id },
                            {
                                $set: { porterOrder: porterOrder }
                             },
                            { new: true });
                            if(porterResponse){

                                return res.status(200).json({porterOrder})
                            }     
                    }
                    else{
                        return next(new ErrorHandler('Could Not find any Order', 500));
                    }
            }
            else{
             return next(new ErrorHandler('Error for create Porter Order', 500));
            }
            
            } else  {
                return next(new ErrorHandler('Error for create Porter Order', 500));
            //   return res.status(500).json({ message: 'Error sending data', error });
            }
        }catch(error){
           return next(new ErrorHandler(error.response.data.message, error.response.status));
        }   
          
    }

    if (porterOrderExist) {
        const porterExistResponse = await PorterModel.deleteOne({order_id});
        // console.log("porterOrderExist",porterExistResponse)
        if(porterExistResponse && porterExistResponse.acknowledged){
            createPorter();
        }
    }
    else{
        createPorter();
    }
   
       
      
})

//Get Loggedin User Orders 

const myOrders = catchAsyncError(async (req, res, next) => {
    // console.log(req)
    const orders = await Payment.find({ 'user_id': req.user.id });
    // const orders = await Order.find();
    // console.log(orders)
    res.status(200).json({
        success: true,
        orders
    })
})

//Admin: Get All Orders - api/v1/admin/orders

const orders = catchAsyncError(async (req, res, next) => {
    const orders = await Payment.find();

    let totalAmount = 0;
    // console.log("this is sample response",JSON.stringify(orders, null, 2));
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

    const order = await Payment.findOne({ order_id: req.params.id });
//  console.log("order",order)
//  console.log("req.body.orderStatus",req.body)
    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('Order has already been delivered!', 400));
    }

    // if (order.orderStatus === 'Cancelled') {
    //     return next(new ErrorHandler('Order has been already cancelled!', 400));
    // }

    order.orderStatus = req.body.orderStatus;

    order.deliveredAt = Date.now();
    await order.save();

    res.status(200).json({
        success: true
    });
});


//Admin: Delete Order - api/v1/order/:id

const deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Payment.findByIdAndDelete(req.params.id);
    if (!order) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404))
    }

    // await order.remove();
    res.status(200).json({
        success: true
    })
})

// get ordersummary

const getOrderSummaryByDate = catchAsyncError(async (req, res) => {
    try {
        const { date } = req.query;
        console.log("ordersummarydate", date);

        // Assuming date is in YYYY-MM-DD format
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
        console.log("startDate", startDate)
        console.log("endDate", endDate)

        // Fetch orders within the date range, explicitly selecting fields
        // const orders = await Order.find({
        //     createdAt: { $gte: startDate, $lt: endDate },
        //     paymentStatus: 'CHARGED',
        // }).select('orderItems shippingInfo user user_id itemsPrice taxPrice shippingPrice totalPrice order_id paymentStatus orderStatus createdAt').exec();
        const orders = await Payment.find({
            createdAt: { $gte: startDate, $lt: endDate },
            paymentStatus: 'CHARGED',
        })
        console.log("Fetched orders:", orders);

        const orderSummary = [];

        orders.forEach(order => {
            order.orderItems.forEach(item => {
                // Log the item to check if productWeight is present
                console.log("Processing item:", item);

                const productWeight = item.productWeight;
                if (productWeight === undefined) {
                    console.warn(`productWeight is undefined for item: ${item.name}`);
                }

                const existingItem = orderSummary.find(summary => summary.productName === item.name);
                if (existingItem) {
                    existingItem.totalWeight += productWeight;
                    existingItem.totalPrice += productWeight * item.price;
                } else {
                    orderSummary.push({
                        productName: item.name,
                        totalWeight: productWeight,
                        totalPrice: productWeight * item.price,
                    });
                }
            });
        });

        console.log("Order summary:", JSON.stringify(orderSummary, null, 2));
        res.status(200).json({ orderSummary });
    } catch (error) {
        console.error("Error fetching order summary:", error);
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
nodeCron.schedule('00 21 * * *', async () => {
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0]; // Get YYYY-MM-DD format
    // console.log(formattedDate);


    let BASE_URL;
    if (process.env.NODE_ENV === 'production') {
        BASE_URL = process.env.BACKEND_URL_PROD; // Use production URL
    } else {
        BASE_URL = process.env.BACKEND_URL_DEV; // Use development URL
    }

    try {
        const fetch = (await import('node-fetch')).default; // Dynamic import of node-fetch
        const response = await fetch(`${BASE_URL}/api/v1/admin/orders-summary/sendmail/jasadmin/orderreport?date=${formattedDate}`, {
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

// Get user summary
const getUserSummaryByDate = catchAsyncError(async (req, res) => {
    try {
        const { date } = req.query;
        console.log("usersummarydate", date);

        // Assuming date is in YYYY-MM-DD format
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
        console.log("startDate", startDate)
        console.log("endDate", endDate)

        // Fetch orders within the date range
        const orders = await Payment.find({
            createdAt: { $gte: startDate, $lt: endDate },
            paymentStatus: 'CHARGED',
        });

        console.log("Fetched users:", orders);

        const userSummary = [];

        orders.forEach(order => {
            const totalWeight = order.orderItems.reduce((sum, item) => sum + item.productWeight, 0);
            const totalPrice = order.orderItems.reduce((sum, item) => sum + (item.productWeight * item.price), 0);
            const products = order.orderItems.map(item => ({
                name: item.name,
                weight: item.productWeight,
                price: parseFloat(item.price * item.productWeight).toFixed(2)
            }));

            userSummary.push({
                user: {
                    name: order.user?.name || 'N/A',
                    email: order.user?.email || 'N/A',
                },
                shippingInfo: {
                    phoneNo: order.shippingInfo?.phoneNo || 'N/A',
                    address: order.shippingInfo?.address || 'N/A',
                    city: order.shippingInfo?.city || 'N/A',
                    country: order.shippingInfo?.country || 'N/A',
                    postalCode: order.shippingInfo?.postalCode || 'N/A',
                },
                products,
                totalAmount: totalPrice,
                totalWeight
            });

        });

        console.log("user summary:", JSON.stringify(userSummary, null, 2));
        res.status(200).json({ userSummary });
    } catch (error) {
        console.error("Error fetching user summary:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});




// Function to send email

const sendEmail = async (userSummary) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SEND_MAIL, // Your Gmail email address
            pass: process.env.MAIL_PASS // replace with your email password or app-specific password
        },
    });

    let summaryHtml = '<h1>User Summary for Today</h1>';
    summaryHtml += '<table border="1" style="border-collapse: collapse; width: 100%;">';
    summaryHtml += `
        <thead>
            <tr>
                <th>User Name</th>
                <th>User Email</th>
                <th>Phone No</th>
                <th>Address</th>
                <th>Product Name</th>
                <th>Product Weight (kg)</th>
                <th>Product Price (Rs.)</th>
            </tr>
        </thead>
        <tbody>`;

    let totalWeight = 0;
    let totalAmount = 0;

    userSummary.forEach(summary => {
        summary.products.forEach(product => {
            summaryHtml += `
                <tr>
                    <td>${summary.user.name}</td>
                    <td>${summary.user.email}</td>
                    <td>${summary.shippingInfo.phoneNo}</td>
                    <td>${summary.shippingInfo.address}, ${summary.shippingInfo.city}, ${summary.shippingInfo.country}, ${summary.shippingInfo.postalCode}</td>
                    <td>${product.name}</td>
                    <td>${product.weight.toFixed(2)}</td>
                    <td>${parseFloat(product.price).toFixed(2)}</td>
                </tr>`;

            totalWeight += product.weight;
            totalAmount += parseFloat(product.price);
        });
    });

    summaryHtml += '</tbody></table>';

    // Add total weight and total amount row at the end of the table
    summaryHtml += `
        <table border="1" style="border-collapse: collapse; width: 100%;">
            
                <tr>
                    <td colspan="5"><strong>Total </strong></td>
                    <td colspan="1"><strong>${totalWeight.toFixed(2)}</strong></td>
                    <td colspan="1"><strong>Rs. ${totalAmount.toFixed(2)}</strong></td>
                </tr>
            
        </table>`;

    let info = await transporter.sendMail({
        from: process.env.SEND_MAIL,
        to: 'jasfruitsandvegetables@gmail.com',
        subject: 'User Summary for Today',
        html: summaryHtml,
    });

    console.log('Message sent: %s', info.messageId);
};



// Schedule task to run at 10 PM every day
nodeCron.schedule('00 21 * * *', async () => {
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0]; // Get YYYY-MM-DD format
    console.log(formattedDate);

    let BASE_URL;
    if (process.env.NODE_ENV === 'production') {
        BASE_URL = process.env.BACKEND_URL_PROD; // Use production URL
    } else {
        BASE_URL = process.env.BACKEND_URL_DEV; // Use development URL
    }

    console.log(BASE_URL)
    try {
        const fetch = (await import('node-fetch')).default; // Dynamic import of node-fetch
        const response = await fetch(`${BASE_URL}/api/v1/admin/user-summary/sendmail/jasadmin/userreport?date=${formattedDate}`, {
            headers: {
                'Content-Type': 'application/json',
                // Add any other headers as needed
                // You may need to include authentication headers or tokens here
            },
            credentials: 'include', // Send cookies with the request if needed
        });
        console.log(response)
        const data = await response.json();
        console.log("Fetched data:", data);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }


        if (data.userSummary) {
            await sendEmail(data.userSummary);
        }
    } catch (error) {
        console.error('Error fetching user summary or sending email:', error);
    }
});


const getRemoveResponse = catchAsyncError(async (req, res, next) => {
    console.log("req.body",req.body)
    const {order_id, removalReason} = req.body;
    try{
        const isorderExist = await Payment.findOne({order_id});
        console.log("isorderExist",isorderExist);

        if(isorderExist){
            const orderResponse = await Payment.findOneAndUpdate({order_id},
            {
                orderStatus :'Removed',
                $set: { removalReason },
                
            },
            {new:true}
        );
        console.log("orderResponse",orderResponse)
        res.status(200).json({removeMessage : "Order Removed successfully"})
        }


    }catch(error){
        console.error('Failed to remove order:', error);
    }
    
})

module.exports = { newOrder, getSingleOrder,getQuote,porterOrder, myOrders, orders, updateOrder, deleteOrder, getOrderSummaryByDate, getUserSummaryByDate, getRemoveResponse };