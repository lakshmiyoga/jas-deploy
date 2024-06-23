const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
//     shippingInfo:{
//         address:{
//             type : String,
//             required: true
//         },
//         country:{
//             type : String,
//             required: true
//         },
//         city:{
//             type : String,
//             required: true
//         },
//         phoneNo:{
//             type : String,
//             required: true
//         },
//         postalCode:{
//             type : String,
//             required: true
//         },
        
//     },
//     user:{
//         type:mongoose.Schema.Types.ObjectId, 
//         required: true, 
//         ref:'User'
//     },
//     orderItems:[{
//         name:{
//             type : String,
//             required: true
//         },
//         quantity:{
//             type : Number,
//             required: true
//         },
//         image:{
//             type : String,
//             required: true
//         }, 
//         price:{
//             type : Number,
//             required: true
//         },
//         product:{
//             type:mongoose.Schema.Types.ObjectId, 
//             required: true, 
//             ref:'Product'
//         }
//     }],
//     itemsPrice:{
//         type : Number,
//         required:true,
//         default: 0.0
//     },
//     taxPrice:{
//         type : Number,
//         required:true,
//         default: 0.0
//     }, 
//     shippingPrice:{
//         type : Number,
//         required:true,
//         default: 0.0
//     }, 
//     totalPrice:{
//         type : Number,
//         required:true,
//         default: 0.0
//     },
//     paidAt:{
//         type:Date,
//     },
//     deliveredAt:{
//         type:Date,
//     },
//     orderStatus:{
//         type : String,
//         required:true,
//         default:'Processing'
//     },
//     createdAt:{
//         type:Date,
//         default:Date.now()
//     }
// })

shippingInfo: {
    address: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
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
    enum: ['Pending','', 'Shipped', 'Delivered'],
    default: 'Pending'
},
createdAt: {
    type: Date,
    default: Date.now
}
});

module.exports = mongoose.model('Order', orderSchema);