const mongoose = require('mongoose');
const validator= require('validator');

const enquirySchema = new mongoose.Schema({
name:{
    type:String,
    // required:true,
    default:''
},
email:{
    type:String,
    // required:true,
    default:''
},
mobile:{
    type:String,
    // required:true,
    default:''
},
messageData:{
    type:String,
    // required:true,
    default:''
},
createdAt: {
    type: Date,
    default: Date.now
}

})

module.exports = mongoose.model('enquiry', enquirySchema);