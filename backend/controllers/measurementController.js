const { query } = require("express");
const APIFeatures = require("../utils/apiFeatures");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const Measurement = require('../models/measurementModel');

//create measurement
const createMeasurement = catchAsyncError(async (req, res, next) => {
    console.log("Request Body:", req.body); // Log the full request body
        console.log("Measurement:", req.body.measurement); // Log measurement specifically
    try{
        const newMeasurement = new Measurement({
            measurement: req.body.measurement,
           
        });
    
        await newMeasurement.save();
        return res.status(201).json({ success: true, newMeasurement });
    }
    catch(error){
        console.log("error",error)
        return res.status(500).json({ message: 'Error Creating measurement!' });
    }
    
});


//update measurement
const updateMeasurement = catchAsyncError(async (req, res, next) => {
    console.log("req.params.id",req.params.id)
    console.log("req.body",req.body)

    let measurement = await Measurement.findById(req.params.id);

    if (!measurement) {
        return res.status(404).json({ success: false, message: "Measurement not found" });
    }

    try {
        measurement = await Measurement.findByIdAndUpdate(req.params.id,  req.body, {
            new: true,
            runValidators: true,
        });
        return res.status(200).json({ success: true, measurement });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating measurement' });
    }
});

//delete Measurement
const deleteMeasurement = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    console.log("id", id);
    
    const measurement = await Measurement.findById(id);

    if (!measurement) {
        return res.status(404).json({ message: "Measurement not found" });
    }

    try {
        await Measurement.findByIdAndDelete(id); // Corrected line
        return res.status(200).json({ message: 'Measurement deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting measurement' });
    }
});


//get all Measurement 

const getAllMeasurements = catchAsyncError(async (req, res, next) => {
    try {
        const measurements = await Measurement.find(); // Fetch all categories
        return res.status(200).json({ success: true, measurements });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching measurements' });
    }
});

// get single measurements

const getSingleMeasurement = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    try {
        const measurement = await Measurement.findById(id);

        if (!measurement) {
            return res.status(404).json({ success: false, message: "Measurement not found" });
        }

        return res.status(200).json({ success: true, measurement });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching Measurement' });
    }
});


module.exports = { getAllMeasurements,getSingleMeasurement ,deleteMeasurement,updateMeasurement,createMeasurement};