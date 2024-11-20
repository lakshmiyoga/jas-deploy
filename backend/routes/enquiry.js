const express =require('express');
const router = express.Router();
const {createEnquiry, deleteEnquiry,getEnquiry} = require("../controllers/enquiryController");
const multer = require('multer');
const path = require('path')


const upload = multer({storage: multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(  __dirname,'..' , 'uploads/Enquiry' ) )
    },
    filename: function(req, file, cb ) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    }
}) })


router.post('/enquiry',upload.array('files'),createEnquiry);
router.get('/getenquiry',getEnquiry);
router.delete('/enquiry/:id',deleteEnquiry);

module.exports=router;