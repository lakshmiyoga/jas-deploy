const { query } = require("express");
const Product = require("../models/allProductModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const s3 = require('../config/awsConfig');
const { S3Client ,DeleteObjectCommand} = require('@aws-sdk/client-s3');
const Announcement = require('../models/announcement');

//create announcement
const createAnnouncement = catchAsyncError(async (req, res, next) => {
    try{
        let images = [];

        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                images.push({ image: file.location }); // Store S3 URL
            });
        }
    
         // Ensure only the date part is stored
         const startDate = new Date(req.body.startDate).toISOString().split('T')[0]; // Extract date only
         const endDate = new Date(req.body.endDate).toISOString().split('T')[0];     // Extract date only


        const newAnnouncement = new Announcement({
            startDate,
            endDate,
            content:req.body.content,
            images: images,
        });
    
        await newAnnouncement.save();
        return res.status(201).json({ success: true, newAnnouncement });
    }
    catch(error){
        console.log("error",error)
        return res.status(500).json({ message: 'Error Creating Announcement!' });
    }
    
});

//get all announcement 

const getAllAnnouncement = catchAsyncError(async (req, res, next) => {
    try {
        const announcement = await Announcement.find(); // Fetch all categories
        return res.status(200).json({ success: true, announcement });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching Announcement' });
    }
});

// get single announcement

const getSingleAnnouncement = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    try {
        const announcement = await Announcement.findById(id);

        if (!announcement) {
            return res.status(404).json({ success: false, message: "Announcement not found" });
        }

        return res.status(200).json({ success: true, announcement });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching Announcement' });
    }
});

//update announcement
const updateAnnouncement = catchAsyncError(async (req, res, next) => {
    let announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
        return res.status(404).json({ success: false, message: "Announcement not found" });
    }

    let images = announcement.images;

    if (req.body.imagesCleared === 'true' && images.length > 0) {
        const deletePromises = images.map(async (img) => {
            const imageKey = img.image.split('/').pop(); // Get file key from URL

            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `announcement/${imageKey}`,
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
        announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        return res.status(200).json({ success: true, announcement });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating announcement' });
    }
});

//delete Announcement
const deleteAnnouncement = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    console.log("id",id)
    const announcement = await Announcement.findById(id);

    if (!announcement) {
        return res.status(404).json({ message: "Announcement not found" });
    }

    if (announcement.images.length > 0) {
        const deletePromises = announcement.images.map(async (img) => {
            const imageKey = img.image.split('/').pop();

            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `announcement/${imageKey}`,
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
        await Announcement.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting Announcement' });
    }
});



module.exports = {createAnnouncement,getAllAnnouncement,getSingleAnnouncement,updateAnnouncement,deleteAnnouncement};