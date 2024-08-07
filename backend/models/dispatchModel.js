const mongoose = require('mongoose');
// const validator= require('validator');

const dispatchSchema = new mongoose.Schema({
    order_id:{
        type: String,
        required: true
    },
    user_id:{
        type: String,
        required: true
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
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('dispatch', dispatchSchema);