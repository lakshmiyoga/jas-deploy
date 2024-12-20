const mongoose = require('mongoose');
// const validator= require('validator');

const dispatchSchema = new mongoose.Schema({
    order_id:{
        type: String,
        required: true
    },
    invoiceNumber:{
        type: String,
        required: true
    },
    user_id:{
        type: String,
        required: true,
    },
    user: {
        type: Object,
        required: true,
    },
    dispatchedTable:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    totalDispatchedAmount:{
        type: String,
        required: true
    },
    totalRefundableAmount:{
        type: String,
        required: true
    },
    updatedItems:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    refundStatus: {
        type: String,
        required: true,
        enum: ['Pending','Refund'],
        default: 'Pending'
    },
    
    orderDetail:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    orderDate:{
        type: mongoose.Schema.Types.Mixed,
        default: {},
        required: true, 
    },
    statusResponse: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
        required: true,  
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('dispatch', dispatchSchema);