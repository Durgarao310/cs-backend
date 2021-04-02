const ErrorResponse = require('../utils/errorResponse');
const asyncHandler  = require('../middleware/async');
const User          = require('../models/user');
const crypto        = require('crypto');
const sendEmail     = require('../utils/sendEmail');



// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (request, response, next) => {
    const { name, email, password } = request.body;

    const user_email = await User.findOne({email})
    const leng = password.length > 5
    if(user_email){
      return next(new ErrorResponse('please provide different email', 400))
    }
    if(!leng){
        return next(new ErrorResponse('password more than 6 characters', 400))
    }
    //create user 
    const user = await User.create({
        name,
        email,
        password
    })
    sendTokenResponse(user, 200, response );

});


 
// @desc      login  user
// @route     POST /api/v1/auth/login 
// @access    Public
exports.login = asyncHandler(async (request, response, next) => {
    const { email, password } = request.body;

    //validate email and password of user 
    if(!email || !password){
        return next(new ErrorResponse('please provide email and password', 400))
    }

    //check for user
    const user = await User.findOne({ email }).select('+password')
    if(!user){
        return next(new ErrorResponse('invalid creditionals', 401))
    }

    //check password 
    const isMatch = await user.matchPassword(password);
    if(!isMatch){
        return next(new ErrorResponse('invalid creditionals', 401))
    }

    sendTokenResponse(user, 200, response);
});

// @desc      current user logiut
// @route     PUT /api/v1/auth/logout
// @access    Private
exports.logout = asyncHandler(async (request, response, next) => {
    response.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
  
    response.status(200).json({
      success: true,
      data: {},
    });
  });
  

// @desc      Get current logged in user
// @route     GET /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (request, response, next) => {

    // user is already available in req due to the protect middleware
    const user = await request.user;
  
    response.status(200).json({
      success: true,
      data: user,
    });
});

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async (request, response, next) => {
  const user = await User.findOne({ email: request.body.email });
  console.log(user)

  if (!user) {
    return next(new ErrorResponse('There is no user with this email', 404));
  }
  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;
 ;
  const email = user.email
  try {
    await sendEmail(email,`Dear ${user.name} Verify your account`,`Please verifiy your account by clicking the following link ${resetUrl}`)
    response.status(200).json({ success: true, data: 'Email sent, please check email' });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (request, response, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(request.params.resetToken
      )
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token, Please contact admin', 400));
  }

  // Set new password
  user.password = request.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, response);
}); 



// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, response) => {
    // Create token
    const token = user.getSignedJwtToken();
  
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
      ),
      httpOnly: true,
    };
  
    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }
  
    response.status(statusCode).cookie('token', token, options).json({
      success: true,
      token,
    });
};