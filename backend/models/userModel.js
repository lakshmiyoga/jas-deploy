// const mongoose = require('mongoose');
// const validator= require('validator');

// const userSchema = new mongoose.Schema({
// name:{
//     type:String,
//     required:[true, 'Please enter username']
// },
// email:{
//     type:String,
//     required:[true, 'Please enter email'] ,
//     unique:true,
//     validate:[validator.isEmail, 'Please enter valid email']
// },
// password:{
//     type:String,
//     required:[true, 'Please enter password'] ,
//     minlength:[6, 'Password must be at least 6 characters long'],
//     select: false

// },
// avatar: {
//     type: String
// },
// role: {
//     type: String,
//     default: 'user' // Default role for new users
//   },
//   resetPasswordToken: String,
//   resetPasswordTokenExpire: Date,
//   createdAt:{
//     type:Date,
//     default:Date.now()
// }
// })

// module.exports = mongoose.model('User', userSchema);


const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please enter a valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },
  avatar: {
    type: String,
    default: 'default_avatar.jpg' // Assuming you have a default avatar
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Only 'user' and 'admin' roles are allowed
    default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordTokenExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
