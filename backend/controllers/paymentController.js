
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require('../utils/errorHandler');
const Razorpay = require("razorpay");
const crypto = require("crypto");
const fs = require('fs');
const path = require('path');
const { Juspay, APIError } = require('expresscheckout-nodejs');
const config = require('../config/config.json');
const Order = require('../models/order');
const Payment = require('../models/paymentModel');
const responseModel = require('../models/responseModel');


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
const payment = catchAsyncError(async (req, res) => {

	const { total,
		user,
		shippingInfo,
		cartItems,
		user_id,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice } = req.body;

	// console.log(req.body);

	const orderId = `order_${Date.now()}`;
	const amount = parseFloat(total).toFixed(2);
	// console.log(amount)



	// Create return URL
	let BASE_URL = process.env.BACKEND_URL;
	if (process.env.NODE_ENV === "production") {
		BASE_URL = `${req.protocol}://${req.get('host')}`
	}

	const returnUrl = `${BASE_URL}/api/v1/paymentsuccess/${orderId}`; // Adjust this URL as needed

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
            totalPrice,
            paymentStatus: 'initiated'
        });

        await payment.save();

		const createdOrder = await Payment.findOne({ order_id: orderId });
		if(createdOrder){
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
						{
							paymentMethodType: "NB",
							enable: true
						},
						{
							paymentMethodType: "UPI",
							enable: true
						},
						{
							paymentMethodType: "CARD",
							enable: true
						},
						{
							paymentMethodType: "WALLET",
							enable: true
						}
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
			return res.status(200).json({ sessionResponse })
		}		
        else{
			return res.json(makeError('order not Created'))
		}
        // res.status(200).json({ payment });
		// return res.json(makeJuspayResponse(sessionResponse));
		//  res.status(200).json({ sessionResponse })
		
		

		// return res.status(200).json({ message: 'Payment processed successfully', responceData: response.data ,sessionResponse });
	} catch (error) {
		if (error instanceof APIError) {
			return res.json(makeError(error.message));
		}
		return res.json(makeError());
	}
});

const handleResponse = catchAsyncError(async (req, res) => {
	// console.log("params",req.params)
	const orderId = req.params.id || req.params.orderId || req.params.order_id;
	// console.log("orderId",orderId)
	if (!orderId) {
		return res.json(makeError('order_id not present or cannot be empty'));
	}

	try {
		const statusResponse = await juspay.order.status(orderId);
		return res.status(200).json({ statusResponse })
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
		if (error instanceof APIError) {
			return res.json(makeError(error.message));
		}
		return res.json(makeError());
	}
});



function makeError(message) {
	return {
		message: message || 'Something went wrong'
	};
}

function makeJuspayResponse(successRspFromJuspay) {
	if (!successRspFromJuspay) return successRspFromJuspay;
	if (successRspFromJuspay.http) delete successRspFromJuspay.http;
	return successRspFromJuspay;
}


// In your backend (e.g., Express.js)
const paymentSuccess = catchAsyncError(async (req, res) => {
	// const{order_id,
	// 	user_id,
	// 	user,
	// 	cartItems,
	// 	shippingInfo,
	// 	itemsPrice,
	// 	taxPrice,
	// 	shippingPrice,
	// 	totalPrice,
	// 	sessionResponse} = req.body;

	// console.log("payment responsennnnnnnnnnnnnnnnnnn",req.body)

	// const paymentResponse = new Payment({
	// 	order_id,
	// 	user_id,
	// 	user,
	// 	cartItems,
	// 	shippingInfo,
	// 	itemsPrice,
	// 	taxPrice,
	// 	shippingPrice,
	// 	totalPrice,
	// 	sessionResponse
	// })
	// await paymentResponse.save();
	// res.status(201).json({ success: true, paymentResponse });

	const orderId = req.params.id || req.params.orderId || req.params.order_id;
	if (!orderId) {
		return res.json(makeError('order_id not present or cannot be empty'));
	}
	let BASE_URL = process.env.FRONTEND_URL;
	if (process.env.NODE_ENV === "production") {
		BASE_URL = `${req.protocol}://${req.get('host')}`
	}
	try {
		const statusResponse = await juspay.order.status(orderId);
		// console.log(statusResponse)
		if (statusResponse) {
			const response = new responseModel({statusResponse});
			// console.log(response)
			await response.save();
			
			// return res.status(200).json({response})
			// Update order status to 'paid'
			const onepayments = await Payment.findOne({ order_id: orderId });
			if(onepayments){
				const paymentstatus = await Payment.findOneAndUpdate({ order_id: orderId }, { paymentStatus: statusResponse.status },
					{ new: true });
			}
			else{
				return res.json(makeError('order_id not present or cannot be empty'));
			}
			const oneorders = await Order.findOne({ order_id: orderId });
			if(oneorders){
				const orderstatus = await Order.findOneAndUpdate({ order_id: orderId }, { paymentStatus: statusResponse.status },
					{ new: true });
			}
			else{
				return res.json(makeError('order_id not present or cannot be empty'));
			}
			
			res.redirect(`${BASE_URL}/payment/confirm/${orderId}`);
			return res.status(200).json({ orderstatus });
		} else {
			// Handle payment failure
			res.redirect(`${BASE_URL}/payment/failed`);
			console.log("error ")
		}
	}
	catch (error) {
		if (error instanceof APIError) {
			return res.json(makeError(error.message));
		}
		return res.json(makeError());
	}
	// Verify the payment status and update the order accordingly

});

// Route for order confirmation page
const orderConfirmation = catchAsyncError((req, res) => {
	res.send('Your order has been successfully placed!');
});

// Route for payment failed page
const paymentFailed = catchAsyncError((req, res) => {
	res.send('There was an issue with your payment. Please try again.');
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



module.exports = { payment, paymentSuccess, orderConfirmation, paymentFailed, handleResponse, orderRefund };