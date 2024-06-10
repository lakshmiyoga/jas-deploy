const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require('../utils/errorHandler');
const Razorpay = require("razorpay");
const crypto = require("crypto");

//create orders
const payment = catchAsyncError( async (req, res, next) => {
	try {
		console.log(req.body)
		const instance = new Razorpay({
			key_id: process.env.KEY_ID,
			key_secret: process.env.KEY_SECRET,
		});

		const options = {
			amount: req.body.total * 100,
			currency: "INR",
			receipt: crypto.randomBytes(10).toString("hex"),
		};

		instance.orders.create(options, (error, order) => {
			if (error) {
				// console.log(error);
				// return res.status(500).json({ message: "Something Went Wrong!" });
                return next(new ErrorHandler("Something Went Wrong!", 500))
			}
			// console.log(order)
			res.status(200).json({ data: order });
		});
	} catch (error) {
		// res.status(500).json({ message: "Internal Server Error!" });
        return next(new ErrorHandler("Internal Server Error!" , 500))
		// console.log(error);
	}
});

//payment verify

const verifyPayment = catchAsyncError( async (req, res, next) => {
	try {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
		const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign = crypto
			.createHmac("sha256", process.env.KEY_SECRET)
			.update(sign.toString())
			.digest("hex");

		if (razorpay_signature === expectedSign) {
			// return res.status(200).json({ message: "Payment verified successfully" });
            return next(new ErrorHandler("Payment verified successfully" , 200))
            
		} else {
			// return res.status(400).json({ message: "Invalid signature sent!" });
            return next(new ErrorHandler("Invalid signature sent!" , 400))
		}
	} catch (error) {
		// res.status(500).json({ message: "Internal Server Error!" });
        return next(new ErrorHandler("Internal Server Error!" , 500))
		// console.log(error);
	}
});

module.exports = {payment,verifyPayment};