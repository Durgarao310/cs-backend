const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (error, request, response, next) => {
//   let error = { ...error };

  error.message = error.message;

  // Log to console for dev
  console.log(error);

  // Mongoose bad ObjectId
  if (error.name === 'CastError') {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (error.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const message = Object.values(error.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  response.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

module.exports =  {  errorHandler, unknownEndpoint };