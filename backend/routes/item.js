const express = require('express');
const router = express.Router();

const multer = require('multer');
const { uploadPrice, downloadPrice } = require('../controllers/priceUpdate');

const upload = multer();

router.get('/download/price',downloadPrice);

router.post('/upload/price', upload.single('csvFile'), uploadPrice);

module.exports = router;