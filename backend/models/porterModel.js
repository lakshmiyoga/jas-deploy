const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    order_id:{
        type: String,
        required: true
    },
    request_id:{
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
    porterOrder: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    porterData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    porterResponse: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    updatedItems:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    detailedTable:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    totalRefundableAmount:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    tracking_url:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('porter', responseSchema);
