const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error")
const  cookieParser = require('cookie-parser')
const cors = require('cors');
const path =require('path')
const dotenv = require('dotenv');
dotenv.config({path:path.join(__dirname,"config/config.env")});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname,"uploads")))

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
};

app.use(cors(corsOptions));


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
const  payment  = require("./routes/payment");
const itemsRouter = require('./routes/item');
const  enquiry  = require("./routes/enquiry");

app.use('/api/v1', products);
app.use('/api/v1',user);
app.use('/api/v1',order);
app.use('/api/v1',payment);
app.use('/api/v1', itemsRouter);
app.use('/api/v1',enquiry);


if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) =>{
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}

app.use(errorMiddleware);


module.exports = app;