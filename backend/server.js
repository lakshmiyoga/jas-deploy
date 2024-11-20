
const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');


dotenv.config({ path: "config/config.env" });

connectDatabase();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server running in port ${process.env.PORT} in ${process.env.NODE_ENV}`);
})


server.setTimeout(100000);

// process.on('unhandledRejection',(err)=>{
//     console.log(`Error:${err.message}`);
//     console.log('Shutting down the server due to unhandled rejection error');
//     server.close(()=>{
//         process.exit(1);
//     })
// })

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Optionally shut down the server or perform cleanup
    server.close(() => {
        process.exit(1);
    })
});

process.on('uncaughtException', (err) => {
    console.log(`Error:${err.message}`);
    console.log('Shutting down the server due to uncaughtException  error');
    server.close(() => {
        process.exit(1);
    })
})



