const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require('../utils/errorHandler');
const Order = require("../models/order")
const Payment = require("../models/paymentModel")
const Dispatch = require("../models/dispatchModel")
const nodeCron = require('node-cron');
const nodemailer = require('nodemailer');
const path = require('path');
const axios = require('axios');
// const porterModel = require('../models/porterModel');
const porterModel = require('../models/allProductModel');
// const fetch = require('node-fetch');
const fs = require('fs');
const { Juspay, APIError } = require('expresscheckout-nodejs');
const config = require('../config/config.json');

const SANDBOX_BASE_URL = "https://smartgatewayuat.hdfcbank.com"
const PRODUCTION_BASE_URL = "https://smartgateway.hdfcbank.com";

// Read config.json file


// Ensure the paths are read correctly
const publicKey = fs.readFileSync(path.resolve(config.PUBLIC_KEY_PATH));
const privateKey = fs.readFileSync(path.resolve(config.PRIVATE_KEY_PATH));
const paymentPageClientId = config.PAYMENT_PAGE_CLIENT_ID; // used in orderSession request


const juspay = new Juspay({
    merchantId: config.MERCHANT_ID,
    baseUrl: SANDBOX_BASE_URL, // Using sandbox base URL for testing
    jweAuth: {
        keyId: config.KEY_UUID,
        publicKey,
        privateKey
    }
});


//get single order for user 

const getSinglePorterOrder = catchAsyncError(async (req, res, next) => {
    //    console.log(req.params)
    const { order_id } = req.body;
    // if (!order_id) {
    //     return next(new ErrorHandler(`Order not found`, 404))
    // }
    // console.log(req.body)
    const order = await porterModel.findOne({ order_id });
    // console.log(order)
    if (!order) {
        return next(new ErrorHandler(`Order not found with this id: ${order_id}`, 404))
    }
  
    const statusResponse = await juspay.order.status(order_id);

    if (statusResponse) {

        const onepayments = await Dispatch.findOne({ order_id });
        if (onepayments) {
            const refundStatus = await Dispatch.findOneAndUpdate({ order_id },
                {
                    refundStatus: statusResponse && statusResponse.refunds && statusResponse.refunds[0].status,
                    $set: { statusResponse: statusResponse }
                },
                { new: true });
               return res.status(200).json({
                    success: true,
                    porterOrder: order
                })  
           
        }

    }
   return res.status(200).json({
        success: true,
        porterOrder: order
    })
   
})


const getPorterResponse = catchAsyncError(async (req, res, next) => {
    //    console.log(req.params)
    const { order_id, porterOrder_id } = req.body;

    const order = await porterModel.findOne({ order_id });
    // console.log("order",order)
    if (!order || !porterOrder_id) {
        return next(new ErrorHandler(`Order not found with this id: ${order_id}`, 404))
    }
    const apiEndpoint = `https://pfe-apigw-uat.porter.in/v1/orders/${porterOrder_id}`
    // apiEndpoint = `https://pfe-apigw-uat.porter.in/v1/orders/{order_id:CRN93814651}`
    const response = await axios.get(apiEndpoint, {
        headers: {
            'X-API-KEY': process.env.PORTER_API_KEY,
            'Content-Type': 'application/json'
        }
    });
    const responseData = response.data; // Extract only the data part of the response
    //   console.log("responseData",responseData)
    const porterResponseData = await porterModel.findOneAndUpdate(
        { order_id },
        { $set: { porterResponse: responseData } },
        { new: true }
    );
    //   console.log("porterResponseData",porterResponseData)
    if (porterResponseData && porterResponseData.porterResponse && porterResponseData.porterResponse.status && porterResponseData.porterResponse.status === 'open') {
        const order = await Payment.findOne({ order_id });
        // console.log("order",order)
        if (!order || !porterOrder_id) {
            return next(new ErrorHandler(`Order not found with this id: ${order_id}`, 404))
        }

        const porterResponseStatus = await Payment.findOneAndUpdate(
            { order_id },
            { orderStatus: 'Dispatched' },
            { new: true }
        );
        if (porterResponseData && porterResponseStatus) {
            return res.status(200).json({
                success: true,
                porterResponse: responseData
            });
        } else {
            return next(new ErrorHandler(`Something went wrong with this id: ${order_id}`, 404));
        }
        //   console.log("porterResponseStatus",porterResponseStatus)
    }

    if (porterResponseData && porterResponseData.porterResponse && porterResponseData.porterResponse.status && porterResponseData.porterResponse.status === 'ended') {
        const order = await Payment.findOne({ order_id });
        // console.log("order",order)
        if (!order || !porterOrder_id) {
            return next(new ErrorHandler(`Order not found with this id: ${order_id}`, 404))
        }

        const porterResponseStatus = await Payment.findOneAndUpdate(
            { order_id },
            { orderStatus: 'Delivered' },
            { new: true }
        );
        if (porterResponseData && porterResponseStatus) {
            return res.status(200).json({
                success: true,
                porterResponse: responseData
            });
        } else {
            return next(new ErrorHandler(`Something went wrong with this id: ${order_id}`, 404));
        }
        //   console.log("porterResponseStatus",porterResponseStatus)
    }

    if (porterResponseData && porterResponseData.porterResponse && porterResponseData.porterResponse.status && porterResponseData.porterResponse.status === 'cancelled') {
        const order = await Payment.findOne({ order_id });
        // console.log("order",order)
        if (!order || !porterOrder_id) {
            return next(new ErrorHandler(`Order not found with this id: ${order_id}`, 404))
        }

        const porterResponseStatus = await Payment.findOneAndUpdate(
            { order_id },
            { orderStatus: 'Cancelled' },
            { new: true }
        );
        if (porterResponseData && porterResponseStatus) {
            return res.status(200).json({
                success: true,
                porterResponse: responseData
            });
        } else {
            return next(new ErrorHandler(`Something went wrong with this id: ${order_id}`, 404));
        }
        //   console.log("porterResponseStatus",porterResponseStatus)
    }

    // if (porterResponseData) {
    //     return res.status(200).json({
    //         success: true,
    //         porterResponse: responseData
    //     });
    // } else {
    //     return next(new ErrorHandler(`Something went wrong with this id: ${order_id}`, 404));
    // }
})


const getCancelResponse = catchAsyncError(async (req, res, next) => {
    //    console.log(req.params)
    // console.log(req.body)
    const { order_id, porterOrder_id } = req.body;

    const order = await porterModel.findOne({ order_id });
    if (!order || !porterOrder_id) {
        return next(new ErrorHandler(`Order not found`, 404))
    }
    // apiEndpoint = `https://pfe-apigw-uat.porter.in/v1/orders/${porterOrder_id}/cancel`

    try {
        apiEndpoint = `https://pfe-apigw-uat.porter.in/v1/orders/${porterOrder_id}/cancel`
        const response = await axios.post(apiEndpoint, {}, {
            headers: {
                'X-API-KEY': process.env.PORTER_API_KEY,
                'Content-Type': 'application/json'
            }
        });
        const cancelresponseData = response.data; // Extract only the data part of the response
        //   console.log("response",response)
        //   console.log("cancelresponseData",cancelresponseData);

        return res.status(200).json({ cancelresponseData })

    } catch (error) {
        return next(new ErrorHandler(error.response.data.message, error.response.status))
    }

})

const postPackedOrder = catchAsyncError(async (req, res, next) => {
    //    console.log(req.body)
    const { order_id, user_id, user, dispatchedTable, totalDispatchedAmount, totalRefundableAmount, updatedItems, orderDetail,orderDate } = req.body;
    // console.log(order_id,user_id,user,dispatchedTable)

    const order = await Dispatch.findOne({ order_id });
    // console.log(order)
    if (order) {
        return next(new ErrorHandler(` Dispatch Order already exist with this id: ${order_id}`, 404))
    }

    // const generateInvoiceNumber = async () => {
    //     try {
            // Fetch the last order
            const lastOrder = await Dispatch.findOne().sort({ _id: -1 }).exec();
    
            let newInvoiceNumber;
            const prefix = "JAS";
            const year = new Date().getFullYear();
            const fiscalYear = `${year % 100}-${(year + 1) % 100}`;
    
            if (lastOrder && lastOrder.invoiceNumber) {
                // Extract the number from the last invoice number
                const lastInvoiceNumber = lastOrder.invoiceNumber.split('/')[1];
                const nextInvoiceNumber = parseInt(lastInvoiceNumber, 10) + 1;
    
                newInvoiceNumber = `${prefix}/${nextInvoiceNumber}/${fiscalYear}`;
            } else {
                // No last order found, start with invoice number 1
                newInvoiceNumber = `${prefix}/1/${fiscalYear}`;
            }
    
    //         return newInvoiceNumber;
    //     } catch (error) {
    //         console.error('Error generating invoice number:', error);
    //         throw error;
    //     }
    // };

    try {
        const packedOrder = new Dispatch({
            order_id: order_id,
            invoiceNumber: newInvoiceNumber,
            user_id: user_id,
            user: user,
            orderDetail: orderDetail,
            updatedItems: updatedItems,
            dispatchedTable: dispatchedTable,
            orderDate:orderDate,
            totalDispatchedAmount: totalDispatchedAmount,
            totalRefundableAmount: totalRefundableAmount,

        });

        await packedOrder.save();

        if (packedOrder) {
            const order = await Payment.findOne({ order_id });
            // console.log("order",order)
            if (!order) {
                return next(new ErrorHandler(`Order not found with this id: ${order_id}`, 404))
            }

            const packedResponseStatus = await Payment.findOneAndUpdate(
                { order_id },
                { orderStatus: 'Packed' },
                { new: true }
            );

            // console.log("packedOrder", packedOrder)
           return res.status(200).json({
                success: true,
                packedOrderData: packedOrder
            })
        }

    } catch (error) {
        // console.log(error)
        return next(new ErrorHandler(error.response.data.message, error.response.status))
    }


})

const getPackedOrder = catchAsyncError(async (req, res, next) => {
    console.log("req.body", req.body);
    const { order_id } = req.body;

    // console.log("order_id", order_id);

    if (!order_id) {
        return next(new ErrorHandler(`Order not found with this id: ${order_id}`, 404))
    }


    const getpackedOrderData = await Dispatch.findOne({ order_id })

   return res.status(201).json({
        success: true,
        getpackedOrderData
    })

})

const getAllPackedOrder = catchAsyncError(async (req, res, next) => {

    try {
        const allpackedOrderData = await Dispatch.find({});
        // console.log("allpackedOrderData", allpackedOrderData)
        return res.status(201).json({
            success: true,
            allpackedOrderData
        })
    } catch (error) {
        return next(new ErrorHandler(error.response.data.message, error.response.status))
    }

})

const refundOrder = catchAsyncError(async (req, res, next) => {
    // console.log("req.body", req.body);
    const { order_id, RefundableAmount } = req.body;

    console.log("order_id", order_id, RefundableAmount);

    if (!order_id) {
        return next(new ErrorHandler(`Order not found with this id: ${order_id}`, 404))
    }

    if (typeof order_id !== 'string' || typeof RefundableAmount !== 'number') {

        return next(new ErrorHandler('Invalid data types: orderId should be a string and amount should be a number', 404))
    }
    try {
        // Initiate refund
        const refundPayload = {
            unique_request_id: 'refund_test_' + Date.now(),
            order_id: order_id,
            amount: RefundableAmount,
        };
        // console.log("refundPayload", refundPayload);
        if (RefundableAmount > 0) {
            const refundResponse = await juspay.order.refund(order_id, refundPayload);
            if (refundResponse) {
                const statusResponse = await juspay.order.status(order_id);
                if (statusResponse) {
                    const onepayments = await Payment.findOne({ order_id });
                    if (onepayments) {
                        const paymentstatus = await Payment.findOneAndUpdate({ order_id },
                            {
                                // orderStatus:"Dispatched",
                                $set: { statusResponse: statusResponse }
                            },
                            { new: true });
                           
                                const refundpayments = await Dispatch.findOne({ order_id });
                                if (refundpayments) {
                                    const refundStatus = await Dispatch.findOneAndUpdate({ order_id },
                                        {
                                            refundStatus: statusResponse.refunds[0].status,
                                            $set: { statusResponse: statusResponse }
                                        },
                                        { new: true });
                                   
                                
                        
                            }
                       return res.status(201).json({
                            success: true,
                            refundData: "Refund Initiated"
                        })
                    }
                }
            }
        }

    } catch (error) {
        console.log(error)
        return next(new ErrorHandler(error.response.data.message, error.response.status))
    }

})


module.exports = { getSinglePorterOrder, getPorterResponse, getCancelResponse, postPackedOrder, getPackedOrder, refundOrder, getAllPackedOrder };