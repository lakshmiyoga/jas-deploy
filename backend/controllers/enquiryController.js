const Enquiry = require("../models/enquiryModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");


//post enquiry
const createEnquiry = catchAsyncError(async(req, res, next)=>{
    const{name, email, mobile, message} = req.body;
    console.log(req.body);
    let files = []

    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    console.log('reqfile',req.files)

    if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
            let url = `${BASE_URL}/uploads/Product/${file.filename}`;
            files.push({ file: url })
        })
    }

    req.body.files = files;

    try {

        // Check if an enquiry with the same email already exists
        // const existingEnquiry = await Enquiry.findOne({ email });

        // if (existingEnquiry) {
        //     return res.status(400).json({ message: 'An enquiry with this email already exists.' });
        // }

        // Validate name
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return next(new ErrorHandler('Please enter Name', 400));
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return next(new ErrorHandler('Please enter valid Email', 400));
        }

        // Validate mobile
        const mobileRegex = /^[0-9]{10}$/; // Adjust regex as per your mobile number format
        if (!mobile || !mobileRegex.test(mobile)) {
            return next(new ErrorHandler('Please enter valid mobile number', 400));
        }

        // Validate message
        if (!message) {
            return next(new ErrorHandler('Please enter Message', 400));
        }
    
        const enquiry = new Enquiry(
            {
                name, 
                email, 
                mobile, 
                messageData:message,
                files:req.body.files,
                createdAt:Date.now()},
        )
        // console.log("enquiry",enquiry)
        await enquiry.save();
         res.status(200).json({ success: true, enquiry });
        
      } catch (error) {
        console.log("error",error)
        return next(new ErrorHandler(error.errorResponse.errmsg, 500));
        
      }


})

//get Enquiry

const getEnquiry = catchAsyncError(async (req, res, next) => {
  
    const enquiry = await Enquiry.find();
console.log(enquiry)
    res.status(201).json({
        success: true,
        count: enquiry.length,
        enquiry
    })

})

//delete enquiry

const deleteEnquiry = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    try {
        const enquiry = await Enquiry.findByIdAndDelete(id);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        return next(new ErrorHandler(error.response.data.message , 500));
    }
})


module.exports = {createEnquiry,deleteEnquiry,getEnquiry};