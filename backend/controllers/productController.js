const { query } = require("express");
const Product = require("../models/productModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");

// Create an item
const createProducts = catchAsyncError(async (req, res, next) => {

    let images = []

    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
            let url = `${BASE_URL}/uploads/Product/${file.originalname}`;
            images.push({ image: url })
        })
    }

    req.body.images = images;

    req.body.user = req.user.id;
    // const { name, price, category, images,user } = req.body;

    // console.log(name);

    const newItem = new Product({
        englishName: req.body.englishName,
        tamilName: req.body.tamilName,
        price: req.body.price,
        category: req.body.category,
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

const updateProducts = async (req, res, next) => {
    console.log(req)

    let product = await Product.findByIdAndUpdate(req.params.id);
    console.log(product)

    let images = [];

    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    // if images not cleared we keep existing images
    if(req.body.imagesCleared === 'false'){
        images = product.images;
    }

    if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
            let url = `${BASE_URL}/uploads/Product/${file.originalname}`;
            images.push({ image: url })
        })
    }

    req.body.images = images;

    if(!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    

    res.status(200).json({
        success: true,
        product
    })
}

//delete the item

const deleteProducts = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedItem = await Product.findByIdAndDelete(id);
        res.status(200).json({ msg: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting item' });
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
