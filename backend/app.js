const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error")
const cookieParser = require('cookie-parser')
const cors = require('cors');
const path = require('path')
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, "config/config.env") });

// app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '5mb' })); // Adjust size limit as needed
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
// Cache-Control Middleware to prevent caching
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
  });
  



// let BASE_URL = process.env.FRONTEND_URL;
// if (process.env.NODE_ENV === "production") {
//     BASE_URL = req.secure ? 'https://jasfruitsandvegetables.in':`${req.protocol}://${req.get('host')}`
//   }

// const corsOptions = {
//     origin: `${BASE_URL}`,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization'],
// };

// app.use(cors(corsOptions));

// app.use((req, res, next) => {
//     let baseUrl;

//     if (process.env.NODE_ENV === "production") {
//         baseUrl = req.secure ? 'https://jasfruitsandvegetables.in' : `${req.protocol}://${req.get('host')}`;
//     } else {
//         baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000'; // Default for development
//     }

//     // Set CORS options dynamically
//     const corsOptions = {
//         origin: baseUrl,
//         methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//         credentials: true,
//         allowedHeaders: [
//             'Content-Type',           // JSON and other content types
//             'Authorization',          // Auth headers
//             'X-Requested-With',       // Ajax requests
//             'Accept',                 // For accepting different content types
//             'multipart/form-data'     // For file uploads
//         ],
//     };
//     console.log("baseurl",baseUrl)
//     // Apply CORS options for this request
//     cors(corsOptions)(req, res, next);
// });
app.set('trust proxy', true);

// CORS setup
app.use((req, res, next) => {
    let baseUrl;

    if (process.env.NODE_ENV === "production") {
        baseUrl = req.secure || req.headers['x-forwarded-proto'] === 'https'
            ? 'https://jasfruitsandvegetables.in'
            : `http://${req.get('host')}`;
    } else {
        baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000'; // Default for development
    }

    // Set CORS options dynamically
    const corsOptions = {
        origin: baseUrl,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
        allowedHeaders: [
            'Content-Type',           // JSON and other content types
            'Authorization',          // Auth headers
            'X-Requested-With',       // Ajax requests
            'Accept',                 // For accepting different content types
            'multipart/form-data'     // For file uploads
        ],
    };

    // console.log("baseurl", baseUrl);
    // Apply CORS options for this request
    cors(corsOptions)(req, res, next);
});
// const port = 3000;


// // MongoDB Connection

// const uri =
//   "mongodb+srv://yogalakshmi9496:JbXZvwrM8OsxdUa7@health-temp-db.jn5sij4.mongodb.net/ecomDb?retryWrites=true&w=majority&appName=Health-temp-db";
// // Remember to secure this information
// mongoose
//   .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("MongoDB connection error:", err));


// // Start the Express server
// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });


const products = require('./routes/product')
const user = require('./routes/user');
const order = require('./routes/order');
const porter = require('./routes/porter');
const payment = require("./routes/payment");
const itemsRouter = require('./routes/item');
const enquiry = require("./routes/enquiry");
const analysis = require("./routes/analysis");
const otp = require("./routes/otpRoutes");
const address = require("./routes/address");
const categories = require("./routes/categoryRoutes");
const measurement = require("./routes/measurement");
const loginOtp = require("./routes/loginOtp");
const announcement = require("./routes/announcement")

app.use('/api/v1', products);
app.use('/api/v1', user);
app.use('/api/v1', order);
app.use('/api/v1', payment);
app.use('/api/v1', itemsRouter);
app.use('/api/v1', enquiry);
app.use('/api/v1', porter);
app.use('/api/v1', analysis);
app.use('/api/v1', otp);
app.use('/api/v1', address);
app.use('/api/v1', categories);
app.use('/api/v1', measurement);
app.use('/api/v1', loginOtp);
app.use('/api/v1', announcement);


if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}

app.use(errorMiddleware);
app.use((err, req, res, next) => {
    console.error(err.stack); // Log error details
    res.status(500).send('Something broke!'); // Send error response
});


module.exports = app;