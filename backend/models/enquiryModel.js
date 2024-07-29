const mongoose = require('mongoose');
const validator= require('validator');

const enquirySchema = new mongoose.Schema({
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
    // unique:true,
    // validate:[validator.isEmail, 'Please enter valid email']
},
mobile:{
    type:String,
    required:true
},
message:{
    type:String,
    required:true
},
createdAt: {
    type: Date,
    default: Date.now
}

})

module.exports = mongoose.model('enquiry', enquirySchema);