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


module.exports = {  getSinglePorterOrder };