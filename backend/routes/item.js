const express = require('express');
const router = express.Router();

const multer = require('multer');
const { uploadPrice, downloadPrice } = require('../controllers/priceUpdate');

const upload = multer();
// const upload = multer({
//     limits: { fileSize: 5 * 1024 * 1024 }  // 5 MB limit
// });


router.get('/download/price',downloadPrice);

router.post('/upload/price', upload.single('Prices'), uploadPrice);

module.exports = router;