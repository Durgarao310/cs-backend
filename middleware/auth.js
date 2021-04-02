const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');
const Bootcamp      = require("../models/Bootcamp");
const { compareSync } = require('bcrypt');

// Protect routes
exports.loginrequired = asyncHandler(async (request, response, next) => {
  let token;

  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = request.headers.authorization.split(' ')[1];
    
    // Set token from cookie
  }
  // else if (request.cookies.token) {
  //   token = request.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to author
exports.authorize = asyncHandler(async (request, response, next) =>{
      // const user = request.user.id
      // const bootcamp = await Bootcamp.findById(request.params.id)
      // console.log(user == bootcamp.user)
      // if(user != bootcamp.user){
      //     return next(new ErrorResponse(`no need to access this is bootcamp ${request.params.id}`, 403));
      //   }
      //  next(); 
});