const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require('../utils/errorHandler');
const Payment = require("../models/paymentModel")
const Dispatch = require("../models/dispatchModel")
const User = require("../models/userModel")
const Enquiry = require("../models/enquiryModel")




const analysisOrders = catchAsyncError(async (req, res, next) => {

    try {
        const { startDate, endDate } = req.query;
    console.log("startdate and enddate",startDate,endDate)
    let query = {};
    
    if (startDate && endDate) {
        const formattedStartDate = new Date(startDate).toISOString();
        const formattedEndDate = new Date(endDate).toISOString();
        query = {
            createdAt: { $gte: formattedStartDate, $lte: formattedEndDate }
        };
    } else {
        // Fetch orders from the last month if no dates are set
        query = { };
    }

    const orders = await Payment.find(query);
    const totalOrders = await Payment.countDocuments(query);

    let totalAmount = 0;
    orders.forEach(order => {
        if (order.paymentStatus === "CHARGED") {
            totalAmount += order.totalPrice;
        }
        
    });

    const dispatches = await Dispatch.find(query);

    let totalRefundAmount = 0;
    let totalDispatchedAmount = 0;

    dispatches.forEach(dispatch => {
        if (dispatch.refundStatus === 'SUCCESS' && dispatch.totalRefundableAmount) {
            totalRefundAmount += parseFloat(dispatch.totalRefundableAmount);
        }
        if (dispatch.totalDispatchedAmount) {
            totalDispatchedAmount += parseFloat(dispatch.totalDispatchedAmount);
        }
    });

    // Fetch new users count
    const usersCount = await User.countDocuments(query);

    // Fetch total enquiries count
    const totalEnquiries = await Enquiry.countDocuments(query);

    return res.status(200).json({
        success: true,
        totalAmount,
        analysisData:orders,
        totalOrders,
        refundedAmount:totalRefundAmount,
        dispatchedAmount:totalDispatchedAmount,
        usersCount,
        totalEnquiries,
    });
    }
    catch (error) {
        console.error("Error fetching order summary:", error);
        return next(new ErrorHandler(`Something Went Wrong Please Try Again!!!!`, 400));
    }


})



module.exports = { analysisOrders};