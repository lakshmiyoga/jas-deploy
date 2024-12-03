const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  startDate: { 
    type: Date, required: true
  },
  endDate: { 
    type: Date, required: true
  },
  content: { type: String, required: true },
  images:[
    {
        image:{
            type:String,
            required:true
        }
    }
],
}, { timestamps: true });

module.exports = mongoose.model('announcement', announcementSchema);