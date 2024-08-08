const express = require('express');
const Item = require('../models/productModel');
const { Parser } = require('json2csv');
const csvtojson = require('csvtojson');
const catchAsyncError = require('../middleware/catchAsyncError');

// const downloadPrice = catchAsyncError ( async (req, res ,next) => {
//     try {
//         const items = await Item.find({}, { _id: 1, englishName: 1, price: 1});
//         if (req.query.format === 'csv') {
//             const fields = [ '_id','name', 'price'];
//             const json2csvParser = new Parser({ fields });
//             const csv = json2csvParser.parse(items);

//             res.header('Content-Type', 'text/csv');
//             res.attachment('items.csv');
//             return res.send(csv);
//         }

//         res.json(items);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });
const downloadPrice = async (req, res) => {
    const items = await Item.find({}, { _id: 1, englishName: 1, price: 1 ,stocks:1});

    if (req.query.format === 'csv') {
        // Adding an extra field for the index
        const itemsWithIndex = items.map((item, index) => ({
            index: index + 1,
            // _id: item._id,
            name: item.englishName,
            price: item.price,
            stocks:item.stocks,
        }));

        const fields = ['index', 'name', 'price', 'stocks' ];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(itemsWithIndex);

        res.header('Content-Type', 'text/csv');
        res.attachment('items.csv');
        return res.send(csv);
    }

    res.status(400).json({ message: 'Invalid format' });
};

const uploadPrice = catchAsyncError( async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ message: 'No file uploaded' });

        const csvData = await csvtojson().fromString(req.file.buffer.toString());

        for (const itemData of csvData) {
            const { _id, price,stocks,name } = itemData;
            await Item.updateOne({ englishName:name }, { $set: { price,stocks } });
        }

        return res.status(200).json({ message: 'Prices updated successfully' });
    } catch (error) {
        console.error('Error uploading file:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = {downloadPrice, uploadPrice };