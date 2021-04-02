const express = require("express");
const path = require('path');
const dotenv  = require("dotenv"); 
const morgan  = require("morgan");
const {  errorHandler, unknownEndpoint } = require('./middleware/error');
const connectDB = require("./config/db");
// const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet        = require("helmet");
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const xss = require('xss-clean');


// listen env var
dotenv.config({ path: "./config/config.env"});

//connect db
connectDB();

const app= express();

// body parser 
app.use(express.json())
//cookie parser
// app.use(cookieParser());
// To remove data, use:
app.use(mongoSanitize());
// use helmet
app.use(helmet())
// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
  });
  app.use(limiter);
  
  // Prevent http param pollution
  app.use(hpp());
  
  // Enable CORS
  app.use(cors());
  

// route files 
const bootcamps = require('./routes/bootcamps');
const auth      = require('./routes/auth');
const room      = require('./routes/room');
const code      = require('./routes/code');

//dev logging middleware
if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'))
}

//mount routes 
app.use('/api/v1/bootcamps',bootcamps);
app.use('/api/v1/auth', auth);
app.use('/api/v1/rooms', room);
app.use('/api/v1/code', code);


// use error handler 
app.use(errorHandler);
app.use(unknownEndpoint)

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT,()=>{
    console.log(`server runing in ${process.env.NODE_ENV} mode on port ${PORT}`)
});


process.on("unhandledRejection",(error, promise) =>{
    console.log(`error: ${error.message}`)
    // close the server and exit process
    server.close(()=>process.exit())
})

