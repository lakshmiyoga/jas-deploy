const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    shippingInfo: {
      name: { type: String, required: true }, // Receiver's name
      address: { type: String, required: true },
      area: { type: String, required: true },
      landmark: { type: String },
      country: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      phoneNo: {
        type: String,
        required: true,
        validate: {
          validator: (v) => /^\d{10,15}$/.test(v),
          message: 'Please enter a valid phone number'
        }
      },
      postalCode: { type: String, required: true },
      latitude: { type: String, required: true },
      longitude: { type: String, required: true },
      formattedAddress: { type: String, required: true },
      defaultAddress: { type: Boolean, default: false } // Default address field
    },
    user: {
        type: Object,
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderItems: [{
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        productWeight: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        measurement:{
            type: String,
            required: true
        },
        range: { type: String },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        }
    }],
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    order_id: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['initiated', 'CHARGED', 'PENDING','PENDING_VBV', 'AUTHORIZATION_FAILED', 'AUTHENTICATION_FAILED', 'NEW'],
        default: 'initiated'
    },
    statusResponse: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
        required: true,  
    },
    paidAt: {
        type: Date,
    },
    deliveredAt: {
        type: Date,
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['Processing','Dispatched', 'Removed','Delivered','Cancelled'],
        default: 'Processing'
    },
    cancleReason:{
        type: String,
    },
    removalReason:{
        type: String,
    },
    orderDate:{
        type: mongoose.Schema.Types.Mixed,
        default: {},
        required: true, 
    },
    orderDescription:{
        type: String,
        default: '',
        required: true, 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', paymentSchema);