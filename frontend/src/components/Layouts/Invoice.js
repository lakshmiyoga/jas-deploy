import React from 'react';
import { jsPDF } from 'jspdf';

const Invoice = ({ porterOrderData }) => {
    console.log("porterOrderData", porterOrderData);

    // Extract important data from the response
    const { order_id, createdAt, porterData, updatedItems, user } = porterOrderData;
    const { pickup_details, drop_details } = porterData;
    const { name: userName, email: userEmail } = user;

    const handleDownloadInvoice = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 14;
        const tableRowHeight = 10;

        // Adding title and header
        doc.setFontSize(12);
        doc.text("Invoice", margin, 10);
        doc.setFontSize(10);
        doc.text("ORIGINAL For Recipient", margin, 15);

        // Supplier and Customer details in the same row
        doc.setFontSize(10);
        doc.text(`Legal Entity Name: Jas Fruits and Vegetables`, margin, 25);
        const customerX = pageWidth / 2;
        doc.text(`Customer Name: ${userName}`, customerX, 25);

        doc.text(`Supplier Name: Jas Fruits and Vegetables`, margin, 30);
        doc.text(`Delivery Address: ${drop_details.address.street_address1},
                             ${drop_details.address.street_address2},
                             ${drop_details.address.city}, 
                             ${drop_details.address.state},
                             ${drop_details.address.pincode}`, customerX, 35);

        doc.text(`Supplier Address: ${pickup_details.address.street_address1},
                                  ${pickup_details.address.street_address2},
                                  ${pickup_details.address.city},
                                  ${pickup_details.address.state}, 
                                  ${pickup_details.address.pincode}`, margin, 35);
        // doc.text(`Restaurant GSTIN: 33AALFC2148J1ZI`, margin, 40);
        // doc.text(`Restaurant FSSAI: 12416002002521`, margin, 45);
        doc.text(`Invoice No.: ${order_id}`, margin, 75);
        doc.text(`Invoice Date: ${new Date(createdAt).toLocaleDateString('en-GB')}`, margin, 80);


        // Adding table headers
        const tableStartY = 85;
        const tableStartX = margin;
        const tableEndX = pageWidth - margin;
        const columns = [
            { title: "S.NO", width: 20 },
            { title: "Items", width: 60 },
            { title: "Gross value", width: 40 },
            { title: "Discount", width: 40 },
            { title: "Total", width: 40 },
        ];

        // Draw table headers
        let currentX = tableStartX;
        doc.rect(tableStartX, tableStartY, tableEndX - tableStartX, tableRowHeight);
        columns.forEach(column => {
            doc.text(column.title, currentX + 2, tableStartY + 7);
            currentX += column.width;
        });

        // Adding items
        updatedItems.forEach((item, index) => {
            const y = tableStartY + tableRowHeight + (index * tableRowHeight);
            currentX = tableStartX;
            doc.rect(tableStartX, y, tableEndX - tableStartX, tableRowHeight);
            doc.text(`${index + 1}`, currentX + 2, y + 7);
            currentX += columns[0].width;
            doc.text(`${item.name}`, currentX + 2, y + 7);
            currentX += columns[1].width;
            const grossValue = item.price;
            const discount = 0; // Assuming no discount
            const total = grossValue - discount;
            doc.text(`${grossValue.toFixed(2)}`, currentX + 2, y + 7);
            currentX += columns[2].width;
            doc.text(`${discount.toFixed(2)}`, currentX + 2, y + 7);
            currentX += columns[3].width;
            doc.text(`${total.toFixed(2)}`, currentX + 2, y + 7);
        });

        // Adding total
        const totalY = tableStartY + tableRowHeight + (updatedItems.length * tableRowHeight);
        const totalGross = updatedItems.reduce((acc, item) => acc + item.price, 0);
        const totalDiscount = 0; // Assuming no discount
        const finalTotal = totalGross - totalDiscount;

        currentX = tableStartX;
        doc.rect(tableStartX, totalY, tableEndX - tableStartX, tableRowHeight);
        doc.text(`Total Value`, currentX + 2, totalY + 7);
        currentX += columns[0].width;
        currentX += columns[1].width;
        doc.text(`${totalGross.toFixed(2)}`, currentX + 2, totalY + 7);
        currentX += columns[2].width;
        doc.text(`${totalDiscount.toFixed(2)}`, currentX + 2, totalY + 7);
        currentX += columns[3].width;
        doc.text(`${finalTotal.toFixed(2)}`, currentX + 2, totalY + 7);

        // Adding amount in words
        // doc.text(`Amount (in words): ${convertNumberToWords(finalTotal.toFixed(2))} Only`, margin, totalY + 15);

        // Adding digital payment information
        doc.text(`Amount of INR ${finalTotal.toFixed(2)} settled through digital mode/payment received against Order ID: ${order_id} dated 
${new Date(createdAt).toLocaleDateString('en-GB')}.`, margin, totalY + 25);

        // Save the PDF
        doc.save(`Invoice_${order_id}.pdf`);
    };

    return (
        <div>
            <h4 className="my-4">Invoice</h4>
            <div className="form-group">
                <button className="btn btn-primary" onClick={handleDownloadInvoice}>Download Invoice</button>
            </div>
        </div>
    );
};

// Utility function to convert numbers to words
// const convertNumberToWords = (amount) => {
//     const words = [
//         '', 'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
//         'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty',
//         'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
//     ];
//     if (amount === 0) return 'Zero';
//     if (amount < 0) return 'Minus ' + convertNumberToWords(Math.abs(amount));

//     let wordsString = '';
//     const atemp = amount.split(".");
//     const number = atemp[0].split(",").join("");
//     const n_length = number.length;
//     let wordsStr = '';
//     let num = Number(amount);
//     let points = atemp[1];
//     let integerPart = parseInt(num.toString().split('.')[0], 10);

//     for (let i = 0; i < n_length; i++) {
//         let digit = parseInt(number[i], 10);
//         if (n_length === 1 || digit === 0 && n_length > 1) {
//             wordsStr += '';
//         } else {
//             wordsStr += (words[digit] ? words[digit] + ' ' : '');
//         }
//     }
//     if (points && points.length > 0) {
//         points = points.split('');
//         if (points.length == 1) {
//             points[1] = '0';
//         }
//     }
//     return wordsStr + (points ? `Point ${points < 21 ? words[points] : words[parseInt(points / 10)] + ' ' + words[points % 10]}` : '');
// };

export default Invoice;
