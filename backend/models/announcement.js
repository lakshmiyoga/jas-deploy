const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  startDate: { 
    type: Date, required: true
  },
  endDate: { 
    type: Date, required: true
  },
  type: { type: String, required: true },
  content: { type: String },
  images:[
    {
        image:{
            type:String,
        }
    }
],
videos: [
  {
    video: { type: String },
  },
],
}, { timestamps: true });

module.exports = mongoose.model('announcement', announcementSchema);