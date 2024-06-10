// const products = require('../data/products.json');
// const Product = require('../models/productModel');
// const dotenv = require('dotenv');
// const connectDatabase = require('../config/database');

// dotenv.config({path:path.join(__dirname,"config/config.env")});

// connectDatabase();

// const seedProducts = async(req, res)=>{
//     try{
//         await Product.deleteMany();
//         console.log('Products Deleted');
//         await Product.insertMany();
//         console.log('Products Added');

//     }catch(error){
//         console.log(error.message);

//     }
//     process.exit();
// }
// seedProducts();