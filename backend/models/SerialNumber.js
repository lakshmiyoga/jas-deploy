const mongoose = require('mongoose');

const SerialNumberSchema = new mongoose.Schema({
    orderDate: {
        type: String, // You can also use Date type if you prefer
        required: true,
    },
    serialNumber: {
        type: Number,
        required: true,
        default: 1,
    },
});

const SerialNumber = mongoose.model('SerialNumber', SerialNumberSchema);

module.exports = SerialNumber;
