const { query } = require("express");
// const Product = require("../models/productModel");
const Product = require("../models/allProductModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const s3 = require('../config/awsConfig');
const { S3Client ,DeleteObjectCommand} = require('@aws-sdk/client-s3');

// Create an item
const createProducts = catchAsyncError(async (req, res, next) => {

    let images = []

    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    // if (req.files && req.files.length > 0) {
    //     req.files.forEach(file => {
    //         let url = `${BASE_URL}/uploads/Product/${file.filename}`;
    //         images.push({ image: url })
    //     })
    // }

    if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
            images.push({ image: file.location });  // Use S3 file location (URL)
        });
    }

    req.body.images = images;

    req.body.user = req.user.id;
    // const { name, price, category, images,user } = req.body;

    // console.log(name);

     // Trim all string properties in req.body
     for (let key in req.body) {
        if (typeof req.body[key] === 'string') {
            req.body[key] = req.body[key].trim();
        }
    }

    const newItem = new Product({
        englishName: req.body.englishName,
        tamilName: req.body.tamilName,
        buyingPrice:req.body.buyingPrice,
        price: req.body.price,
        category: req.body.category,
        measurement: req.body.measurement,
        maximumQuantity: req.body.maximumQuantity,
        range:req.body.rangeForGrams,
        percentage:req.body.percentage,
        stocks:req.body.stocks,
        images: req.body.images,
        user: req.body.user
    });
    
    console.log(newItem);
    await newItem.save();
    res.status(201).json({ success: true, newItem });

});

//get all item
const getProducts = catchAsyncError(async (req, res, next) => {
    const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter();

    const getitems = await apiFeatures.query;

    res.status(201).json({
        success: true,
        count: getitems.length,
        getitems
    })

})

//Get Single Product - api/v1/product/:id
const getSingleProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('user', 'name email');

    if (!product) {
        return next(new ErrorHandler('Product not found', 400));
    }

    res.status(201).json({
        success: true,
        product
    })
})


//update the item

// const updateProducts = async (req, res, next) => {
//     console.log(req)

//     let product = await Product.findByIdAndUpdate(req.params.id);
//     // console.log(product)

//     let images = [];

//     let BASE_URL = process.env.BACKEND_URL;
//     if(process.env.NODE_ENV === "production"){
//         BASE_URL = `${req.protocol}://${req.get('host')}`
//     }

//     // if images not cleared we keep existing images
//     // if(req.body.imagesCleared === 'false'){
//     //     images = product.images;
//     // }

//     // if (req.files && req.files.length > 0) {
//     //     req.files.forEach(file => {
//     //         let url = `${BASE_URL}/uploads/Product/${file.filename}`;
//     //         images.push({ image: url })
//     //     })
//     // }

//     if (req.body.imagesCleared === 'true' && product.images.length > 0) {
//         const deletePromises = product.images.map(async (img) => {
//             const imageKey = img.image.split('/').pop();   // Extract the file key from the image URL

//             const params = {
//                 Bucket: process.env.S3_BUCKET_NAME,
//                 Key: `Product/${imageKey}`  // Key is the path of the image in S3
//             };

//             try {
//                 const command = new DeleteObjectCommand(params);
//                 await s3.send(command);
//                 console.log(`Deleted ${imageKey} from S3`);
//             } catch (error) {
//                 console.log(`Error deleting ${imageKey} from S3:`, error);
//             }
//         });

//         // Wait for all delete promises to finish
//         await Promise.all(deletePromises);
//     } else {
//         // If images not cleared, keep the existing images
//         images = product.images;
//     }

//     // Upload new images to S3 (if any)
//     if (req.files && req.files.length > 0) {
//         req.files.forEach(file => {
//             images.push({ image: file.location });  // Use S3 file location (URL)
//         });
//     }

//     req.body.images = images;

//     if(!product) {
//         return res.status(404).json({
//             success: false,
//             message: "Product not found"
//         });
//     }

//     product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true
//     })
    

//    return res.status(200).json({
//         success: true,
//         product
//     })
// }

const updateProducts = async (req, res, next) => {
    // console.log(req)

    let product = await Product.findByIdAndUpdate(req.params.id);
    // console.log(product)

    let images = [];

    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    // if images not cleared we keep existing images
    // if(req.body.imagesCleared === 'false'){
    //     images = product.images;
    // }

    // if (req.files && req.files.length > 0) {
    //     req.files.forEach(file => {
    //         let url = ${BASE_URL}/uploads/Product/${file.originalname};
    //         images.push({ image: url })
    //     })
    // }

    if (req.body.imagesCleared === 'true' && product.images.length > 0) {
        const deletePromises = product.images.map(async (img) => {
            const imageKey = img.image.split('/').pop();   // Extract the file key from the image URL

            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key:`Product/${imageKey}` // Key is the path of the image in S3
            };

            try {
                const command = new DeleteObjectCommand(params);
                await s3.send(command);
                console.log(`Deleted ${imageKey} from S3`);
            } catch (error) {
                console.log(`Error deleting ${imageKey} from S3:`, error);
            }
        });

        // Wait for all delete promises to finish
        await Promise.all(deletePromises);
    } else {
        // If images not cleared, keep the existing images
        images = product && product.images;
    }

    // Upload new images to S3 (if any)
    if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
            images.push({ image: file.location });  // Use S3 file location (URL)
        });
    }

    req.body.images = images;

    if(!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

      // Trim all string properties in req.body
      for (let key in req.body) {
        if (typeof req.body[key] === 'string') {
            req.body[key] = req.body[key].trim();
        }
    }
  try{
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    

   return res.status(200).json({
        success: true,
        product
    })
  }
  catch (error) {
    console.log("error",error)
   return res.status(500).json({ message: 'Error Updating item' });
}
    
}

//delete the item

const deleteProducts = async (req, res, next) => {
    const { id } = req.params;
    let product = await Product.findById(id);
    console.log("productdelete",product)

    if ( product.images.length > 0) {
        const deletePromises = product.images.map(async (img) => {
            const imageKey = img.image.split('/').pop();   // Extract the file key from the image URL

            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `Product/${imageKey}`  // Key is the path of the image in S3
            };

            try {
                const command = new DeleteObjectCommand(params);
                await s3.send(command);
                console.log(`Deleted ${imageKey} from S3`);
            } catch (error) {
                console.log(`Error deleting ${imageKey} from S3:`, error);
            }
        });

        // Wait for all delete promises to finish
        await Promise.all(deletePromises);
    }

    try {
        const deletedItem = await Product.findByIdAndDelete(id);
        return res.status(200).json({ msg: 'Item deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting item' });
    }
}

//Create Review - api/v1/review

const createReview = catchAsyncError(async (req, res, next) => {
    const { productId, rating, comment } = req.body;

    const review = {
        user: req.user.id,
        rating,
        comment
    };

    // Fetch the product by its ID
    const product = await Product.findById(productId);

    // Check if the product exists
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    // Check if the product has reviews
    if (!product.reviews) {
        product.reviews = [];
    }

    // Check if the user has already reviewed the product
    const isReviewed = product.reviews.find(review => {
        return review.user.toString() === req.user.id.toString();
    });

    if (isReviewed) {
        // Updating the review
        product.reviews.forEach(existingReview => {
            if (existingReview.user.toString() === req.user.id.toString()) {
                existingReview.comment = comment;
                existingReview.rating = rating;
            }
        });
    } else {
        // Creating a new review
        product.reviews.push(review);
    }

    // Update number of reviews
    product.numOfReviews = product.reviews.length;

    // Calculate average rating
    product.ratings = product.reviews.reduce((acc, review) => {
        return review.rating + acc;
    }, 0) / product.reviews.length;
    product.ratings = isNaN(product.ratings) ? 0 : product.ratings;

    // Save the updated product
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    });
});


//Get Reviews - api/v1/reviews?id={productId}

const getReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id).populate('reviews.user', 'name email');

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

//Delete Review - api/v1/review

const deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    //filtering the reviews which does match the deleting review id
    const reviews = product.reviews.filter(review => {
        return review._id.toString() !== req.query.id.toString()
    });
    //number of reviews 
    const numOfReviews = reviews.length;

    //finding the average with the filtered reviews
    let ratings = reviews.reduce((acc, review) => {
        return review.rating + acc;
    }, 0) / reviews.length;
    ratings = isNaN(ratings) ? 0 : ratings;

    //save the product document
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        numOfReviews,
        ratings
    })
    res.status(200).json({
        success: true
    })


});
// get admin products  - api/v1/admin/products
const getAdminProducts = catchAsyncError(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).send({
        success: true,
        products
    })
});





module.exports = { createProducts, getProducts, updateProducts, deleteProducts, createReview, getReviews, deleteReview, getSingleProduct, getAdminProducts };
