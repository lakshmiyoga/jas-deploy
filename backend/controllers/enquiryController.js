const Enquiry = require("../models/enquiryModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");

//post enquiry
const createEnquiry = catchAsyncError(async(req, res, next)=>{
    const{name, email, mobile, message} = req.body;
    // console.log(req.body);

    try {
    
        const enquiry = new Enquiry({name, email, mobile, message,createdAt:Date.now()})
        // console.log(enquiry)
        await enquiry.save();
         res.status(200).json({ success: true, enquiry });
        
      } catch (error) {
        return next(new ErrorHandler('Internal Server Error' , 500));
        
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
        return next(new ErrorHandler('Error deleting item' , 500));
    }
})


module.exports = {createEnquiry,deleteEnquiry,getEnquiry};