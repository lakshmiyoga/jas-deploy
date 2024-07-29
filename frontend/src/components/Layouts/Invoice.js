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
        const tableColumnSpacing = 20;
        const tableRowHeight = 10;

        // Adding title and header
        doc.setFontSize(12);
        doc.text("Tax Invoice", margin, 10);
        doc.setFontSize(10);
        doc.text("ORIGINAL For Recipient", margin, 15);

        // Adding invoice details
        doc.setFontSize(10);
        doc.text(`Legal Entity Name: CAFE AMIN`, margin, 25);
        doc.text(`Restaurant Name: Cafe Amin`, margin, 30);
        doc.text(`Restaurant Address: ${pickup_details.address.street_address1}, ${pickup_details.address.street_address2}, ${pickup_details.address.city}, ${pickup_details.address.state}, ${pickup_details.address.pincode}`, margin, 35);
        doc.text(`Restaurant GSTIN: 33AALFC2148J1ZI`, margin, 40);
        doc.text(`Restaurant FSSAI: 12416002002521`, margin, 45);
        doc.text(`Invoice No.: ${order_id}`, margin, 50);
        doc.text(`Invoice Date: ${new Date(createdAt).toLocaleString()}`, margin, 55);

        // Adding customer details
        doc.text(`Customer Name: ${userName}`, margin, 65);
        doc.text(`Delivery Address: ${drop_details.address.street_address1}, ${drop_details.address.street_address2}, ${drop_details.address.city}, ${drop_details.address.state}, ${drop_details.address.pincode}`, margin, 70);
        // doc.text(`State name & Place of Supply: ${drop_details.address.state}`, margin, 75);

        // Adding table headers
        const tableStartY = 85;
        const tableStartX = margin;
        const tableEndX = pageWidth - margin;
        const columns = [
            { title: "Particulars", width: 30 },
            { title: "Gross value", width: 20 },
            { title: "Discount", width: 20 },
            { title: "Net value", width: 20 },
            { title: "CGST (Rate)", width: 20 },
            { title: "CGST (INR)", width: 20 },
            { title: "SGST (Rate)", width: 20 },
            { title: "SGST (INR)", width: 20 },
            { title: "Total", width: 20 },
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
            doc.text(`${item.name}`, currentX + 2, y + 7);
            currentX += columns[0].width;
            doc.text(`${item.price.toFixed(2)}`, currentX + 2, y + 7);
            currentX += columns[1].width;
            doc.text(`0`, currentX + 2, y + 7);
            currentX += columns[2].width;
            doc.text(`${item.price.toFixed(2)}`, currentX + 2, y + 7);
            currentX += columns[3].width;
            doc.text(`2.5%`, currentX + 2, y + 7);
            currentX += columns[4].width;
            doc.text(`${(item.price * 0.025).toFixed(2)}`, currentX + 2, y + 7);
            currentX += columns[5].width;
            doc.text(`2.5%`, currentX + 2, y + 7);
            currentX += columns[6].width;
            doc.text(`${(item.price * 0.025).toFixed(2)}`, currentX + 2, y + 7);
            currentX += columns[7].width;
            doc.text(`${(item.price + (item.price * 0.05)).toFixed(2)}`, currentX + 2, y + 7);
        });

        // Adding total
        const totalY = tableStartY + tableRowHeight + (updatedItems.length * tableRowHeight);
        const totalGross = updatedItems.reduce((acc, item) => acc + item.price, 0);
        const totalCGST = totalGross * 0.025;
        const totalSGST = totalGross * 0.025;
        const total = totalGross + totalCGST + totalSGST;

        currentX = tableStartX;
        doc.rect(tableStartX, totalY, tableEndX - tableStartX, tableRowHeight);
        doc.text(`Total Value`, currentX + 2, totalY + 7);
        currentX += columns[0].width;
        doc.text(`${totalGross.toFixed(2)}`, currentX + 2, totalY + 7);
        currentX += columns[1].width;
        doc.text(`0`, currentX + 2, totalY + 7);
        currentX += columns[2].width;
        doc.text(`${totalGross.toFixed(2)}`, currentX + 2, totalY + 7);
        currentX += columns[3].width;
        doc.text(`2.5%`, currentX + 2, totalY + 7);
        currentX += columns[4].width;
        doc.text(`${totalCGST.toFixed(2)}`, currentX + 2, totalY + 7);
        currentX += columns[5].width;
        doc.text(`2.5%`, currentX + 2, totalY + 7);
        currentX += columns[6].width;
        doc.text(`${totalSGST.toFixed(2)}`, currentX + 2, totalY + 7);
        currentX += columns[7].width;
        doc.text(`${total.toFixed(2)}`, currentX + 2, totalY + 7);

        // Adding amount in words
        doc.text(`Amount (in words): ${convertNumberToWords(total.toFixed(2))} Only`, margin, totalY + 15);

        // Adding digital payment information
        doc.text(`Amount of INR ${total.toFixed(2)} settled through digital mode/payment received against Order ID: ${order_id} dated ${new Date(createdAt).toLocaleDateString()}.`, margin, totalY + 25);
        doc.text(`Supply attracts reverse charge: No`, margin, totalY + 30);

        // Adding authorized signatory
        doc.text(`For ZOMATO LIMITED`, margin, totalY + 40);
        doc.text(`Zomato PAN: AADCD4946L`, margin, totalY + 45);
        doc.text(`Zomato CIN: L93030DL2010PLC198141`, margin, totalY + 50);
        doc.text(`Zomato GST: 33AADCD4946L1ZH`, margin, totalY + 55);
        doc.text(`Zomato FSSAI: 10019064001810`, margin, totalY + 60);
        doc.text(`Authorised Signatory`, margin, totalY + 65);

        // Save the PDF
        doc.save(`Invoice_${order_id}.pdf`);
    };

    return (
        <div>
            <h4 className="my-4">Invoice</h4>
            <div className="form-group">
                <button className="btn btn-primary btn-block" onClick={handleDownloadInvoice}>Download Invoice</button>
            </div>
        </div>
    );
};

// Utility function to convert numbers to words
const convertNumberToWords = (amount) => {
    const words = [
        '', 'Zero','One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty',
        'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];
    if (amount === 0) return 'Zero';
    if (amount < 0) return 'Minus ' + convertNumberToWords(Math.abs(amount));
    
    let wordsString = '';
    const atemp = amount.split(".");
    const number = atemp[0].split(",").join("");
    const n_length = number.length;
    let wordsStr = '';
    let num = Number(amount);
    let points = atemp[1];
    let integerPart = parseInt(num.toString().split('.')[0], 10);

    for (let i = 0; i < n_length; i++) {
        let digit = parseInt(number[i], 10);
        if (n_length === 1 || digit === 0 && n_length > 1) {
            wordsStr += '';
        } else {
            wordsStr += (words[digit] ? words[digit] + ' ' : '');
        }
    }
    if (points && points.length > 0) {
        points = points.split('');
        if (points.length == 1) {
            points[1] = '0';
        }
    }
    return wordsStr + (points ? `Point ${points < 21 ? words[points] : words[parseInt(points / 10)] + ' ' + words[points % 10]}` : '');
};

export default Invoice;
