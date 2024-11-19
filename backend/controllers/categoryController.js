const { query } = require("express");
// const Product = require("../models/productModel");
const Product = require("../models/allProductModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const s3 = require('../config/awsConfig');
const { S3Client ,DeleteObjectCommand} = require('@aws-sdk/client-s3');
const Category = require('../models/CategoryModel');

//create catogory
const createCategory = catchAsyncError(async (req, res, next) => {
    try{
        let images = [];

        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                images.push({ image: file.location }); // Store S3 URL
            });
        }
    
        const newCategory = new Category({
            name: req.body.name,
            description: req.body.description,
            category:req.body.category,
            type:req.body.type,
            images: images,
        });
    
        await newCategory.save();
        return res.status(201).json({ success: true, newCategory });
    }
    catch(error){
        console.log("error",error)
        return res.status(500).json({ message: 'Error Creating category!' });
    }
    
});


//update category
const updateCategory = catchAsyncError(async (req, res, next) => {
    let category = await Category.findById(req.params.id);

    if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" });
    }

    let images = category.images;

    if (req.body.imagesCleared === 'true' && images.length > 0) {
        const deletePromises = images.map(async (img) => {
            const imageKey = img.image.split('/').pop(); // Get file key from URL

            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `Category/${imageKey}`,
            };

            try {
                const command = new DeleteObjectCommand(params);
                await s3.send(command);
                console.log(`Deleted ${imageKey} from S3`);
            } catch (error) {
                console.log(`Error deleting ${imageKey} from S3:`, error);
            }
        });

        await Promise.all(deletePromises);
        images = []; // Clear images array if deleted
    }

    if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
            images.push({ image: file.location });
        });
    }

    req.body.images = images;

    try {
        category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        return res.status(200).json({ success: true, category });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating category' });
    }
});

//delete category
const deleteCategory = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    console.log("id",id)
    const category = await Category.findById(id);

    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }

    if (category.images.length > 0) {
        const deletePromises = category.images.map(async (img) => {
            const imageKey = img.image.split('/').pop();

            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `Category/${imageKey}`,
            };

            try {
                const command = new DeleteObjectCommand(params);
                await s3.send(command);
                console.log(`Deleted ${imageKey} from S3`);
            } catch (error) {
                console.log(`Error deleting ${imageKey} from S3:`, error);
            }
        });

        await Promise.all(deletePromises);
    }

    try {
        await Category.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting category' });
    }
});

//get all category 

const getAllCategories = catchAsyncError(async (req, res, next) => {
    try {
        const categories = await Category.find(); // Fetch all categories
        return res.status(200).json({ success: true, categories });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching categories' });
    }
});

// get single catogory

const getSingleCategory = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    try {
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        return res.status(200).json({ success: true, category });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching category' });
    }
});


module.exports = { getAllCategories,getSingleCategory ,deleteCategory,updateCategory,createCategory};