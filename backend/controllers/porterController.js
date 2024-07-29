const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require('../utils/errorHandler');
const Order = require("../models/order")
const Payment = require("../models/paymentModel")
const nodeCron = require('node-cron');
const nodemailer = require('nodemailer');
const path = require('path');
const axios = require('axios');
const porterModel = require('../models/porterModel');
// const fetch = require('node-fetch');


//get single order for user 

const getSinglePorterOrder = catchAsyncError(async (req, res, next) => {
    //    console.log(req.params)
    const  {order_id}  = req.body;
    // console.log(req.body)
    const order = await porterModel.findOne({ order_id});
    // console.log(order)
    if (!order) {
        return next(new ErrorHandler(`Order not found with this id: ${order_id}`, 404))
    }
    res.status(200).json({
        success: true,
        porterOrder:order
    })

})
const getPorterResponse = catchAsyncError(async (req, res, next) => {
    //    console.log(req.params)
    const  {order_id,porterOrder_id}  = req.body;
    const order = await porterModel.findOne({ order_id});
    // console.log("order",order)
    if (!order || !porterOrder_id) {
        return next(new ErrorHandler(`Order not found with this id: ${order_id}`, 404))
    }
    apiEndpoint = `https://pfe-apigw-uat.porter.in/v1/orders/${porterOrder_id}`
    // apiEndpoint = `https://pfe-apigw-uat.porter.in/v1/orders/{order_id:CRN93814651}`
    const response = await axios.get(apiEndpoint, {
        headers: {
          'X-API-KEY': process.env.PORTER_API_KEY,
          'Content-Type': 'application/json'
        }
      });
      const responseData = response.data; // Extract only the data part of the response

    const porterResponseData = await porterModel.findOneAndUpdate(
        { order_id },
        { $set: { porterResponse: responseData } },
        { new: true }
    );
//   console.log("porterResponseData",porterResponseData)
if (porterResponseData && porterResponseData.porterResponse && porterResponseData.porterResponse.status && porterResponseData.porterResponse.status === 'open'){
    const order = await Payment.findOne({ order_id});
    // console.log("order",order)
    if (!order || !porterOrder_id) {
        return next(new ErrorHandler(`Order not found with this id: ${order_id}`, 404))
    }

    const porterResponseStatus = await Payment.findOneAndUpdate(
        { order_id },
        { orderStatus:'Dispatched' },
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

 if (porterResponseData && porterResponseData.porterResponse && porterResponseData.porterResponse.status && porterResponseData.porterResponse.status === 'ended'){
    const order = await Payment.findOne({ order_id});
    // console.log("order",order)
    if (!order || !porterOrder_id) {
        return next(new ErrorHandler(`Order not found with this id: ${order_id}`, 404))
    }

    const porterResponseStatus = await Payment.findOneAndUpdate(
        { order_id },
        { orderStatus:'Delivered' },
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

 if (porterResponseData && porterResponseData.porterResponse && porterResponseData.porterResponse.status && porterResponseData.porterResponse.status === 'cancelled'){
    const order = await Payment.findOne({ order_id});
    // console.log("order",order)
    if (!order || !porterOrder_id) {
        return next(new ErrorHandler(`Order not found with this id: ${order_id}`, 404))
    }

    const porterResponseStatus = await Payment.findOneAndUpdate(
        { order_id },
        { orderStatus:'Cancelled' },
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

    if (porterResponseData) {
       return res.status(200).json({
            success: true,
            porterResponse: responseData
        });
    } else {
        return next(new ErrorHandler(`Something went wrong with this id: ${order_id}`, 404));
    }
})


const getCancelResponse = catchAsyncError(async (req, res, next) => {
    //    console.log(req.params)
        // console.log(req.body)
    const  {order_id,porterOrder_id}  = req.body;

    const order = await porterModel.findOne({ order_id});
    if (!order || !porterOrder_id) {
        return next(new ErrorHandler(`Order not found`, 404))
    }
    // apiEndpoint = `https://pfe-apigw-uat.porter.in/v1/orders/${porterOrder_id}/cancel`
   
    try{
        apiEndpoint = `https://pfe-apigw-uat.porter.in/v1/orders/${porterOrder_id}/cancel`
        const response = await axios.post(apiEndpoint, {},{
            headers: {
              'X-API-KEY': process.env.PORTER_API_KEY,
              'Content-Type': 'application/json'
            }
          });
          const cancelresponseData = response.data; // Extract only the data part of the response
        //   console.log("response",response)
        //   console.log("cancelresponseData",cancelresponseData);

          return res.status(200).json({cancelresponseData})
    
    }catch(error){
        return next(new ErrorHandler(error.response.data.message, error.response.status)) 
    }
    
})


module.exports = {  getSinglePorterOrder, getPorterResponse,getCancelResponse};