
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require('../utils/errorHandler');
const crypto = require("crypto");
const fs = require('fs');
const path = require('path');
const { Juspay, APIError } = require('expresscheckout-nodejs');
const config = require('../config/config.json');
const Order = require('../models/order');
const Payment = require('../models/paymentModel');
const responseModel = require('../models/responseModel');
const CryptoJS = require('crypto-js');
const validator = require("validator");



const SANDBOX_BASE_URL = "https://smartgatewayuat.hdfcbank.com"
const PRODUCTION_BASE_URL = "https://smartgateway.hdfcbank.com";

// Read config.json file


// Ensure the paths are read correctly
const publicKey = fs.readFileSync(path.resolve(config.PUBLIC_KEY_PATH));
const privateKey = fs.readFileSync(path.resolve(config.PRIVATE_KEY_PATH));
const paymentPageClientId = config.PAYMENT_PAGE_CLIENT_ID; // used in orderSession request

const juspay = new Juspay({
	merchantId: config.MERCHANT_ID,
	baseUrl: SANDBOX_BASE_URL, // Using sandbox base URL for testing
	jweAuth: {
		keyId: config.KEY_UUID,
		publicKey,
		privateKey
	}
});

// Create orders

const encryptionKey = process.env.ENCRYPTION_KEY;

const encryptData = (data) => {
    return CryptoJS.AES.encrypt(data.toString(), encryptionKey).toString();
};

const decryptData = (encryptedData,key) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    return  bytes.toString(CryptoJS.enc.Utf8);
};

const verifySignature = (data,signature,decryptedKey) => {
    const expectedSignature = CryptoJS.HmacSHA256(data, decryptedKey).toString();
    return expectedSignature === signature;
};

const payment = catchAsyncError(async (req, res, next) => {
    const {
        user,
        shippingInfo,
        cartItems,
        user_id,
        itemsPrice: encryptedItemsPrice,
        taxPrice,
        shippingPrice: encryptedShippingPrice,
        totalPrice: encryptedTotalPrice,
		signature,
		plainText,
    } = req.body;
	const decryptedKey = decryptData(plainText, encryptionKey);
	if (!decryptedKey) {
		return next(new ErrorHandler('Failed to decrypt the key', 400));
	}
    // Decrypt prices
    const itemsPrice = decryptData(encryptedItemsPrice,decryptedKey);
    const shippingPrice = decryptData(encryptedShippingPrice,decryptedKey);
    const totalPrice = decryptData(encryptedTotalPrice,decryptedKey);


    const orderId = `order_${Date.now()}`;
    const amount = parseFloat(totalPrice).toFixed(2);

    // Validate total price
    const calculatedTotalPrice = (parseFloat(itemsPrice) + parseFloat(shippingPrice)).toFixed(2);
    if (calculatedTotalPrice !== amount) {
        return next(new ErrorHandler('Price validation failed', 400));
		
    }
	const isSignatureValid = verifySignature(`${itemsPrice}${shippingPrice}${totalPrice}`,signature,decryptedKey);
    
    if (!isSignatureValid) {
        return next(new ErrorHandler('Invalid signature, possible data tampering detected', 400));
    }
	 // Encrypt orderId
	 const encryptedOrderId = encryptData(orderId,encryptionKey);

    // Create return URL
    let BASE_URL = process.env.BACKEND_URL;
    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`;
    }


    const returnUrl = `${BASE_URL}/api/v1/paymentsuccess/${encodeURIComponent(encryptedOrderId)}`; // Adjust this URL as needed

    try {
		const isOrderExist = await Payment.findOne({ order_id: orderId });
		if(isOrderExist){
			return next(new ErrorHandler('Your order is already exist Please Try Again!', 400));
		}
		else{
			const payment = new Payment({
				order_id: orderId,
				user_id: user_id,
				user,
				orderItems: cartItems,
				shippingInfo,
				itemsPrice,
				taxPrice,
				shippingPrice,
				totalPrice: amount,
				paymentStatus: 'initiated',
			});
	
			await payment.save();
	
			const createdOrder = await Payment.findOne({ order_id: orderId });
			if (createdOrder) {
				const sessionResponse = await juspay.orderSession.create({
					order_id: orderId,
					amount: amount,
					payment_page_client_id: paymentPageClientId,
					customer_id: user._id,
					customer_email: user.email,
					customer_phone: shippingInfo.phoneNo,
					action: 'paymentPage',
					shipping_info: shippingInfo,
					cart_Items: cartItems,
					user: user,
					return_url: returnUrl,
					currency: 'INR',
					payment_filter: {
						allowDefaultOptions: false,
						options: [
							{ paymentMethodType: "NB", enable: true },
							{ paymentMethodType: "UPI", enable: true },
							{ paymentMethodType: "CARD", enable: true },
							{ paymentMethodType: "WALLET", enable: true }
						]
					},
					options: {
						create_mandate: "OPTIONAL",
						mandate: {
							max_amount: "40000.00",
							start_date: "1699368604",
							end_date: "1763971322",
							frequency: "MONTHLY"
						},
						metadata: {
							expiryInMins: "15",
							"JUSPAY:gatewayReferenceId": "payu_test"
						},
						source_object: "PAYMENT_LINK",
						udf1: "udf1-dummy",
						udf2: "udf2-dummy",
						udf3: "udf3-dummy",
						udf4: "udf4-dummy",
						udf6: "udf6-dummy",
						udf5: "udf5-dummy",
						udf7: "udf7-dummy",
						udf8: "udf8-dummy",
						udf9: "udf9-dummy",
						udf10: "udf10-dummy",
						send_mail: true,
						send_sms: true
					}
				});
				return res.status(200).json({ sessionResponse });
			} else {
				return next(new ErrorHandler('Order not Created', 400));
			}
		}
        
    } catch (error) {
        return res.redirect(`${BASE_URL}/order/confirm?message=${encodeURIComponent('Something went wrong')}`);
    }
});


const handleResponse = catchAsyncError(async (req, res,next) => {
	const encryptedOrderId = req.params.id || req.params.orderId || req.params.order_id;


    let BASE_URL = process.env.FRONTEND_URL;
	if (process.env.NODE_ENV === "production") {
		BASE_URL = `${req.protocol}://${req.get('host')}`
	}

    if (!encryptedOrderId) {
        return res.redirect(`${BASE_URL}/order/confirm?message=${encodeURIComponent('Something went wrong in orderid')}`);
    }

    // Decrypt orderId
    const orderId = decryptData(encryptedOrderId,encryptionKey);
	if (!orderId) {
		return res.redirect(`${BASE_URL}/order/confirm?message=${encodeURIComponent('Something went wrong')}`);
	}

	try {
		const statusResponse = await Payment.findOne({order_id: orderId});
		const sessionResponse = statusResponse.statusResponse;
		return res.status(200).json({ sessionResponse })
		
		
			} catch (error) {
		
		return res.redirect(`${BASE_URL}/order/confirm?message=${encodeURIComponent('Something went wrong')}`);
	}
});



const paymentSuccess = catchAsyncError(async (req, res,next) => {

	const encryptedOrderId = req.params.orderId;
    let BASE_URL = process.env.FRONTEND_URL;
	if (process.env.NODE_ENV === "production") {
		BASE_URL = `${req.protocol}://${req.get('host')}`
	}

    if (!encryptedOrderId) {
        return res.redirect(`${BASE_URL}/order/confirm?message=${encodeURIComponent('Something went wrong in orderid')}`);
    }

    // Decrypt orderId
    const orderId = decryptData(encryptedOrderId,encryptionKey);
	if (!orderId) {
		
		return res.redirect(`${BASE_URL}/order/confirm?message=${encodeURIComponent('Something went wrong in orderid')}`);
	}
	
	try {
		const statusResponse = await juspay.order.status(orderId);
		
		if (statusResponse) {
			const response = new responseModel({ statusResponse });
		
			await response.save();
			
			const onepayments = await Payment.findOne({ order_id: orderId });
			if (onepayments) {
				const paymentstatus = await Payment.findOneAndUpdate({ order_id: orderId },
					{
						paymentStatus: statusResponse.status,
						$set: { statusResponse: statusResponse }
					 },
					{ new: true });
					if(paymentstatus){
					
						return res.redirect(`${BASE_URL}/payment/confirm/${encodeURIComponent(encryptedOrderId)}`);
						
					}
					else{
						return	res.redirect(`${BASE_URL}/order/confirm?message=${encodeURIComponent('The data is not stored in db')}`);
					}
			}
			else {
				
			 return	res.redirect(`${BASE_URL}/order/confirm?message=${encodeURIComponent('Something went wrong in update')}`);
				
			}
			

			
		}
	}
	catch (error) {
		
		return res.redirect(`${BASE_URL}/order/confirm?message=${encodeURIComponent('Something went wrong in payment success')}`);
		
	}
	
});





module.exports = { payment, paymentSuccess, handleResponse };