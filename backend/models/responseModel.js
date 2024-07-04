const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    statusResponse: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Response', responseSchema);
