const mongoose = require('mongoose');
const validator= require('validator');

const userSchema = new mongoose.Schema({
name:{
    type:String,
    required:[true, 'Please enter username']
},
email:{
    type:String,
    required:[true, 'Please enter email'] ,
    unique:true,
    validate:[validator.isEmail, 'Please enter valid email']
},
password:{
    type:String,
    required:[true, 'Please enter password'] ,
    minlength:[6, 'Password must be at least 6 characters long'],
    select: false

},
avatar: {
    type: String
},
role: {
    type: String,
    default: 'user' // Default role for new users
  },
  resetPasswordToken: String,
  resetPasswordTokenExpire: Date,
  createdAt:{
    type:Date,
    default:Date.now()
}
})

module.exports = mongoose.model('User', userSchema);