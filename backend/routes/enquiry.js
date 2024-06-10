const express =require('express');
const router = express.Router();
const {createEnquiry, deleteEnquiry,getEnquiry} = require("../controllers/enquiryController")



router.post('/enquiry',createEnquiry);
router.get('/getenquiry',getEnquiry);
router.delete('/enquiry/:id',deleteEnquiry);

module.exports=router;