const mongoose = require('mongoose')

const allproductSchema = new mongoose.Schema({
    englishName:{
        type:String,
        required:true,
        
    },
    tamilName:{
        type:String,
        required:true,
        
    },
    buyingPrice:{
        type:Number,
        default:0.0
    }, 
    price:{
        type:Number,
        default:0.0
    }, 
    percentage:{
        type:Number,
        default:0
    },
    images:[
        {
            image:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:true,
        enum: {
            values:['Vegetables','Fruits','Keerai']
        }
        
    },
    measurement:{
        type:String,
        // required:true,
        enum: {
            values:['Kg','Piece','Box','Grams']
        },
        // default:'Kg',
        
    },
    range: { type: String },
    stocks:{
        type:String,
        required:true,
        // default:'Stock',
    },
    user:{
        type:mongoose.Schema.Types.ObjectId
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }

})

module.exports = mongoose.model('allproducts', allproductSchema);