
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

const encryptionKey = 'Jas@12345#';

const encryptData = (data) => {
    return CryptoJS.AES.encrypt(data.toString(), encryptionKey).toString();
};

const decryptData = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
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
    } = req.body;

	console.log("req.body",req.body)

    // Decrypt prices
    const itemsPrice = decryptData(encryptedItemsPrice);
    const shippingPrice = decryptData(encryptedShippingPrice);
    const totalPrice = decryptData(encryptedTotalPrice);

	console.log("decrypy data",itemsPrice,shippingPrice,totalPrice)

    const orderId = `order_${Date.now()}`;
    const amount = parseFloat(totalPrice).toFixed(2);

    // Validate total price
    const calculatedTotalPrice = (parseFloat(itemsPrice) + parseFloat(shippingPrice)).toFixed(2);
    if (calculatedTotalPrice !== amount) {
		console.log("calculatedTotalPrice",calculatedTotalPrice,amount)
        return next(new ErrorHandler('Price validation failed', 400));
		
    }
	console.log("calculatedTotalPrice",calculatedTotalPrice,amount)

	 // Encrypt orderId
	 const encryptedOrderId = encryptData(orderId);

    // Create return URL
    let BASE_URL = process.env.BACKEND_URL;
    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`;
    }


	// const returnUrl = `${BASE_URL}/api/v1/paymentsuccess/${orderId}`;
    const returnUrl = `${BASE_URL}/api/v1/paymentsuccess/${encodeURIComponent(encryptedOrderId)}`; // Adjust this URL as needed

    try {
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
    } catch (error) {
        return res.redirect(`${BASE_URL}/order/confirm?message=${encodeURIComponent('Something went wrong')}`);
    }
});

// const payment = catchAsyncError(async (req, res,next) => {

// 	const { 
// 		user,
// 		shippingInfo,
// 		cartItems,
// 		user_id,
// 		itemsPrice,
// 		taxPrice,
// 		shippingPrice,
// 		totalPrice } = req.body;

// 	// console.log(req.body);

// 	const orderId = `order_${Date.now()}`;
// 	const amount = parseFloat(totalPrice).toFixed(2);
// 	// console.log(amount)



// 	// Create return URL
// 	let BASE_URL = process.env.BACKEND_URL;
// 	if (process.env.NODE_ENV === "production") {
// 		BASE_URL = `${req.protocol}://${req.get('host')}`
// 	}

// 	const returnUrl = `${BASE_URL}/api/v1/paymentsuccess/${orderId}`; // Adjust this URL as needed

// 	try {
// 		const payment = new Payment({
// 			order_id: orderId,
// 			user_id: user_id,
// 			user,
// 			orderItems: cartItems,
// 			shippingInfo,
// 			itemsPrice,
// 			taxPrice,
// 			shippingPrice,
// 			totalPrice:amount,
// 			paymentStatus: 'initiated',
// 			// statusResponse: {},
// 		});

// 		await payment.save();

// 		const createdOrder = await Payment.findOne({ order_id: orderId });
// 		if (createdOrder) {
// 			const sessionResponse = await juspay.orderSession.create({
// 				order_id: orderId,
// 				amount: amount,
// 				payment_page_client_id: paymentPageClientId,
// 				customer_id: user._id,
// 				customer_email: user.email,
// 				customer_phone: shippingInfo.phoneNo,
// 				action: 'paymentPage',
// 				shipping_info: shippingInfo,
// 				cart_Items: cartItems,
// 				user: user,
// 				return_url: returnUrl,
// 				currency: 'INR',
// 				payment_filter: {
// 					allowDefaultOptions: false,
// 					options: [
// 						{
// 							paymentMethodType: "NB",
// 							enable: true
// 						},
// 						{
// 							paymentMethodType: "UPI",
// 							enable: true
// 						},
// 						{
// 							paymentMethodType: "CARD",
// 							enable: true
// 						},
// 						{
// 							paymentMethodType: "WALLET",
// 							enable: true
// 						}
// 					]
// 				},
// 				options: {
// 					create_mandate: "OPTIONAL",
// 					mandate: {
// 						max_amount: "40000.00",
// 						start_date: "1699368604",
// 						end_date: "1763971322",
// 						frequency: "MONTHLY"
// 					},
// 					metadata: {
// 						expiryInMins: "15",
// 						"JUSPAY:gatewayReferenceId": "payu_test"
// 					},
// 					source_object: "PAYMENT_LINK",
// 					udf1: "udf1-dummy",
// 					udf2: "udf2-dummy",
// 					udf3: "udf3-dummy",
// 					udf4: "udf4-dummy",
// 					udf6: "udf6-dummy",
// 					udf5: "udf5-dummy",
// 					udf7: "udf7-dummy",
// 					udf8: "udf8-dummy",
// 					udf9: "udf9-dummy",
// 					udf10: "udf10-dummy",
// 					send_mail: true,
// 					send_sms: true
// 				}
// 			});
// 			return res.status(200).json({ sessionResponse })
// 		}
// 		else {
// 			// return res.json(makeError('order not Created'))
// 			return next(new ErrorHandler('order not Created', 400));
// 		}
// 		// res.status(200).json({ payment });
// 		// return res.json(makeJuspayResponse(sessionResponse));
// 		//  res.status(200).json({ sessionResponse })



// 		// return res.status(200).json({ message: 'Payment processed successfully', responceData: response.data ,sessionResponse });
// 	} catch (error) {
// 		// if (error instanceof APIError) {
// 		// 	return res.json(makeError(error.message));
// 		// }
// 		// return res.json(makeError());
// 		// return next(new ErrorHandler('Something went wrong', 400));
// 		return res.redirect(`${BASE_URL}/order/confirm?message=${encodeURIComponent('Something went wrong')}`);
// 		// return res.status(500).json({ message: 'Something went wrong' });
// 		// return next(new ErrorHandler('Something went wrong', 400));
// 	}
// });

const handleResponse = catchAsyncError(async (req, res,next) => {
	console.log(req.params)
	const encryptedOrderId = req.params.id || req.params.orderId || req.params.order_id;

	console.log("handleResponseencryptedOrderId",encryptedOrderId)

    let BASE_URL = process.env.FRONTEND_URL;
	if (process.env.NODE_ENV === "production") {
		BASE_URL = `${req.protocol}://${req.get('host')}`
	}

    if (!encryptedOrderId) {
        return res.redirect(`${BASE_URL}/order/confirm?message=${encodeURIComponent('Something went wrong in orderid')}`);
    }

    // Decrypt orderId
    const orderId = decryptData(encryptedOrderId);

	// console.log("decryptorderId",orderId)
	// const orderId = req.params.id || req.params.orderId || req.params.order_id;
	// console.log("orderId",orderId)
	// let BASE_URL = process.env.BACKEND_URL;
    // if (process.env.NODE_ENV === "production") {
    //     BASE_URL = `${req.protocol}://${req.get('host')}`;
    // }
	if (!orderId) {
		// return res.json(makeError('order_id not present or cannot be empty'));
		return res.redirect(`${BASE_URL}/order/confirm?message=${encodeURIComponent('Something went wrong')}`);
		// return next(new ErrorHandler('order_id not present or cannot be empty', 400));
	}

	try {
		const statusResponse = await Payment.findOne({order_id: orderId});
		const sessionResponse = statusResponse.statusResponse;
		// console.log("sessionResponse",sessionResponse)
		return res.status(200).json({ sessionResponse })
		// return res.redirect(`${BASE_URL}/order/confirm?message=${encodeURIComponent('Something went wrong')}`);
		// return res.status(200).json({ sessionResponse })
		
		const orderStatus = statusResponse.status;
		let message = '';

		switch (orderStatus) {
			case "CHARGED":
				message = "order payment done successfully";
				break;
			case "PENDING":
			case "PENDING_VBV":
				message = "order payment pending";
				break;
			case "AUTHORIZATION_FAILED":
				message = "order payment authorization failed";
				break;
			case "AUTHENTICATION_FAILED":
				message = "order payment authentication failed";
				break;
			default:
				message = "order status " + orderStatus;
				break;
		}

		return res.send(makeJuspayResponse(statusResponse));
	} catch (error) {
		// if (error instanceof APIError) {
		// 	return res.json(makeError(error.message));
		// }
		// return res.json(makeError());
		return res.redirect(`${BASE_URL}/order/confirm?message=${encodeURIComponent('Something went wrong')}`);
		// return next(new ErrorHandler('Something wrong in handelresponse', 400));
	}
});



// function makeError(message) {
// 	return {
// 		message: message || 'Something went wrong'
// 	};
// }

// function makeJuspayResponse(successRspFromJuspay) {
// 	if (!successRspFromJuspay) return successRspFromJuspay;
// 	if (successRspFromJuspay.http) delete successRspFromJuspay.http;
// 	return successRspFromJuspay;
// }


// In your backend (e.g., Express.js)
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
    const orderId = decryptData(encryptedOrderId);


	// const orderId = req.params.id || req.params.orderId || req.params.order_id;
	// let BASE_URL = process.env.FRONTEND_URL;
	// if (process.env.NODE_ENV === "production") {
	// 	BASE_URL = `${req.protocol}://${req.get('host')}`
	// }
	if (!orderId) {
		
		// return res.json(makeError('order_id not present or cannot be empty'));
		return res.redirect(`${BASE_URL}/order/confirm?message=${encodeURIComponent('Something went wrong in orderid')}`);
		// return next(new ErrorHandler('order_id not present or cannot be empty', 400));
	}
	
	try {
		const statusResponse = await juspay.order.status(orderId);
		// console.log(statusResponse)
		if (statusResponse) {
			const response = new responseModel({ statusResponse });
			// console.log(response)
			await response.save();
			// return res.status(200).json({response})
			// Update order status to 'paid'
			const onepayments = await Payment.findOne({ order_id: orderId });
			if (onepayments) {
				const paymentstatus = await Payment.findOneAndUpdate({ order_id: orderId },
					{
						paymentStatus: statusResponse.status,
						$set: { statusResponse: statusResponse }
					 },
					{ new: true });
					if(paymentstatus){
						console.log("paymentstatus",paymentstatus)
						// const encryptedOrderId = encryptData(orderId);

						console.log("paymentSuccessencryptedOrderId",encryptedOrderId)
						return res.redirect(`${BASE_URL}/payment/confirm/${encodeURIComponent(encryptedOrderId)}`);
						// return res.redirect(`${BASE_URL}/payment/confirm/${orderId}`);
					}
					else{
						return	res.redirect(`${BASE_URL}/order/confirm?message=${encodeURIComponent('The data is not stored in db')}`);
					}
			}
			else {
				// return res.json(makeError('order_id not present or cannot be empty'));
			 return	res.redirect(`${BASE_URL}/order/confirm?message=${encodeURIComponent('Something went wrong in update')}`);
				// return next(new ErrorHandler('order_id not present or cannot be empty', 400));
			}
			// const oneorders = await Order.findOne({ order_id: orderId });
			// if(oneorders){
			// 	const orderstatus = await Order.findOneAndUpdate({ order_id: orderId }, { paymentStatus: statusResponse.status },
			// 		{ new: true });
			// }
			// else{
			// 	return res.json(makeError('order_id not present or cannot be empty'));
			// }
			// const encryptedOrderId = encryptData(orderId);

			// return res.redirect(`${BASE_URL}/payment/confirm/${encryptedOrderId}`);
			// return res.status(200).json({ orderstatus });
		} else {
			// Handle payment failure
			// res.redirect(`${BASE_URL}/payment/failed`);
			return res.redirect(`${BASE_URL}/order/confirm?message=${encodeURIComponent('Something went wrong in get id')}`);
			// return next(new ErrorHandler('order_id not present or cannot be empty', 400));
		}
	}
	catch (error) {
		// if (error instanceof APIError) {
		// 	return res.json(makeError(error.message));
		// }
		// return res.json(makeError());
		return res.redirect(`${BASE_URL}/order/confirm?message=${encodeURIComponent('Something went wrong in payment success')}`);
		// return next(new ErrorHandler('Something went wrong', 400));
	}
	// Verify the payment status and update the order accordingly
});


//Refund order

const orderRefund = catchAsyncError(async (req, res) => {
	const { orderId, amount } = req.body;

	const refundAmount = Number(amount);
	console.log(refundAmount);

	// Log the incoming request payload
	console.log('Incoming request payload:', req.body);

	if (!orderId || !refundAmount) {
		return res.status(400).json(makeError('orderId and amount are required'));
	}

	// Validate data types
	console.log('orderId type:', typeof orderId);
	console.log('amount type:', typeof refundAmount);

	if (typeof orderId !== 'string' || typeof refundAmount !== 'number') {
		return res.status(400).json(makeError('Invalid data types: orderId should be a string and amount should be a number'));
	}

	try {
		// Initiate refund
		const refundPayload = {
			unique_request_id: 'refund_test_' + Date.now(),
			order_id: orderId,
			amount: refundAmount,
		};
		console.log(refundPayload);

		const refundResponse = await juspay.order.refund(orderId, refundPayload);
		console.log("refundResponse", refundResponse)

		// Return refund response
		// return res.json(makeJuspayResponse(refundResponse));
		return res.json({ success: true, refundResponse });
	} catch (error) {
		console.error('Error during refund:', error);
		if (error instanceof APIError) {
			// Handle errors coming from Juspay's API
			return res.json(makeError(error.message));
		}
		// Handle other errors
		// return res.json(makeError(error.message || 'An error occurred'));
		return res.status(500).json({ message: error.message || 'An error occurred' });
	}
});



module.exports = { payment, paymentSuccess, handleResponse, orderRefund };