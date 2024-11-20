
// const mongoose = require('mongoose');
// const validator = require('validator');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Please enter your name'],
//     trim: true,
//     minlength: [2, 'Name must be at least 2 characters long'],
//     maxlength: [50, 'Name cannot exceed 50 characters']
//   },
//   email: {
//     type: String,
//     required: [true, 'Please enter your email'],
//     unique: true,
//     validate: {
//       validator: validator.isEmail,
//       message: 'Please enter a valid email'
//     }
//   },
//   shippingInfo: [
//     {
//       name: { type: String, required: true }, // Receiver's name
//       address: { type: String, required: true },
//       area: { type: String, required: true },
//       landmark: { type: String },
//       country: { type: String, required: true },
//       city: { type: String, required: true },
//       state: { type: String, required: true },
//       phoneNo: {
//         type: String,
//         required: true,
//         validate: {
//           validator: (v) => /^\d{10,15}$/.test(v),
//           message: 'Please enter a valid phone number'
//         }
//       },
//       postalCode: { type: String, required: true },
//       latitude: { type: String, required: true },
//       longitude: { type: String, required: true },
//       formattedAddress: { type: String, required: true },
//       defaultAddress: { type: Boolean, default: false } // Default address field
//     }
//   ],
//   password: {
//     type: String,
//     required: true,
//     // minlength: 6,
//     select: false
//   },

//   mobile: {
//     type: String,
//     required: true,
//   },
//   avatar: {
//     type: String,
//     default: 'default_avatar.jpg' // Assuming you have a default avatar
//   },
//   role: {
//     type: String,
//     enum: ['user', 'admin'], // Only 'user' and 'admin' roles are allowed
//     default: 'user'
//   },
//   resetPasswordToken: String,
//   resetPasswordTokenExpire: Date,
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('User', userSchema);


const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    // email: { type: String, unique: true},
    // phone: { type: String, unique: true },
    name: {
        type: String,
        // required: [true, 'Please enter your name'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        // required: [true, 'Please enter your email'],
        // unique: true,
        
        // validate: {
        //     validator: validator.isEmail,
        //     message: 'Please enter a valid email'
        // }
    },
    shippingInfo: [
        {
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
        }
    ],
    password: {
        type: String,
        // required: true,
        // minlength: 6,
        select: false
    },

    mobile: {
        type: String,
        // unique: true,
        // required: true,
    },
    avatar: {
        type: String,
        default: 'default_avatar.jpg' // Assuming you have a default avatar
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'subadmin'], // Only 'user' and 'admin' roles are allowed
        default: 'user'
    },
    otp: { type: String },
    otpExpiry: { type: Date },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.index(
    { email: 1, mobile: 1 },
    { unique: true, partialFilterExpression: { $or: [{ email: { $exists: true } }, { mobile: { $exists: true } }] } }
);

module.exports = mongoose.model('User', userSchema);