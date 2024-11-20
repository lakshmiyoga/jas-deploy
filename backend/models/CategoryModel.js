const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  images:[
    {
        image:{
            type:String,
            required:true
        }
    }
],
  category: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
