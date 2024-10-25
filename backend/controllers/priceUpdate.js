const express = require('express');
// const Item = require('../models/productModel');
const Item = require('../models/allProductModel');
const { Parser } = require('json2csv');
const csvtojson = require('csvtojson');
const catchAsyncError = require('../middleware/catchAsyncError');
const ExcelJS = require('exceljs');

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
// const downloadPrice = async (req, res) => {
//     let items = await Item.find({}, { _id: 1, englishName: 1,buyingPrice:1, price: 1 ,stocks:1});
//     items = items.sort((a, b) => a.englishName.localeCompare(b.englishName));

//     if (req.query.format === 'csv') {
//         // Adding an extra field for the index
//         const itemsWithIndex = items.map((item, index) => ({
//             index: index + 1,
//             // _id: item._id,
//             name: item.englishName,
//             buyingPrice:item.buyingPrice,
//             price: item.price,
//             stocks:item.stocks,
//         }));

//         const fields = ['index', 'name','buyingPrice', 'price', 'stocks' ];
//         const json2csvParser = new Parser({ fields });
//         const csv = json2csvParser.parse(itemsWithIndex);

//         res.header('Content-Type', 'text/csv');
//         res.attachment('items.csv');
//         return res.send(csv);
//     }

//     res.status(400).json({ message: 'Invalid format' });
// };
// const downloadPrice = async (req, res) => {
//     let items = await Item.find({}, { _id: 1, englishName: 1, category: 1, buyingPrice: 1, price: 1, stocks: 1 });

//     // Separate categories
//     const vegetables = items.filter(item => item.category === 'Vegetables').sort((a, b) => a.englishName.localeCompare(b.englishName));
//     const fruits = items.filter(item => item.category === 'Fruits').sort((a, b) => a.englishName.localeCompare(b.englishName));
//     const keerai = items.filter(item => item.category === 'Keerai').sort((a, b) => a.englishName.localeCompare(b.englishName));

//     const categories = [
//         { name: 'Vegetables', items: vegetables },
//         { name: 'Fruits', items: fruits },
//         { name: 'Keerai', items: keerai }
//     ];

//     // Generate CSV data for each category
//     let csvData = [];

//     categories.forEach(category => {
//         // Add the heading for each category with a space (blank row before heading)
//         csvData.push({ SNo: '', Category: '', Name: '', BuyingPrice: '', Price: '', Stocks: '' });
//         csvData.push({ SNo: '', Category: '', Name: '', BuyingPrice: '', Price: '', Stocks: '' }); // Blank row for spacing
//         csvData.push({ SNo: '', Category: category.name, Name: '', BuyingPrice: '', Price: '', Stocks: '' }); // Category heading
//         csvData.push({ SNo: '', Category: '', Name: '', BuyingPrice: '', Price: '', Stocks: '' });

//         // Add items for each category
//         category.items.forEach((item, index) => {
//             csvData.push({
//                 SNo: index + 1, // Separate index for each category
//                 Category: category.name,
//                 Name: item.englishName,
//                 BuyingPrice: item.buyingPrice,
//                 Price: item.price,
//                 Stocks: item.stocks,
//             });
//         });
//     });

//     if (req.query.format === 'csv') {
//         const fields = ['SNo', 'Category', 'Name', 'BuyingPrice', 'Price', 'Stocks'];
//         const json2csvParser = new Parser({ fields });
//         const csv = json2csvParser.parse(csvData);

//         res.header('Content-Type', 'text/csv');
//         res.attachment('items.csv');
//         return res.send(csv);
//     }

//     res.status(400).json({ message: 'Invalid format' });
// };


// const downloadPrice = async (req, res) => {
//     let items = await Item.find({}, { _id: 1, englishName: 1, category: 1, buyingPrice: 1, price: 1, stocks: 1 });

//     // Separate categories
//     const vegetables = items.filter(item => item.category === 'Vegetables').sort((a, b) => a.englishName.localeCompare(b.englishName));
//     const fruits = items.filter(item => item.category === 'Fruits').sort((a, b) => a.englishName.localeCompare(b.englishName));
//     const keerai = items.filter(item => item.category === 'Keerai').sort((a, b) => a.englishName.localeCompare(b.englishName));

//     const categories = [
//         { name: 'Vegetables', items: vegetables },
//         { name: 'Fruits', items: fruits },
//         { name: 'Keerai', items: keerai }
//     ];

//     // Create a new workbook and worksheet
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Prices');

//     // Define columns
//     worksheet.columns = [
//         { header: 'S.No', key: 'SNo', width: 10 },
//         { header: 'Category', key: 'Category', width: 20 },
//         { header: 'Name', key: 'Name', width: 30 },
//         { header: 'Buying Price', key: 'BuyingPrice', width: 20 },
//         { header: 'Price', key: 'Price', width: 20 },
//         { header: 'Stocks', key: 'Stocks', width: 15 }
//     ];

//     categories.forEach(category => {
//         // Add blank row for spacing
//         worksheet.addRow({});
//         worksheet.addRow({});

//         // Add the category heading and merge the cells across all columns
//         const headingRow = worksheet.addRow([category.name]);
//         worksheet.mergeCells(`A${headingRow.number}:F${headingRow.number}`); // Merging A to F cells for the heading

//         // Apply bold styling and center alignment for the heading
//         const headingCell = headingRow.getCell(1);
//         headingCell.font = { bold: true };
//         headingCell.alignment = { vertical: 'middle', horizontal: 'center' }; // Center the heading

//         worksheet.addRow({});

//         // Add items for each category
//         category.items.forEach((item, index) => {
//             worksheet.addRow({
//                 SNo: index + 1, // Separate index for each category
//                 Category: category.name,
//                 Name: item.englishName,
//                 BuyingPrice: item.buyingPrice,
//                 Price: item.price,
//                 Stocks: item.stocks,
//             });
//         });
//     });

//     // Get the current date in YYYY-MM-DD format
//     const currentDate = new Date().toISOString().split('T')[0];

//     // Set dynamic filename with the current date
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', `attachment; filename=items-${currentDate}.xlsx`);

//     await workbook.xlsx.write(res).then(() => res.end()); // Ensure stream is closed
// };




// const uploadPrice = catchAsyncError( async (req, res) => {
//     try {
//         if (!req.file)
//             return res.status(400).json({ message: 'No file uploaded' });

//         const csvData = await csvtojson().fromString(req.file.buffer.toString());

//         for (const itemData of csvData) {
//             const { _id,buyingPrice, price,stocks,name } = itemData;
//             await Item.updateOne({ englishName:name }, { $set: {buyingPrice,price,stocks } });
//         }

//         return res.status(200).json({ message: 'Prices updated successfully' });
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// });

// const uploadPrice = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: 'No file uploaded' });
//         }

//         const workbook = new ExcelJS.Workbook();
//         await workbook.xlsx.load(req.file.buffer); // Load the uploaded Excel file buffer

//         const worksheet = workbook.getWorksheet('Prices');
//         if (!worksheet) {
//             return res.status(400).json({ message: 'Worksheet "Prices" not found in the file' });
//         }

//         let category = null;
//         let items = [];

//         worksheet.eachRow((row, rowNumber) => {
//             // Skip empty rows or rows with merged cells (headers or spaces)
//             if (rowNumber < 3 || row.getCell(1).value === null || row.getCell(1).value === '') {
//                 return; // Ignore blank rows, headers, or any irrelevant data
//             }

//             const firstCell = row.getCell(1).value;
//             if (typeof firstCell === 'string' && (firstCell === 'Vegetables' || firstCell === 'Fruits' || firstCell === 'Keerai')) {
//                 // New category detected
//                 category = firstCell;
//             } else {
//                 // Process item rows
//                 const item = {
//                     category: category,
//                     name: row.getCell(3).value, // English name is in the 3rd column
//                     buyingPrice: row.getCell(4).value, // Buying Price is in the 4th column
//                     price: row.getCell(5).value, // Price is in the 5th column
//                     stocks: row.getCell(6).value, // Stocks is in the 6th column
//                 };
//                 items.push(item);
//             }
//         });

//         // Update items in the database
//         for (const itemData of items) {
//             const { name, buyingPrice, price, stocks, category } = itemData;
//             await Item.updateOne(
//                 { englishName: name, category: category },
//                 { $set: { buyingPrice, price, stocks } }
//             );
//         }

//         return res.status(200).json({ message: 'Prices updated successfully' });
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };







const downloadPrice = async (req, res) => {
    let items = await Item.find({}, { _id: 1, englishName: 1, category: 1, buyingPrice: 1, percentage: 1, stocks: 1 });

    // Separate categories
    const vegetables = items.filter(item => item.category === 'Vegetables').sort((a, b) => a.englishName.localeCompare(b.englishName));
    const keerai = items.filter(item => item.category === 'Keerai').sort((a, b) => a.englishName.localeCompare(b.englishName));
    const fruits = items.filter(item => item.category === 'Fruits').sort((a, b) => a.englishName.localeCompare(b.englishName));

    const categories = [
        { name: 'Vegetables', items: vegetables },
        { name: 'Keerai', items: keerai },
        { name: 'Fruits', items: fruits },
        
    ];

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Prices');

    // Define columns with "Percentage" instead of "Price"
    worksheet.columns = [
        { header: 'S.No', key: 'SNo', width: 10 },
        { header: 'Category', key: 'Category', width: 20 },
        { header: 'Name', key: 'Name', width: 30 },
        { header: 'Buying Price', key: 'BuyingPrice', width: 20 },
        { header: 'Percentage', key: 'Percentage', width: 20 },
        { header: 'Stocks', key: 'Stocks', width: 15 }
    ];

    categories.forEach(category => {
        // Add blank row for spacing
        worksheet.addRow({});
        worksheet.addRow({});

        // Add the category heading and merge the cells across all columns
        const headingRow = worksheet.addRow([category.name]);
        worksheet.mergeCells(`A${headingRow.number}:F${headingRow.number}`); // Merging A to F cells for the heading

        // Apply bold styling and center alignment for the heading
        const headingCell = headingRow.getCell(1);
        headingCell.font = { bold: true };
        headingCell.alignment = { vertical: 'middle', horizontal: 'center' }; // Center the heading

        worksheet.addRow({});

        // Add items for each category
        category.items.forEach((item, index) => {
            const row = worksheet.addRow({
                SNo: index + 1, // Separate index for each category
                Category: category.name,
                Name: item.englishName,
                BuyingPrice: item.buyingPrice,
                Percentage: item.percentage, // Instead of price, use percentage
                Stocks: item.stocks,
            });

            // Lock the first three cells in the row (columns A, B, C)
            row.getCell('A').style.protection = { locked: true };
            row.getCell('B').style.protection = { locked: true };
            row.getCell('C').style.protection = { locked: true };
            row.getCell('D').style.protection = { locked: false }; // Allow editing of Buying Price
            row.getCell('E').style.protection = { locked: false }; // Allow editing of Percentage
            row.getCell('F').style.protection = { locked: false };
        });
    });

    // Protect the worksheet
    worksheet.protect('jasfruitsandvegetables', {
        selectLockedCells: false,  // Disallow selection of locked cells
        selectUnlockedCells: true,  // Allow selection of unlocked cells
    });

    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split('T')[0];

    // Set dynamic filename with the current date
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=items-${currentDate}.xlsx`);

    await workbook.xlsx.write(res).then(() => res.end()); // Ensure stream is closed
};


// const uploadPrice = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: 'No file uploaded' });
//         }

//         const workbook = new ExcelJS.Workbook();
//         await workbook.xlsx.load(req.file.buffer); // Load the uploaded Excel file buffer

//         const worksheet = workbook.getWorksheet('Prices');
//         if (!worksheet) {
//             return res.status(400).json({ message: 'Worksheet "Prices" not found in the file' });
//         }

//         let category = null;
//         let items = [];
        

//         worksheet.eachRow((row, rowNumber) => {
//             // Skip empty rows or rows with merged cells (headers or spaces)
//             if (rowNumber < 3 || row.getCell(1).value === null || row.getCell(1).value === '') {
//                 return; // Ignore blank rows, headers, or any irrelevant data
//             }

//             const firstCell = row.getCell(1).value;
//             if (typeof firstCell === 'string' && (firstCell === 'Vegetables' || firstCell === 'Fruits' || firstCell === 'Keerai')) {
//                 // New category detected
//                 category = firstCell;
//             } else {
//                 // Process item rows
//                 const item = {
//                     category: category,
//                     name: row.getCell(3).value, // English name is in the 3rd column
//                     buyingPrice: parseFloat(row.getCell(4).value) || 0, // Parse and default to 0
//                     percentage: parseFloat(row.getCell(5).value) || 0,
//                     stocks: row.getCell(6).value, // Stocks is in the 6th column
//                 };

//                 // Calculate the new price using the percentage
//                 item.price = parseFloat((item.buyingPrice + (item.buyingPrice * item.percentage / 100)).toFixed(2));

//                 items.push(item);
//             }
//         });

//         // Check if each item exists before updating
//         for (const itemData of items) {
//             const { name, buyingPrice, price, stocks, category,percentage } = itemData;

//             // Check if the product exists in the database
//             const existingItem = await Item.findOne({ englishName: name, category: category });
//             if (!existingItem) {
//                  res.status(404).json({ message: `Product "${name}" not found in the category "${category}".` });
//                  continue;
//             }

//             // Update the item if it exists
//             await Item.updateOne(
//                 { englishName: name, category: category },
//                 { $set: { buyingPrice, price,percentage, stocks } }
//             );
//         }

//         return res.status(200).json({ message: 'Prices updated successfully' });
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         return res.status(500).json({ message: 'Error Uploading File.Please try again!!' });
//     }
// };


// const uploadPrice = async (req, res) => {
//     try {

//         console.time("File Upload Processing Time"); // Start timing

//         if (!req.file) {
//             return res.status(400).json({ message: 'No file uploaded' });
//         }

//         const workbook = new ExcelJS.Workbook();
//         await workbook.xlsx.load(req.file.buffer);

//         const worksheet = workbook.getWorksheet('Prices');
//         if (!worksheet) {
//             return res.status(400).json({ message: 'Worksheet "Prices" not found in the file' });
//         }

//         let category = null;
//         let items = [];
//         let warnings = []; // Array to store warning messages

//         worksheet.eachRow((row, rowNumber) => {
//             if (rowNumber < 3 || row.getCell(1).value === null || row.getCell(1).value === '') {
//                 return;
//             }

//             const firstCell = row.getCell(1).value;
//             if (typeof firstCell === 'string' && (firstCell === 'Vegetables' || firstCell === 'Fruits' || firstCell === 'Keerai')) {
//                 category = firstCell;
//             } else {
//                 const item = {
//                     category: category,
//                     name: row.getCell(3).value,
//                     buyingPrice: parseFloat(row.getCell(4).value) || 0,
//                     percentage: parseFloat(row.getCell(5).value) || 0,
//                     stocks: row.getCell(6).value,
//                 };

//                 item.price = parseFloat((item.buyingPrice + (item.buyingPrice * item.percentage / 100)).toFixed(2));
//                 items.push(item);
//             }
//         });

//         // Log the number of items processed
//         console.log(`Processed ${items.length} items.`);

//         for (const itemData of items) {
//             const { name, buyingPrice, price, stocks, category, percentage } = itemData;

//             const existingItem = await Item.findOne({ englishName: name, category: category });
//             if (!existingItem) {
//                 warnings.push(`Product "${name}" in category "${category}" not found. Skipping.`);
//                 continue; // Skip this item and move to the next
//             }

//             await Item.updateOne(
//                 { englishName: name, category: category },
//                 { $set: { buyingPrice, price, percentage, stocks } }
//             );
//         }
//         console.timeEnd("File Upload Processing Time"); // End timing

//         return res.status(200).json({ 
//             message: 'Prices updated successfully', 
//             warnings: warnings.length > 0 ? warnings : undefined // Include warnings if any
//         });
//         // console.log("file upload response",uploadResponse.data.message)
//         // console.log("file upload response status code",uploadResponse.statusCode)
//         // return;
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         return res.status(500).json({ message: 'Error Uploading File. Please try again!' });
//     }
// };

// const uploadPrice = async (req, res) => {
//     try {
//         console.time("File Upload Processing Time"); // Start timing

//         if (!req.file) {
//             return res.status(400).json({ message: 'No file uploaded' });
//         }

//         const workbook = new ExcelJS.Workbook();
//         await workbook.xlsx.load(req.file.buffer);

//         const worksheet = workbook.getWorksheet('Prices');
//         if (!worksheet) {
//             return res.status(400).json({ message: 'Worksheet "Prices" not found in the file' });
//         }

//         let category = null;
//         let items = [];
//         let warnings = [];

//         worksheet.eachRow((row, rowNumber) => {
//             if (rowNumber < 3 || row.getCell(1).value === null || row.getCell(1).value === '') {
//                 return;
//             }

//             const firstCell = row.getCell(1).value;
//             if (typeof firstCell === 'string' && ['Vegetables', 'Fruits', 'Keerai'].includes(firstCell)) {
//                 category = firstCell;
//             } else {
//                 const item = {
//                     category: category,
//                     name: row.getCell(3).value,
//                     buyingPrice: parseFloat(row.getCell(4).value) || 0,
//                     percentage: parseFloat(row.getCell(5).value) || 0,
//                     stocks: row.getCell(6).value,
//                 };

//                 item.price = parseFloat((item.buyingPrice + (item.buyingPrice * item.percentage / 100)).toFixed(2));
//                 items.push(item);
//             }
//         });

//         console.log(`Processed ${items.length} items.`);

//         const bulkOperations = items.map((itemData) => {
//             const { name, buyingPrice, price, stocks, category, percentage } = itemData;

//             return {
//                 updateOne: {
//                     filter: { englishName: name, category: category },
//                     update: { $set: { buyingPrice, price, percentage, stocks } },
//                     upsert: false, // update only if the item exists
//                 },
//             };
//         });

//         // Execute bulk operations
//         const result = await Item.bulkWrite(bulkOperations);

//         console.log("Bulk write result:", result);
//         console.timeEnd("File Upload Processing Time"); // End timing

//         return res.status(200).json({ 
//             message: 'Prices updated successfully', 
//             warnings: warnings.length > 0 ? warnings : undefined,
//             processed: items.length,
//             matched: result.matchedCount,
//             modified: result.modifiedCount,
//         });
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         return res.status(500).json({ message: 'Error Uploading File. Please try again!' });
//     }
// };

const uploadPrice = async (req, res) => {
    try {
        console.time("File Upload Processing Time");

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(req.file.buffer);

        const worksheet = workbook.getWorksheet('Prices');
        if (!worksheet) {
            return res.status(400).json({ message: 'Worksheet "Prices" not found in the file' });
        }

        let category = null;
        let items = [];
        let warnings = [];

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber < 3 || row.getCell(1).value === null || row.getCell(1).value === '') {
                return;
            }

            const firstCell = row.getCell(1).value;
            if (typeof firstCell === 'string' && ['Vegetables', 'Fruits', 'Keerai'].includes(firstCell)) {
                category = firstCell;
            } else {
                const item = {
                    category: category,
                    name: row.getCell(3).value,
                    buyingPrice: parseFloat(row.getCell(4).value) || 0,
                    percentage: parseFloat(row.getCell(5).value) || 0,
                    stocks: row.getCell(6).value,
                };

                item.price = parseFloat((item.buyingPrice + (item.buyingPrice * item.percentage / 100)).toFixed(2));
                items.push(item);
            }
        });

        console.log(`Processed ${items.length} items.`);

        // Create a set of unique category-name pairs for database lookup
        const nameCategoryPairs = items.map(item => ({
            englishName: item.name,
            category: item.category
        }));

        // Fetch all matching items in one query
        const existingItems = await Item.find({ $or: nameCategoryPairs });
        const existingItemMap = new Map();

        // Populate the map with existing items for quick lookup
        existingItems.forEach(item => {
            existingItemMap.set(`${item.englishName}-${item.category}`, item)
        });

        const bulkOperations = [];
        items.forEach(itemData => {
            const { name, buyingPrice, price, stocks, category, percentage } = itemData;
            const itemKey = `${name}-${category}`;

            if (!existingItemMap.has(itemKey)) {
                warnings.push(`Product '${name}' in category '${category}' not found in the database.`);
                return; // Skip this item
            }

            bulkOperations.push({
                updateOne: {
                    filter: { englishName: name, category: category },
                    update: { $set: { buyingPrice, price, percentage, stocks } },
                    upsert: false,
                },
            });
        });

        // Execute bulk operations if there are any
        let result = { matchedCount: 0, modifiedCount: 0 };
        if (bulkOperations.length > 0) {
            result = await Item.bulkWrite(bulkOperations);
        }

        console.log("Bulk write result:", result);
        console.timeEnd("File Upload Processing Time");

        return res.status(200).json({ 
            message: 'Prices updated successfully', 
            warnings: warnings.length > 0 ? warnings : undefined,
            processed: items.length,
            matched: result.matchedCount,
            modified: result.modifiedCount,
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return res.status(500).json({ message: 'Error Uploading File. Please try again!' });
    }
};



module.exports = {downloadPrice, uploadPrice };