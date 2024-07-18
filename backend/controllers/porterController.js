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
        return next(new ErrorHandler(`Order not found with this id: ${req.params.order_id}`, 404))
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
        return next(new ErrorHandler(`Order not found with this id: ${req.params.order_id}`, 404))
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

    const porterResponse = await porterModel.findOneAndUpdate(
        { order_id },
        { $set: { porterResponse: responseData } },
        { new: true }
    );

    if (porterResponse) {
        res.status(200).json({
            success: true,
            porterResponse: responseData
        });
    } else {
        return next(new ErrorHandler(`Something went wrong with this id: ${order_id}`, 404));
    }
})


module.exports = {  getSinglePorterOrder, getPorterResponse};