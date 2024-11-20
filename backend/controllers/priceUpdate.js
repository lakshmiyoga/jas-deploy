const express = require('express');
// const Item = require('../models/productModel');
const Item = require('../models/allProductModel');
const { Parser } = require('json2csv');
const csvtojson = require('csvtojson');
const Category = require('../models/CategoryModel');
const catchAsyncError = require('../middleware/catchAsyncError');
const ExcelJS = require('exceljs');







// const downloadPrice = async (req, res) => {
//     let items = await Item.find({}, { _id: 1, englishName: 1, category: 1, buyingPrice: 1, percentage: 1, stocks: 1 });

//     // Separate categories
//     const vegetables = items.filter(item => item.category === 'Vegetables').sort((a, b) => a.englishName.localeCompare(b.englishName));
//     const keerai = items.filter(item => item.category === 'Keerai').sort((a, b) => a.englishName.localeCompare(b.englishName));
//     const fruits = items.filter(item => item.category === 'Fruits').sort((a, b) => a.englishName.localeCompare(b.englishName));

//     const categories = [
//         { name: 'Vegetables', items: vegetables },
//         { name: 'Keerai', items: keerai },
//         { name: 'Fruits', items: fruits },

//     ];

//     // Create a new workbook and worksheet
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Prices');

//     // Define columns with "Percentage" instead of "Price"
//     worksheet.columns = [
//         { header: 'S.No', key: 'SNo', width: 10 },
//         { header: 'Category', key: 'Category', width: 20 },
//         { header: 'Name', key: 'Name', width: 30 },
//         { header: 'Buying Price', key: 'BuyingPrice', width: 20 },
//         { header: 'Percentage', key: 'Percentage', width: 20 },
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
//             const row = worksheet.addRow({
//                 SNo: index + 1, // Separate index for each category
//                 Category: category.name,
//                 Name: item.englishName,
//                 BuyingPrice: item.buyingPrice,
//                 Percentage: item.percentage, // Instead of price, use percentage
//                 Stocks: item.stocks,
//             });

//             // Lock the first three cells in the row (columns A, B, C)
//             row.getCell('A').style.protection = { locked: true };
//             row.getCell('B').style.protection = { locked: true };
//             row.getCell('C').style.protection = { locked: true };
//             row.getCell('D').style.protection = { locked: false }; // Allow editing of Buying Price
//             row.getCell('E').style.protection = { locked: false }; // Allow editing of Percentage
//             row.getCell('F').style.protection = { locked: false };
//         });
//     });

//     // Protect the worksheet
//     worksheet.protect('jasfruitsandvegetables', {
//         selectLockedCells: false,  // Disallow selection of locked cells
//         selectUnlockedCells: true,  // Allow selection of unlocked cells
//     });

//     // Get the current date in YYYY-MM-DD format
//     const currentDate = new Date().toISOString().split('T')[0];

//     // Set dynamic filename with the current date
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', `attachment; filename=items-${currentDate}.xlsx`);

//     await workbook.xlsx.write(res).then(() => res.end()); // Ensure stream is closed
// };
const downloadPrice = async (req, res) => {
    try {
        // Step 1: Get all categories from the database
        const categories = await Category.find({}).select('name category').lean(); // Get the name and category of each category

        // Step 2: Fetch items for each category
        const items = await Item.find({}, { _id: 1, englishName: 1, category: 1, buyingPrice: 1, percentage: 1, stocks: 1 }).lean();

        // Step 3: Dynamically separate items by category
        const categorizedItems = categories.map(category => {
            // Trim category name to remove leading/trailing spaces
            const trimmedCategoryName = category.category.trim();
            const filteredItems = items.filter(item => item.category.trim() === trimmedCategoryName).sort((a, b) => a.englishName.localeCompare(b.englishName));
            return { name: trimmedCategoryName, items: filteredItems };
        });

        // Step 4: Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Prices');

        // Define columns with "Percentage" instead of "Price"
        worksheet.columns = [
            { header: 'S.No', key: 'SNo', width: 10 },
            { header: 'Category', key: 'Category', width: 20 },
            { header: 'Name', key: 'Name', width: 30 },
            { header: 'Buying Price', key: 'BuyingPrice', width: 20 },
            { header: 'Percentage', key: 'Percentage', width: 20 },
            { header: 'Selling Price', key: 'SellingPrice', width: 20 },
            { header: 'Stocks', key: 'Stocks', width: 15 }
        ];

        // Step 5: Iterate through each category and add data to the worksheet
        categorizedItems.forEach(category => {
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
                // Trim item name and category to remove any extra spaces
                const trimmedName = item.englishName.trim();
                const trimmedCategory = category.name.trim();

                const row = worksheet.addRow({
                    SNo: index + 1, // Separate index for each category
                    Category: trimmedCategory,
                    Name: trimmedName,
                    BuyingPrice: item.buyingPrice,
                    Percentage: item.percentage, // Instead of price, use percentage
                    SellingPrice: 0,
                    Stocks: item.stocks,
                });

                // Add formula to calculate Selling Price dynamically
                const sellingPriceCell = row.getCell('F');
                sellingPriceCell.value = {
                    formula: `D${row.number}+(D${row.number}*E${row.number}/100)`,
                };

                // Lock the first three cells in the row (columns A, B, C)
                row.getCell('A').style.protection = { locked: true };
                row.getCell('B').style.protection = { locked: true };
                row.getCell('C').style.protection = { locked: true };
                row.getCell('D').style.protection = { locked: false }; // Allow editing of Buying Price
                row.getCell('E').style.protection = { locked: false }; // Allow editing of Percentage
                row.getCell('F').style.protection = { locked: true };
                row.getCell('G').style.protection = { locked: false };
            });
        });

        // Step 6: Protect the worksheet
        worksheet.protect('jasfruitsandvegetables', {
            selectLockedCells: false,  // Disallow selection of locked cells
            selectUnlockedCells: true,  // Allow selection of unlocked cells
        });

        // Step 7: Get the current date in YYYY-MM-DD format
        const currentDate = new Date().toISOString().split('T')[0];

        // Step 8: Set dynamic filename with the current date
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=items-${currentDate}.xlsx`);

        await workbook.xlsx.write(res).then(() => res.end()); // Ensure stream is closed

    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// const uploadPrice = async (req, res) => {
//     try {
//         console.time("File Upload Processing Time");

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

//         // Create a set of unique category-name pairs for database lookup
//         const nameCategoryPairs = items.map(item => ({
//             englishName: item.name,
//             category: item.category
//         }));

//         // Fetch all matching items in one query
//         const existingItems = await Item.find({ $or: nameCategoryPairs });
//         const existingItemMap = new Map();

//         // Populate the map with existing items for quick lookup
//         existingItems.forEach(item => {
//             existingItemMap.set(`${item.englishName}-${item.category}`, item)
//         });

//         const bulkOperations = [];
//         items.forEach(itemData => {
//             const { name, buyingPrice, price, stocks, category, percentage } = itemData;
//             const itemKey = `${name}-${category}`;

//             if (!existingItemMap.has(itemKey)) {
//                 warnings.push(`Product '${name}' in category '${category}' not found in the database.`);
//                 return; // Skip this item
//             }

//             bulkOperations.push({
//                 updateOne: {
//                     filter: { englishName: name, category: category },
//                     update: { $set: { buyingPrice, price, percentage, stocks } },
//                     upsert: false,
//                 },
//             });
//         });

//         // Execute bulk operations if there are any
//         let result = { matchedCount: 0, modifiedCount: 0 };
//         if (bulkOperations.length > 0) {
//             result = await Item.bulkWrite(bulkOperations);
//         }

//         console.log("Bulk write result:", result);
//         console.timeEnd("File Upload Processing Time");

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

        // Step 1: Fetch all categories from the database
        const categories = await Category.find({}).select('category').lean();
        const validCategories = categories.map(c => c.category.trim()); // Ensure category is trimmed
        console.log("validCategories", validCategories);
        let category = null;
        let items = [];
        let warnings = [];

        // Step 2: Process each row in the worksheet
        worksheet.eachRow((row, rowNumber) => {
            // Skip empty rows or rows with invalid category (column 1)
            if (rowNumber < 3 || row.getCell(1).value === null || row.getCell(1).value === '') {
                return;
            }

            // const firstCell = row.getCell(1).value.trim(); // Trim the category value
            const firstCellValue = row.getCell(1).value; // Get the value of the first cell
            const  firstCell= typeof firstCellValue === 'string' ? firstCellValue.trim() : firstCellValue; // Trim only if it's a string
            // Check if the category is valid dynamically
            if (typeof firstCell === 'string' && validCategories.includes(firstCell)) {
                category = firstCell;
            } else if (category) {
                // Otherwise, process as item belonging to the previous category
                const item = {
                    category: category,
                    name: row.getCell(3).value.trim(), // Trim the product name
                    buyingPrice: parseFloat(row.getCell(4).value) || 0,
                    percentage: parseFloat(row.getCell(5).value) || 0,
                    stocks: row.getCell(7).value,
                };

                // Calculate price based on buying price and percentage
                item.price = parseFloat((item.buyingPrice + (item.buyingPrice * item.percentage / 100)).toFixed(2));
                items.push(item);
            }
        });

        console.log(`Processed ${items.length} items.`);

        // Step 3: Create a set of unique category-name pairs for database lookup
        const nameCategoryPairs = items.map(item => ({
            englishName: item.name,
            category: item.category
        }));

        // Fetch all matching items in one query
        const existingItems = await Item.find({ $or: nameCategoryPairs });
        const existingItemMap = new Map();

        // Populate the map with existing items for quick lookup
        existingItems.forEach(item => {
            existingItemMap.set(`${item.englishName}-${item.category}`, item);
        });

        const bulkOperations = [];
        items.forEach(itemData => {
            const { name, buyingPrice, price, stocks, category, percentage } = itemData;
            const itemKey = `${name}-${category}`;

            if (!existingItemMap.has(itemKey)) {
                warnings.push(`Product '${name}' in category '${category}' not found in the database.`);
                console.log(`Product '${name}' in category '${category}' not found in the database.`);
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





module.exports = { downloadPrice, uploadPrice };