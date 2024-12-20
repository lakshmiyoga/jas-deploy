const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require('../utils/errorHandler');
const Order = require("../models/order")
const Payment = require("../models/paymentModel")
const nodeCron = require('node-cron');
const nodemailer = require('nodemailer');
const path = require('path');
const axios = require('axios');
const Dispatch = require("../models/dispatchModel")
// const fetch = require('node-fetch');
const fs = require('fs');
const PorterModel = require('../models/porterModel');
const { Juspay, APIError } = require('expresscheckout-nodejs');
const config = require('../config/config.json');
const Measurement = require('../models/measurementModel');

const SANDBOX_BASE_URL = "https://smartgatewayuat.hdfcbank.com"
const PRODUCTION_BASE_URL = "https://smartgateway.hdfcbank.com";

// Read config.json file


// Ensure the paths are read correctly
const publicKey = fs.readFileSync(path.resolve(config.PUBLIC_KEY_PATH));
const privateKey = fs.readFileSync(path.resolve(config.PRIVATE_KEY_PATH));
const paymentPageClientId = config.PAYMENT_PAGE_CLIENT_ID; // used in orderSession request


const juspay = new Juspay({
    merchantId: config.MERCHANT_ID,
    baseUrl: PRODUCTION_BASE_URL, // Using sandbox base URL for testing
    jweAuth: {
        keyId: config.KEY_UUID,
        publicKey,
        privateKey
    }
});


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
    // console.log("id", id)
    const order = await Payment.findOne({ 'order_id': id }).populate('user', 'name email');
    console.log("order",order)
    if (!order) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404))
    }
    try {
        const statusResponse = await juspay.order.status(id);
        console.log("statusResponse",statusResponse);
        if (statusResponse) {
            const onepayments = await Payment.findOne({ 'order_id': id });
            console.log("onepayments",onepayments)
            try {
                if (onepayments) {
                    const paymentstatus = await Payment.findOneAndUpdate({ 'order_id': id },
                        {
                            paymentStatus: statusResponse.status,
                            $set: { statusResponse: statusResponse }
                        },
                        { new: true });
                        console.log("paymentstatus",paymentstatus)
                    if (paymentstatus) {
                        return res.status(200).json({
                            success: true,
                            order: paymentstatus
                        })
                    }
                }

            } catch (error) {
                return next(new ErrorHandler('Something went wrong', 404))
                // return res.status(200).json({
            //     success: true,
            //     order
            // })
            }

        }
        else{
            return next(new ErrorHandler('Order not found in juspay', 404))
            // return res.status(200).json({
            //     success: true,
            //     order
            // })
        }
       

    } catch (error) {
        return next(new ErrorHandler('Something went wrong', 404))
    }


})

//get Quote
const getQuote = catchAsyncError(async (req, res, next) => {
    //    console.log(req.params)
    const { pickup_details, drop_details, customer } = req.body;
    // const apiEndpoint = '/v1/get_quote';
    const apiEndpoint = 'https://pfe-apigw.porter.in/v1/get_quote';
    // const apiKey = 'fdbe7c47-25ce-4b15-90c7-ccce2027841d';
    //    console.log(req.body)
    try {
        const requestData = {
            pickup_details,
            drop_details,
            customer
        };
        //   console.log("requestData",requestData);

        const response = await axios.post(apiEndpoint, requestData, {
            headers: { 
                'X-API-KEY': process.env.PORTER_API_KEY,
                'Content-Type': 'application/json'
            }
        });
        console.log(response.data)
        return res.json(response.data);
    } catch (error) {
        console.log(error.response)
        // console.log(error.response.data.message)
        return next(new ErrorHandler(error.response && error.response.data && error.response.data.message ? error.response.data.message : "Server Error Please Try After SomeTime!", error.response.status));
        //   return res.status(500).json({ message: 'Error sending data', error });
    }

})

//create porter order
const porterOrder = catchAsyncError(async (req, res, next) => {
    //    console.log(req.params)
    const { order_id, request_id, user, user_id, porterData, updatedItems, detailedTable, totalRefundableAmount } = req.body;
    // console.log("req.body", req.body)
    // const apiEndpoint = 'https://pfe-apigw-uat.porter.in/v1/orders/create';
    const apiEndpoint = 'https://pfe-apigw.porter.in/v1/orders/create';

    const porterOrderExist = await PorterModel.findOne({ order_id });


    const createPorter = async () => {
        try {
            const response = await axios.post(apiEndpoint, porterData, {
                headers: {
                    'X-API-KEY': process.env.PORTER_API_KEY,
                    'Content-Type': 'application/json'
                }
            });
            const porterOrder = response.data;
            console.log("porterOrder", porterOrder)
            if (order_id && request_id && user_id && porterData && porterOrder) {
                const Data = new PorterModel({
                    order_id: order_id,
                    request_id: request_id,
                    user: user,
                    user_id: user_id,
                    porterData: porterData,
                    porterOrder: {},
                    porterResponse: {},
                    updatedItems: updatedItems,
                    detailedTable: detailedTable,
                    totalRefundableAmount: totalRefundableAmount,
                    tracking_url: porterOrder.tracking_url,

                });
                // console.log("Data", Data)
                await Data.save();
                if (Data) {
                    const onepayments = await PorterModel.findOne({ request_id: porterOrder && porterOrder.request_id });
                    if (onepayments) {
                        const porterResponse = await PorterModel.findOneAndUpdate({ request_id: porterOrder.request_id },
                            {
                                $set: { porterOrder: porterOrder }
                            },
                            { new: true });
                        if (porterResponse) {
                            if (porterResponse && porterResponse.porterOrder && porterResponse.porterOrder.order_id) {
                                try {
                                    // const apiEndpoint1 = `https://pfe-apigw-uat.porter.in/v1/orders/${porterResponse.porterOrder.order_id}`
                                    const apiEndpoint1 = `https://pfe-apigw.porter.in/v1/orders/${porterResponse.porterOrder.order_id}`
                                    
                                    const response = await axios.get(apiEndpoint1, {
                                        headers: {
                                            'X-API-KEY': process.env.PORTER_API_KEY,
                                            'Content-Type': 'application/json'
                                        }
                                    });
                                    const responseData = response.data; // Extract only the data part of the response
                                    //   console.log("responseData",responseData)
                                    const porterResponseData = await PorterModel.findOneAndUpdate(
                                        { order_id },
                                        { $set: { porterResponse: responseData } },
                                        { new: true }
                                    );
                                    if (porterResponseData && porterResponseData.porterResponse && porterResponseData.porterResponse.status && porterResponseData.porterResponse.status === 'open') {
                                        const order = await Payment.findOne({ order_id });
                                        // console.log("order",order)
                                        if (!order || !porterResponse.porterOrder.order_id) {
                                            return next(new ErrorHandler(`Order not found with this id: ${order_id}`, 404))
                                        }

                                        const porterResponseStatus = await Payment.findOneAndUpdate(
                                            { order_id },
                                            { orderStatus: 'Dispatched' },
                                            { new: true }
                                        );
                                    }

                                    // if (typeof order_id !== 'string' || typeof totalRefundableAmount !== 'number') {

                                    //     return next(new ErrorHandler('Invalid data types: orderId should be a string and amount should be a number', 404))
                                    // }
                                    // // Initiate refund
                                    // const refundPayload = {
                                    //     unique_request_id: 'refund_test_' + Date.now(),
                                    //     order_id: order_id,
                                    //     amount: totalRefundableAmount,
                                    // };
                                    // console.log("refundPayload", refundPayload);
                                    // if(totalRefundableAmount>0){
                                    //     const refundResponse = await juspay.order.refund(order_id, refundPayload);
                                    //     if (refundResponse) {
                                    //         const statusResponse = await juspay.order.status(order_id);
                                    //         if (statusResponse) {
                                    //             const onepayments = await Payment.findOne({ order_id });
                                    //             if (onepayments) {
                                    //                 const paymentstatus = await Payment.findOneAndUpdate({ order_id },
                                    //                     {
                                    //                         // orderStatus:"Dispatched",
                                    //                         $set: { statusResponse: statusResponse }
                                    //                     },
                                    //                     { new: true });
                                    //             }
                                    //         }
                                    //     }
                                    // }

                                    return res.status(200).json({ porterOrder })
                                } catch (error) {
                                    // console.log(error)
                                    return next(new ErrorHandler(error.response.data.message, error.response.status));
                                }
                            }
                        }
                    }
                    else {
                        return next(new ErrorHandler('Could Not find any Order', 500));
                    }
                }
                else {
                    return next(new ErrorHandler('Error for create Porter Order', 500));
                }

            } else {
                return next(new ErrorHandler('Error for create Porter Order', 500));
                //   return res.status(500).json({ message: 'Error sending data', error });
            }
        } catch (error) {
            // console.log(error)
            return next(new ErrorHandler(error.response.data.message?error.response.data.message:error.message, error.response.status));
        }

    }

    if (porterOrderExist) {
        if (porterOrderExist && porterOrderExist.porterOrder && porterOrderExist.porterOrder.order_id) {
            return next(new ErrorHandler(`Order already exist with this id: ${porterOrderExist.porterOrder.order_id}`, 400));
        }
        // const porterExistResponse = await PorterModel.deleteOne({order_id});
        // console.log("porterOrderExist",porterExistResponse)
        // if(porterExistResponse && porterExistResponse.acknowledged){
        //     createPorter();
        // }
    }
    else {
        createPorter();
    }



})
// const porterOrder = catchAsyncError(async (req, res, next) => {
//     const { order_id, request_id, user, user_id, porterData, updatedItems, detailedTable, totalRefundableAmount } = req.body;
//     const apiEndpoint = 'https://pfe-apigw-uat.porter.in/v1/orders/create';

//     const porterOrderExist = await PorterModel.findOne({ order_id });

//     if (porterOrderExist) {
//         return next(new ErrorHandler(`Order already exists with this id: ${porterOrderExist.porterOrder.order_id}`, 400));
//     }

//     const createPorterOrder = async () => {
//         try {
//             const createResponse = await axios.post(apiEndpoint, porterData, {
//                 headers: {
//                     'X-API-KEY': process.env.PORTER_API_KEY,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             const porterOrderData = createResponse.data;

//             const newPorterOrder = new PorterModel({
//                 order_id,
//                 request_id,
//                 user,
//                 user_id,
//                 porterData,
//                 porterOrder: {},
//                 porterResponse: {},
//                 updatedItems,
//                 detailedTable,
//                 totalRefundableAmount,
//                 tracking_url: porterOrderData.tracking_url
//             });

//             await newPorterOrder.save();

//             const apiEndpoint1 = `https://pfe-apigw-uat.porter.in/v1/orders/${porterOrderData.order_id}`;
//             const fetchResponse = await axios.get(apiEndpoint1, {
//                 headers: {
//                     'X-API-KEY': process.env.PORTER_API_KEY,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             const porterResponseData = fetchResponse.data;
//             await PorterModel.findOneAndUpdate(
//                 { order_id },
//                 { $set: { porterResponse: porterResponseData } },
//                 { new: true }
//             );

//             return res.status(200).json({ porterOrder: porterOrderData });
//         } catch (error) {
//             return next(new ErrorHandler(error.message || 'Porter Order creation failed', error.response?.status || 500));
//         }
//     };

//     createPorterOrder();
// });


//Get Loggedin User Orders 

const myOrders = catchAsyncError(async (req, res, next) => {
    try {

        const orderResponse = await Payment.find({
            'paymentStatus': { $in: ['initiated', 'PENDING', 'PENDING_VBV', 'AUTHORIZING'] }
        });

       if (orderResponse.length > 0) {
            await Promise.all(orderResponse.map(async (order) => {
                try {
                    if (order && order.order_id) {
                        const statusResponse = await juspay.order.status(order.order_id);
                        if (statusResponse) {
                            const onePayment = await Payment.findOne({ order_id: order.order_id });
                            if (onePayment) {
                                const paymentStatus = await Payment.findOneAndUpdate(
                                    { order_id: order.order_id },
                                    {
                                        paymentStatus: statusResponse.status,
                                        $set: { statusResponse: statusResponse }
                                    },
                                    { new: true }
                                );
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Error updating payment status for ${order.order_id}:`, error);
                }
            }));
            const now = new Date();
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(now.getDate() - 7);
    
            const orders = await Payment.find({ 'user_id': req.user.id, createdAt: { $gte: oneWeekAgo } });
            return res.status(200).json({
                success: true,
                orders
            });
        }
        else {
            // console.log(req)
            const now = new Date();
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(now.getDate() - 7);

            const orders = await Payment.find({ 'user_id': req.user.id, createdAt: { $gte: oneWeekAgo } });
            // const orders = await Order.find();
            // console.log(orders)
            return res.status(200).json({
                success: true,
                orders
            })
        }

    }
    catch (error) {
        // console.error("Error fetching order summary:", error);
        return next(new ErrorHandler(`Something Went Wrong Please Try Again!!!!`, 400));
    }

})

//Admin: Get All Orders - api/v1/admin/orders

const orders = catchAsyncError(async (req, res, next) => {

    try {
        const orderResponse = await Payment.find({
            'paymentStatus': { $in: ['initiated', 'PENDING', 'PENDING_VBV', 'AUTHORIZING'] }
        });

        // if (orderResponse.length>0) {
        //     await Promise.all(orderResponse.map(async (order) => {
        //         try {
        //             if (order && order.order_id) {
        //                 const statusResponse = await juspay.order.status(order.order_id);

        //                 if (statusResponse) {

        //                     const onePayment = await Payment.findOne({ order_id: order.order_id });
        //                     if (onePayment) {
        //                         // Update payment status in the database
        //                         const paymentStatus = await Payment.findOneAndUpdate(
        //                             { order_id: order.order_id },
        //                             {
        //                                 paymentStatus: statusResponse.status,
        //                                 $set: { statusResponse: statusResponse }
        //                             },
        //                             { new: true }
        //                         );
        //                         if (paymentStatus) {
        //                             // console.log(req)
        //                             const now = new Date();
        //                             const oneMonthAgo = new Date();
        //                             oneMonthAgo.setMonth(now.getMonth() - 1);
                            
        //                             const orders = await Payment.find({ createdAt: { $gte: oneMonthAgo } });
                            
        //                             let totalAmount = 0;
        //                             // console.log("this is sample response",JSON.stringify(orders, null, 2));
        //                             orders.forEach(order => {
        //                                 if (order.paymentStatus === "CHARGED") {
        //                                     totalAmount += order.totalPrice;
        //                                 }
        //                             });
        //                             return res.status(200).json({
        //                                 success: true,
        //                                 totalAmount,
        //                                 orders
        //                             })
                            
        //                         }
        //                     }
        //                 }
        //             }
        //         } catch (error) {
        //             console.error(`Error updating payment status for ${order.order_id}:`, error);
        //             return
        //             // Log the order ID and error details for better tracking
        //         }
        //     }));
        // }
        if (orderResponse.length > 0) {
            await Promise.all(orderResponse.map(async (order) => {
                try {
                    if (order && order.order_id) {
                        const statusResponse = await juspay.order.status(order.order_id);
                        if (statusResponse) {
                            const onePayment = await Payment.findOne({ order_id: order.order_id });
                            if (onePayment) {
                                const paymentStatus = await Payment.findOneAndUpdate(
                                    { order_id: order.order_id },
                                    {
                                        paymentStatus: statusResponse.status,
                                        $set: { statusResponse: statusResponse }
                                    },
                                    { new: true }
                                );
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Error updating payment status for ${order.order_id}:`, error);
                }
            }));
            const now = new Date();
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(now.getMonth() - 1);
    
            const orders = await Payment.find({ createdAt: { $gte: oneMonthAgo } });
            // const orders = await Payment.find({});
    
            let totalAmount = 0;
            // console.log("this is sample response",JSON.stringify(orders, null, 2));
            orders.forEach(order => {
                if (order.paymentStatus === "CHARGED") {
                    totalAmount += order.totalPrice;
                }
            });
            return res.status(200).json({
                success: true,
                totalAmount,
                orders
            })
        }
        else {
            const now = new Date();
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(now.getMonth() - 1);
    
            const orders = await Payment.find({ createdAt: { $gte: oneMonthAgo } });
            // const orders = await Payment.find({});
    
            let totalAmount = 0;
            // console.log("this is sample response",JSON.stringify(orders, null, 2));
            orders.forEach(order => {
                if (order.paymentStatus === "CHARGED") {
                    totalAmount += order.totalPrice;
                }
            });
            return res.status(200).json({
                success: true,
                totalAmount,
                orders
            })
    
        }


        // const now = new Date();
        // const oneMonthAgo = new Date();
        // oneMonthAgo.setMonth(now.getMonth() - 1);

        // const orders = await Payment.find({ createdAt: { $gte: oneMonthAgo } });

        // let totalAmount = 0;
        // // console.log("this is sample response",JSON.stringify(orders, null, 2));
        // orders.forEach(order => {
        //     if (order.paymentStatus === "CHARGED") {
        //         totalAmount += order.totalPrice;
        //     }
        // });
        // return res.status(200).json({
        //     success: true,
        //     totalAmount,
        //     orders
        // })

    }
    catch (error) {
        // console.error("Error fetching order summary:", error);
        return next(new ErrorHandler(`Something Went Wrong Please Try Again!!!!`, 400));
    }


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

   return res.status(200).json({
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
    return res.status(200).json({
        success: true
    })
})

// get ordersummary

// const getOrderSummaryByDate = catchAsyncError(async (req, res) => {
//     try {
//         const { date } = req.query;
//         console.log("ordersummarydate", date);

//         // Assuming date is in YYYY-MM-DD format
//         // const startDate = new Date(date);
//         // const endDate = new Date(date);
//         // endDate.setDate(endDate.getDate() + 1);
//         // console.log("startDate", startDate)
//         // console.log("endDate", endDate)
//         const formattedDate = new Date(date).toISOString().split('T')[0];

//         // Fetch orders within the date range, explicitly selecting fields
//         // const orders = await Order.find({
//         //     createdAt: { $gte: startDate, $lt: endDate },
//         //     paymentStatus: 'CHARGED',
//         // }).select('orderItems shippingInfo user user_id itemsPrice taxPrice shippingPrice totalPrice order_id paymentStatus orderStatus createdAt').exec();
//         // const orders = await Payment.find({
//         //     createdAt: { $gte: startDate, $lt: endDate },
//         //     paymentStatus: 'CHARGED',
//         // })
//         const orders = await Payment.find({
//             paymentStatus: 'CHARGED',
//             $expr: {
//                 $eq: [
//                     { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } },
//                     formattedDate
//                 ]
//             }
//         }).select('orderItems shippingInfo user user_id itemsPrice taxPrice shippingPrice totalPrice order_id paymentStatus orderStatus createdAt').exec();
//         console.log("Fetched orders:", orders);

//         const orderSummary = [];

//         orders.forEach(order => {
//             order.orderItems.forEach(item => {
//                 // Log the item to check if productWeight is present
//                 console.log("Processing item:", item);

//                 const productWeight = item.productWeight;
//                 if (productWeight === undefined) {
//                     console.warn(`productWeight is undefined for item: ${item.name}`);
//                 }

//                 const existingItem = orderSummary.find(summary => summary.productName === item.name);
//                 if (existingItem) {
//                     existingItem.totalWeight += productWeight;
//                     existingItem.totalPrice += productWeight * item.price;
//                 } else {
//                     orderSummary.push({
//                         productName: item.name,
//                         totalWeight: productWeight,
//                         totalPrice: productWeight * item.price,
//                     });
//                 }
//             });
//         });

//         console.log("Order summary:", JSON.stringify(orderSummary, null, 2));
//         res.status(200).json({ orderSummary });
//     } catch (error) {
//         console.error("Error fetching order summary:", error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });

const getOrderSummaryByDate = catchAsyncError(async (req, res) => {
    try {
        const { date } = req.query;
        console.log("ordersummarydate", date);

        // Assuming date is in YYYY-MM-DD format
        // const startDate = new Date(date);
        // const endDate = new Date(date);
        // endDate.setDate(endDate.getDate() + 1);
        // console.log("startDate", startDate)
        // console.log("endDate", endDate)
        const formattedDate = new Date(date).toISOString().split('T')[0];

        // Fetch orders within the date range, explicitly selecting fields
        // const orders = await Order.find({
        //     createdAt: { $gte: startDate, $lt: endDate },
        //     paymentStatus: 'CHARGED',
        // }).select('orderItems shippingInfo user user_id itemsPrice taxPrice shippingPrice totalPrice order_id paymentStatus orderStatus createdAt').exec();
        // const orders = await Payment.find({
        //     createdAt: { $gte: startDate, $lt: endDate },
        //     paymentStatus: 'CHARGED',
        // })
        const orders = await Payment.find({
            paymentStatus: 'CHARGED',
            orderDate: { $regex: `^${formattedDate}` },
            // $expr: {
            //     $eq: [
            //         { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } },
            //         formattedDate
            //     ]
            // }
        }).select('orderItems shippingInfo user user_id itemsPrice taxPrice shippingPrice totalPrice order_id paymentStatus orderStatus createdAt').exec();
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
                        // totalWeight: `${productWeight} ${
                        //     item
                        //         ? item.measurement === 'Kg'
                        //             ? "Kg"
                        //             : item.measurement === 'Box'
                        //                 ? "Box"
                        //                 : (item.measurement === 'Grams' || item.measurement === 'Piece')
                        //                     ? "Piece"
                        //                     : "measurement"
                        //         : "measurement"
                        // } `,
                        totalWeight: productWeight,  // Start with numeric weight
                        measurement: item.measurement && item.measurement,
                        totalPrice: productWeight * item.price,
                    });
                }
            });
        });

        // Format totalWeight with its measurement unit for response
        const formattedOrderSummary = orderSummary.map(summary => ({
            productName: summary.productName,
            totalWeight: `${summary.totalWeight} ${summary.measurement}`,
            totalPrice: summary.totalPrice
        }));


        console.log("Order summary:", JSON.stringify(formattedOrderSummary, null, 2));
        res.status(200).json({ orderSummary: formattedOrderSummary });
    } catch (error) {
        console.error("Error fetching order summary:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// Function to send email
// const sendEmaildata = async (orderSummary) => {
//     let transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.SEND_MAIL, // Your Gmail email address
//             pass: process.env.MAIL_PASS // replace with your email password or app-specific password
//         },
//     });

//     let summaryHtml = '<h1>Order Summary for Today</h1><table border="1"><tr><th>Product Name</th><th>Total Weight (kg)</th><th>Total Price (Rs.)</th></tr>';

//     orderSummary.forEach(({ productName, totalWeight, totalPrice }) => {
//         summaryHtml += `<tr><td>${productName}</td><td>${totalWeight}</td><td>${totalPrice}</td></tr>`;
//     });

//     let totalWeight = 0;
//     let totalPrice = 0;
//     orderSummary.forEach(({ totalWeight: weight, totalPrice: price }) => {
//         totalWeight += parseFloat(weight) || 0;
//         totalPrice += parseFloat(price) || 0;
//     });

//     summaryHtml += `<tr><td><strong>Total</strong></td><td><strong>${totalWeight.toFixed(2)}</strong></td><td><strong>Rs. ${totalPrice.toFixed(2)}</strong></td></tr>`;
//     summaryHtml += '</table>';

//     let info = await transporter.sendMail({
//         from: process.env.SEND_MAIL,
//         to: 'jasfruitsandvegetables@gmail.com',
//         subject: 'Order Summary for Today ',
//         html: summaryHtml,
//     });

//     console.log('Message sent: %s', info.messageId);
// };
const sendEmaildata = async (orderSummary) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SEND_MAIL, // Your Gmail email address
            pass: process.env.MAIL_PASS // replace with your email password or app-specific password
        },
    });


    // let summaryHtml = '<h1>Order Summary for Today</h1><table border="1"><tr><th>Product Name</th><th>Total Weight (kg)</th><th>Total Price (Rs.)</th></tr>';

    // orderSummary.forEach(({ productName, totalWeight, totalPrice }) => {
    //     summaryHtml += <tr><td>${productName}</td><td>${totalWeight}</td><td>${totalPrice}</td></tr>;
    // });

    // let totalWeight = 0;
    // let totalPrice = 0;
    // orderSummary.forEach(({ totalWeight: weight, totalPrice: price }) => {
    //     totalWeight += parseFloat(weight) || 0;
    //     totalPrice += parseFloat(price) || 0;
    // });

    // summaryHtml += <tr><td><strong>Total</strong></td><td><strong>${totalWeight.toFixed(2)}</strong></td><td><strong>Rs. ${totalPrice.toFixed(2)}</strong></td></tr>;
    // summaryHtml += '</table>';

    let summaryHtml = '<h1>Order Summary for Today</h1>';

    // Grouping by unit type
    // const units = ["Kg", "Piece", "Box", "Grams"];
    // const groupedOrderSummary = {
    //     Kg: [],
    //     Piece: [],
    //     Box: [],
    //     Grams: [],
    // };
    // const totalByMeasurement = {
    //     Kg: 0,
    //     Piece: 0,
    //     Box: 0,
    //     Grams: 0,
    // };

    // orderSummary.forEach(({ productName, totalWeight, totalPrice }) => {
    //     if (totalWeight) {
    //         const [weightValue, unit] = totalWeight.trim().split(/\s+/);
    //         const weight = parseFloat(weightValue) || 0;

    //         if (units.includes(unit)) {
    //             groupedOrderSummary[unit].push({ productName, totalWeight, totalPrice });
    //             totalByMeasurement[unit] += weight;
    //         }
    //     }
    // });

    const measurements = await Measurement.find();

    const units = measurements.map(m => m.measurement);

    // Initialize grouping and total structures dynamically based on units
    const groupedOrderSummary = {};
    const totalByMeasurement = {};
    
    units.forEach(unit => {
        groupedOrderSummary[unit] = [];
        totalByMeasurement[unit] = 0;
    });
    
    // Process the order summary
    orderSummary.forEach(({ productName, totalWeight, totalPrice }) => {
        if (totalWeight) {
            const [weightValue, unit] = totalWeight.trim().split(/\s+/);
            const weight = parseFloat(weightValue) || 0;
    
            if (units.includes(unit)) {
                groupedOrderSummary[unit].push({ productName, totalWeight, totalPrice });
                totalByMeasurement[unit] += weight;
            }
        }
    });

    // Generating HTML for each unit type
    units.forEach(unit => {
        if (groupedOrderSummary[unit].length > 0) {
            summaryHtml += `<table border="1" style="margin-top: 20px; border-collapse: collapse; width:100%" ><thead><tr><th colspan="3" style="text-align: center; font-weight: bold;">Quantity in ${unit}</th></tr>`;
            summaryHtml += `<tr><th>S.NO</th><th>Product Name</th><th>Total Weight</th></tr></thead><tbody>`;

            groupedOrderSummary[unit].forEach(({ productName, totalWeight }, index) => {
                summaryHtml += `<tr><td>${index + 1}</td><td>${productName}</td><td>${totalWeight}</td></tr>`;
            });

            summaryHtml += `<tr><td colspan="2" style="text-align: right;"><strong>Total ${unit}</strong></td><td><strong>${totalByMeasurement[unit].toFixed(2)} ${unit}</strong></td></tr>`;
            summaryHtml += '</tbody></table>';
        }
    });



    let info = await transporter.sendMail({
        from: process.env.SEND_MAIL,
        to: 'jasfruitsandvegetables@gmail.com',
        subject: 'Order Summary for Today ',
        html: summaryHtml,
    });

    console.log('Message sent: %s', info.messageId);
};
// Schedule task to run at 10 PM every day

// nodeCron.schedule('28 15 * * *', async () => {
//     const date = new Date();
//     const formattedDate = date.toISOString().split('T')[0]; // Get YYYY-MM-DD format
//     // console.log(formattedDate);


//     let BASE_URL;
//     if (process.env.NODE_ENV === 'production') {
//         BASE_URL = process.env.BACKEND_URL_PROD; // Use production URL
//     } else {
//         BASE_URL = process.env.BACKEND_URL_DEV; // Use development URL
//     }

//     try {
//         const fetch = (await import('node-fetch')).default; // Dynamic import of node-fetch
//         const response = await fetch(`${BASE_URL}/api/v1/admin/orders-summary/sendmail/jasadmin/orderreport?date=${formattedDate}`, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 // Add any other headers as needed
//                 // You may need to include authentication headers or tokens here
//             },
//             credentials: 'include', // Send cookies with the request if needed
//         });
//         console.log(response)
//         const data = await response.json();
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         if (data.orderSummary) {
//             await sendEmaildata(data.orderSummary);
//         }
//     } catch (error) {
//         console.error('Error fetching order summary or sending email:', error);
//     }
// });

nodeCron.schedule('00 21 * * *', async () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const formattedDate = new Date(date).toISOString().split('T')[0];; // Get YYYY-MM-DD format

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
            },
            credentials: 'include',
        });

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
}, {
    scheduled: true,
    timezone: "Asia/Kolkata" // Schedule at 9 PM IST
});


// Get user summary
// const getUserSummaryByDate = catchAsyncError(async (req, res) => {
//     try {
//         const { date } = req.query;
//         // console.log("usersummarydate", date);

//         // Assuming date is in YYYY-MM-DD format
//         // const startDate = new Date(date);
//         // const endDate = new Date(date);
//         // endDate.setDate(endDate.getDate() + 1);
//         // console.log("startDate", startDate)
//         // console.log("endDate", endDate)
//         const formattedDate = new Date(date).toISOString().split('T')[0];
//         // Fetch orders within the date range
//         // const orders = await Payment.find({
//         //     createdAt: { $gte: startDate, $lt: endDate },
//         //     paymentStatus: 'CHARGED',
//         // });
//         const orders = await Payment.find({
//             paymentStatus: 'CHARGED',
//             $expr: {
//                 $eq: [
//                     { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } },
//                     formattedDate
//                 ]
//             }
//         }).select('orderItems shippingInfo user user_id itemsPrice taxPrice shippingPrice totalPrice order_id paymentStatus orderStatus createdAt').exec();
//         console.log("Fetched orders:", orders);

//         const userSummary = [];

//         orders.forEach(order => {
//             const totalWeight = order.orderItems.reduce((sum, item) => sum + item.productWeight, 0);
//             const totalPrice = order.orderItems.reduce((sum, item) => sum + (item.productWeight * item.price), 0);
//             const products = order.orderItems.map(item => ({
//                 name: item.name,
//                 weight: item.productWeight,
//                 price: parseFloat(item.price * item.productWeight).toFixed(2)
//             }));

//             userSummary.push({
//                 user: {
//                     name: order.user?.name || 'N/A',
//                     email: order.user?.email || 'N/A',
//                 },
//                 shippingInfo: {
//                     phoneNo: order.shippingInfo?.phoneNo || 'N/A',
//                     address: order.shippingInfo?.address || 'N/A',
//                     city: order.shippingInfo?.city || 'N/A',
//                     country: order.shippingInfo?.country || 'N/A',
//                     postalCode: order.shippingInfo?.postalCode || 'N/A',
//                 },
//                 products,
//                 totalAmount: totalPrice,
//                 totalWeight
//             });

//         });

//         console.log("user summary:", JSON.stringify(userSummary, null, 2));
//         res.status(200).json({ userSummary });
//     } catch (error) {
//         console.error("Error fetching user summary:", error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });
const getUserSummaryByDate = catchAsyncError(async (req, res) => {
    try {
        const { date } = req.query;
        // console.log("usersummarydate", date);

        // Assuming date is in YYYY-MM-DD format
        // const startDate = new Date(date);
        // const endDate = new Date(date);
        // endDate.setDate(endDate.getDate() + 1);
        // console.log("startDate", startDate)
        // console.log("endDate", endDate)
        const formattedDate = new Date(date).toISOString().split('T')[0];
        // Fetch orders within the date range
        // const orders = await Payment.find({
        //     createdAt: { $gte: startDate, $lt: endDate },
        //     paymentStatus: 'CHARGED',
        // });
        const orders = await Payment.find({
            paymentStatus: 'CHARGED',
             orderDate: { $regex: `^${formattedDate}` },
            // $expr: {
            //     $eq: [
            //         { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } },
            //         formattedDate
            //     ]
            // }
        }).select('orderItems shippingInfo user user_id itemsPrice taxPrice shippingPrice totalPrice order_id paymentStatus orderStatus createdAt').exec();
        console.log("Fetched orders:", orders);

        const userSummary = [];

        orders.forEach(order => {
            const totalWeight = order.orderItems.reduce((sum, item) => sum + item.productWeight, 0);
            const totalPrice = order.orderItems.reduce((sum, item) => sum + (item.productWeight * item.price), 0);
            const products = order.orderItems.map(item => ({
                name: item.name,
                weight: item.productWeight,
                // weight: `${item.productWeight} ${item.measurement && item.measurement=='Grams'? 'Piece' :item.measurement}`,
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
                // totalWeight
                totalWeight: `${totalWeight} ${order.orderItems.length > 0
                    ? order.orderItems[0].measurement
                    : 'measurement'
                    }`
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
    // console.log("userSummary", userSummary)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SEND_MAIL, // Your Gmail email address
            pass: process.env.MAIL_PASS // replace with your email password or app-specific password
        },
    });

    let summaryHtml = '<h1>User Summary for Today</h1>';
    summaryHtml += '<table border="1" style="border-collapse: collapse; width:100% ;">';
    summaryHtml += `
        <thead>
            <tr>
                <th colspan="1">User Name</th>
                <th colspan="2">User Email</th>
                <th colspan="1">Phone No</th>
                <th colspan="2">Address</th>
                <th colspan="1">Product Name</th>
                <th colspan="1">Product Weight (kg)</th>
                <th colspan="1">Product Price (Rs.)</th>
            </tr>
        </thead>
         <tbody>`;

    let totalWeight = 0;
    let totalAmount = 0;

    userSummary.forEach(summary => {
        summaryHtml += `
            <tr>
                <td colspan="1" style="text-align:center;" >${summary.user.name}</td>
                <td colspan="2" style="text-align:center;" >${summary.user.email}</td>
                <td colspan="1" style="text-align:center;">${summary.shippingInfo.phoneNo}</td>
                <td colspan="2" style="text-align:center;">${summary.shippingInfo.address}, ${summary.shippingInfo.city}, ${summary.shippingInfo.country}, ${summary.shippingInfo.postalCode}</td>
                <td colspan="1" style="text-align:center;">${summary.products.map(product => product.name).join('<br>')}</td>
                <td colspan="1" style="text-align:center;">${summary.products.map(product => product.weight.toFixed(2)).join('<br>')}</td>
                <td colspan="1" style="text-align:center;">${summary.products.map(product => parseFloat(product.price).toFixed(2)).join('<br>')}</td>
            </tr>`;

        // Assuming you're adding up total weight and amount here
        summary.products.forEach(product => {
            totalWeight += product.weight;
            totalAmount += parseFloat(product.price);
        });
    });

    summaryHtml += `
        <tr>
            <td colspan="7" style="text-align:right;"><strong>Total</strong></td> <!-- Span until Product Name -->
            <td  colspan="1" style="text-align:center;"><strong>${totalWeight.toFixed(2)} kg</strong></td> <!-- Total weight -->
            <td  colspan="1" style="text-align:center;"><strong>Rs. ${totalAmount.toFixed(2)}</strong></td> <!-- Total amount -->
        </tr>
    </tbody>`;

    // summaryHtml += '</tbody></table>';

    // Add total weight and total amount row at the end of the table


    let info = await transporter.sendMail({
        from: process.env.SEND_MAIL,
        to: 'jasfruitsandvegetables@gmail.com',
        subject: 'User Summary for Today',
        html: summaryHtml,
    });

    console.log('Message sent: %s', info.messageId);
};



// Schedule task to run at 10 PM every day
// nodeCron.schedule('23 15 * * *', async () => {
//     const date = new Date();
//     const formattedDate = date.toISOString().split('T')[0]; // Get YYYY-MM-DD format
//     console.log(formattedDate);

//     let BASE_URL;
//     if (process.env.NODE_ENV === 'production') {
//         BASE_URL = process.env.BACKEND_URL_PROD; // Use production URL
//     } else {
//         BASE_URL = process.env.BACKEND_URL_DEV; // Use development URL
//     }

//     console.log(BASE_URL)
//     try {
//         const fetch = (await import('node-fetch')).default; // Dynamic import of node-fetch
//         const response = await fetch(`${BASE_URL}/api/v1/admin/user-summary/sendmail/jasadmin/userreport?date=${formattedDate}`, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 // Add any other headers as needed
//                 // You may need to include authentication headers or tokens here
//             },
//             credentials: 'include', // Send cookies with the request if needed
//         });
//         // console.log(response)
//         const data = await response.json();
//         console.log("Fetched data:", data);

//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }


//         if (data.userSummary) {
//             await sendEmail(data.userSummary);
//         }
//     } catch (error) {
//         console.error('Error fetching user summary or sending email:', error);
//     }
// });


nodeCron.schedule('00 21  * * *', async () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const formattedDate = date.toISOString().split('T')[0]; // Get YYYY-MM-DD format
    console.log(formattedDate);

    let BASE_URL;
    if (process.env.NODE_ENV === 'production') {
        BASE_URL = process.env.BACKEND_URL_PROD; // Use production URL
    } else {
        BASE_URL = process.env.BACKEND_URL_DEV; // Use development URL
    }

    console.log(BASE_URL);
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

        const data = await response.json();
        // console.log("Fetched data:", data);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        if (data.userSummary) {
            await sendEmail(data.userSummary);
        }
    } catch (error) {
        console.error('Error fetching user summary or sending email:', error);
    }
}, {
    scheduled: true,
    timezone: "Asia/Kolkata" // Schedule at 9 PM IST
});


const getRemoveResponse = catchAsyncError(async (req, res, next) => {
    console.log("req.body", req.body)
    const { order_id, removalReason } = req.body;
    try {
        const isorderExist = await Payment.findOne({ order_id });
        console.log("isorderExist", isorderExist);

        if (isorderExist) {
            const orderResponse = await Payment.findOneAndUpdate({ order_id },
                {
                    orderStatus: 'Removed',
                    $set: { removalReason },

                },
                { new: true }
            );
            console.log("orderResponse", orderResponse)
            res.status(200).json({ removeMessage: "Order Removed successfully" })
        }


    } catch (error) {
        console.error('Failed to remove order:', error);
    }

})

// async function checkPaymentStatus() {
//     try {
//         // Fetch orders that are still pending or in-progress
//         const orders = await PorterModel.find({
//             'porterResponse.status': { $nin: ['ended', 'cancelled'] }
//         });
//         //   console.log("orders",orders)
//         // Use for...of to handle async operations properly
//         for (const order of orders) {
//             try {
//                 if(order && order.porterOrder){
//                     const apiEndpoint = `https://pfe-apigw-uat.porter.in/v1/orders/${order.porterOrder?.order_id}`;

//                     const response = await axios.get(apiEndpoint, {
//                         headers: {
//                             'X-API-KEY': process.env.PORTER_API_KEY,
//                             'Content-Type': 'application/json'
//                         },
//                     });
//                     // console.log("response",response)

//                     if (response) {
//                         const responseData = response.data;

//                         // Update porterResponse in the database
//                         const porterResponseData = await PorterModel.findOneAndUpdate(
//                             { order_id: order.order_id },
//                             { $set: { porterResponse: responseData } },
//                             { new: true }
//                         );
//                         // console.log("porterResponseData",porterResponseData)

//                         if (porterResponseData?.porterResponse?.status === 'ended') {
//                             const orderData = await Payment.findOne({ order_id: order.order_id });
//                             if (!orderData) {
//                                 throw new Error(`Order not found with this id: ${order.order_id}`);
//                             }

//                             await Payment.findOneAndUpdate(
//                                 { order_id: order.order_id },
//                                 { orderStatus: 'Delivered' },
//                                 { new: true }
//                             );
//                         }

//                         if (porterResponseData?.porterResponse?.status === 'cancelled') {
//                             const orderData = await Payment.findOne({ order_id: order.order_id });
//                             if (!orderData) {
//                                 throw new Error(`Order not found with this id: ${order.order_id}`);
//                             }

//                             await Payment.findOneAndUpdate(
//                                 { order_id: order.order_id },
//                                 { orderStatus: 'Cancelled' },
//                                 { new: true }
//                             );
//                         }
//                     }
//                 }

//             } catch (error) {
//                 console.error(`Error processing order ${order.order_id}:`, error.message);
//                 // You might want to log the order ID and error details for better tracking
//             }
//         }
//     } catch (error) {
//         console.error('Error checking payment status:', error.message);
//     }
// }

// nodeCron.schedule('* * * * *', () => {
//     console.log('Checking payment status...');
//     checkPaymentStatus();
// });

// async function checkRefundStatus() {
//     try {

//         // const refundOrder = await Dispatch.find({
//         //     totalRefundableAmount: { $gt: 0 },
//         //     refundStatus: { $regex: /^Pending$/, $options: 'i' } // 'i' makes it case-insensitive
//         //   });
//         const refundOrder = await Dispatch.find({
//             totalRefundableAmount: { $gt: 0 },
//             refundStatus: { $not: { $regex: /^(SUCCESS|FAILURE)$/i } }
//         });
//        console.log("refundOrder",refundOrder)
//           refundOrder.forEach(async (order) => {
//             const statusResponse = await juspay.order.status(order && order.order_id);
//             // console.log("statusResponse",statusResponse)
//             if (statusResponse) {

//                 const onepayments = await Dispatch.findOne({ "order_id":order && order.order_id });
//                 if (onepayments) {
//                     const refundStatus = await Dispatch.findOneAndUpdate({ "order_id":order && order.order_id },
//                         {
//                             refundStatus: statusResponse && statusResponse.refunds && statusResponse.refunds[0].status && statusResponse.refunds[0].status,
//                             $set: { statusResponse: statusResponse }
//                         },
//                         { new: true });
//                 }

//             }
//           });


//     } catch (error) {
//         console.error('Error checking payment status:', error);
//     }

// }
// nodeCron.schedule('* * * * *', () => {
//     console.log('Checking payment status...');
//     checkRefundStatus();
// });

// async function checkPaymentStatus() {
//     try {
//         // Fetch orders that are still pending or in-progress
//         const orders = await PorterModel.find({
//             'porterResponse.status': { $nin: ['ended', 'cancelled', 'Processing', 'Packed'] }
//         });

//         // Use Promise.all to handle async operations concurrently
//         await Promise.all(orders.map(async (order) => {
//             try {
//                 if (order && order.porterOrder) {
//                     const apiEndpoint = `https://pfe-apigw-uat.porter.in/v1/orders/${order.porterOrder.order_id}`;

//                     const response = await axios.get(apiEndpoint, {
//                         headers: {
//                             'X-API-KEY': process.env.PORTER_API_KEY,
//                             'Content-Type': 'application/json'
//                         },
//                     });

//                     if (response) {
//                         const responseData = response.data;

//                         // Update porterResponse in the database
//                         const porterResponseData = await PorterModel.findOneAndUpdate(
//                             { order_id: order.order_id },
//                             { $set: { porterResponse: responseData } },
//                             { new: true }
//                         );
//                         // console.log("porterResponseData",porterResponseData)

//                         if (porterResponseData?.porterResponse?.status === 'ended') {
//                             const orderData = await Payment.findOne({ order_id: order.order_id });
//                             if (!orderData) {
//                                 throw new Error(`Order not found with this id: ${order.order_id}`);
//                             }

//                             await Payment.findOneAndUpdate(
//                                 { order_id: order.order_id },
//                                 { orderStatus: 'Delivered' },
//                                 { new: true }
//                             );
//                         }

//                         if (porterResponseData?.porterResponse?.status === 'cancelled') {
//                             const orderData = await Payment.findOne({ order_id: order.order_id });
//                             if (!orderData) {
//                                 throw new Error(`Order not found with this id: ${order.order_id}`);
//                             }

//                             await Payment.findOneAndUpdate(
//                                 { order_id: order.order_id },
//                                 { orderStatus: 'Cancelled' },
//                                 { new: true }
//                             );
//                         }
//                     }
//                 }
//             } catch (error) {
//                 console.error(`Error processing order ${order.order_id}:`, error);
//                 // Log the order ID and error details for better tracking
//             }
//         }));
//         console.log("Payment Updation completed !!!!!!!!!!!!!!!!!!!!!!!!")
//     } catch (error) {
//         console.error('Error checking payment status:', error);
//     }
// }
// async function checkRefundStatus() {
//     try {
//         const refundOrders = await Dispatch.find({
//             totalRefundableAmount: { $gt: 0 },
//             refundStatus: { $not: { $regex: /^(SUCCESS|FAILURE)$/i } }
//         });

//         // Process each order asynchronously
//         await Promise.all(refundOrders.map(async (order) => {
//             try {
//                 const statusResponse = await juspay.order.status(order.order_id);
//                 if (statusResponse) {
//                     const onepayments = await Dispatch.findOne({ "order_id":order && order.order_id });
//                     if(onepayments){
//                         await Dispatch.findOneAndUpdate(
//                             { order_id: order.order_id },
//                             {
//                                 refundStatus: statusResponse.refunds?.[0]?.status || 'UNKNOWN',
//                                 $set: { statusResponse: statusResponse }
//                             },
//                             { new: true }
//                         );
//                     }
//                     }

//             } catch (error) {
//                 console.error(`Error checking refund order ${order.order_id}:`, error);
//             }
//         }));
//     } catch (error) {
//         console.error('Error checking refund status:', error);
//     }
// }
async function checkPaymentStatus() {
    try {

        const orderResponse = await Payment.find({
            'paymentStatus': 'initiated' || 'PENDING' || 'PENDING_VBV' || 'AUTHORIZING'
        });

        // await Promise.all(orderResponse.map(async (order) => {
        //     try {
        //         if (order && order.order_id) {
        //             const statusResponse = await juspay.order.status(order.order_id);

        //             if (statusResponse) {

        //                 const onePayment = await Payment.findOne({ order_id: order.order_id });
        //                 if (onePayment) {
        //                     // Update payment status in the database
        //                     const paymentStatus = await Payment.findOneAndUpdate(
        //                         { order_id: order.order_id },
        //                         {
        //                             paymentStatus: statusResponse.status,
        //                             $set: { statusResponse: statusResponse }
        //                         },
        //                         { new: true }
        //                     );
        //                 }
        //             }
        //         }
        //     } catch (error) {
        //         console.error(`Error updating payment status for ${order.order_id}:`, error);
        //         return
        //         // Log the order ID and error details for better tracking
        //     }
        // }));

        // Fetch orders that are still pending or in-progress
        const orders = await PorterModel.find({
            'porterResponse.status': { $nin: ['ended', 'cancelled', 'Processing', 'Packed'] }
        });

        // Use Promise.all to handle async operations concurrently
        await Promise.all(orders.map(async (order) => {
            try {
                if (order && order.porterOrder) {
                    // const apiEndpoint = `https://pfe-apigw-uat.porter.in/v1/orders/${order.porterOrder.order_id}`;
                    const apiEndpoint = `https://pfe-apigw.porter.in/v1/orders/${order.porterOrder.order_id}`;
                    let response;
                    for (let attempt = 0; attempt < 3; attempt++) { // Retry up to 3 times
                        try {
                            response = await axios.get(apiEndpoint, {
                                headers: {
                                    'X-API-KEY': process.env.PORTER_API_KEY,
                                    'Content-Type': 'application/json'
                                },
                            });
                            // console.log("response",response)
                            if (response) break; // Exit loop on success
                        } catch (error) {
                            if (attempt === 2 || !isRetryableError(error)) throw error; // Throw error if last attempt or non-retryable error
                            console.warn(`Attempt ${attempt + 1} failed for order ${order.order_id}, retrying...`);
                        }
                    }

                    if (response) {
                        const responseData = response.data;

                        // Update porterResponse in the database
                        const porterResponseData = await PorterModel.findOneAndUpdate(
                            { order_id: order.order_id },
                            { $set: { porterResponse: responseData } },
                            { new: true }
                        );

                        if (porterResponseData?.porterResponse?.status === 'ended') {
                            const orderData = await Payment.findOne({ order_id: order.order_id });
                            if (!orderData) {
                                throw new Error(`Order not found with this id: ${order.order_id}`);
                            }

                            await Payment.findOneAndUpdate(
                                { order_id: order.order_id },
                                { orderStatus: 'Delivered' },
                                { new: true }
                            );
                        }

                        if (porterResponseData?.porterResponse?.status === 'cancelled') {
                            const orderData = await Payment.findOne({ order_id: order.order_id });
                            if (!orderData) {
                                throw new Error(`Order not found with this id: ${order.order_id}`);
                            }

                            await Payment.findOneAndUpdate(
                                { order_id: order.order_id },
                                { orderStatus: 'Cancelled' },
                                { new: true }
                            );
                        }
                    }
                }
            } catch (error) {
                console.error(`Error processing order ${order.order_id}:`, error);
                return
                // Log the order ID and error details for better tracking
            }
        }));
        console.log("Payment Updation completed !!!!!!!!!!!!!!!!!!!!!!!!")
        return
    } catch (error) {
        console.error('Error checking payment status:', error);
        return
    }
}

async function checkRefundStatus() {
    try {
        const refundOrders = await Dispatch.find({
            totalRefundableAmount: { $gt: 0 },
            refundStatus: { $not: { $regex: /^(SUCCESS|FAILURE)$/i } }
        });
        // console.log("refundOrders",refundOrders)

        await Promise.all(refundOrders.map(async (order) => {
            try {
                let statusResponse;
                for (let attempt = 0; attempt < 3; attempt++) { // Retry up to 3 times
                    try {
                        statusResponse = await juspay.order.status(order.order_id);
                        if (statusResponse) break; // Exit loop on success
                    } catch (error) {
                        if (error.error_info && error.error_info.code === 'RESOURCE_NOT_FOUND') {
                            console.error(`Order ${order.order_id} not found, skipping...`);
                            return; // Skip further processing for this order
                        }
                        if (attempt === 2 || !isRetryableError(error)) throw error; // Throw error if last attempt or non-retryable error
                        console.warn(`Attempt ${attempt + 1} failed for order ${order.order_id}, retrying...`);
                    }
                }

                if (statusResponse) {
                    const onepayment = await Dispatch.findOne({ "order_id": order.order_id });
                    if (onepayment) {
                        await Dispatch.findOneAndUpdate(
                            { order_id: order.order_id },
                            {
                                refundStatus: statusResponse.refunds?.[0]?.status || 'PROCESSING',
                                $set: { statusResponse: statusResponse }
                            },
                            { new: true }
                        );
                    }
                }

            } catch (error) {
                console.error(`Error checking refund order ${order.order_id}:`, error);
                return
            }
        }));
        console.log("Refund Updation completed !!!!!!!!!!!!!!!!!!!!!!!!")
        return
    } catch (error) {
        console.error('Error checking refund status:', error);
        return
    }
}

// Utility function to determine if the error is retryable
function isRetryableError(error) {
    return error.raw && error.raw.includes('504');
}

// nodeCron.schedule('* * * * *', () => {
//     console.log('Checking payment status...');
//     checkPaymentStatus();
//     // checkRefundStatus();
// });


nodeCron.schedule('0 0 */12 * * *', () => {
    console.log('Checking Refund status...');
    checkRefundStatus();
});


module.exports = { newOrder, getSingleOrder, getQuote, porterOrder, myOrders, orders, updateOrder, deleteOrder, getOrderSummaryByDate, getUserSummaryByDate, getRemoveResponse };