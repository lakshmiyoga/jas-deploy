const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
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
    type:Object,
    required: true,
    // ref: 'User'
},
user_id :{
    type:Object,
    required: true,
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
// paymentDetails : {
//   type:Array
// },
// paymentInfo: {
//     order_id: {
//         type: String,
//         // required: true
//     },
//     payment_id: {
//         type: String,
//         // required: true
//     },
//     signature: {
//         type: String,
//         // required: true
//     }
// },
order_id : {
    type: String,
    required: true,
    unique: true
},
description : {
    type: String,
},
paymentStatus: {
    type: String,
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
    enum: ['Processing','Dispatched', 'Removed', 'Cancelled',"Ended","Packed", "Refund"],
    default: 'Processing'
},
createdAt: {
    type: Date,
    default: Date.now
}
});

module.exports = mongoose.model('Order', orderSchema);