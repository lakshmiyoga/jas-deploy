const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  measurement: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Measurement', measurementSchema);
