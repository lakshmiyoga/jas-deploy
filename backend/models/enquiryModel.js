const mongoose = require('mongoose');
const validator= require('validator');

const enquirySchema = new mongoose.Schema({
name:{
    type:String,
    required:[true, 'Please enter username']
},
email:{
    type:String,
    required:[true, 'Please enter email'] ,
    // unique:true,
    validate:[validator.isEmail, 'Please enter valid email']
},
mobile:{
    type:String,
    required:[true, 'Please enter Phone Number'] ,
},
message:{
    type:String,
    required:[true, 'Please enter message'] ,
},
createdAt: {
    type: Date,
    default: Date.now
}

})

module.exports = mongoose.model('enquiry', enquirySchema);