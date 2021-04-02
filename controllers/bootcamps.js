const ErrorResponse = require('../utils/errorResponse');
const asyncHandler  = require('../middleware/async')
const Bootcamp      = require("../models/Bootcamp");
const path = require('path');


//disc     Crete a bootcamps
//route    POST  /api/v1/bootcamps
//access   AUTH/Private
exports.createBootcamp =asyncHandler(async (request, response, next)=>{ 
        // add user to bootcamp 
        console.log(request.user)
        request.body.user = request.user.id
        console.log(request.user.id)
        const bootcamp = await Bootcamp.create(request.body);
        response.json({ success : true, data : bootcamp}).status(201);    
});


//disc     Get all bootcamps
//route    GET  /api/v1/bootcamps
//access   Public
exports.getBootcamps = asyncHandler(async (request, response, next)=>{
        const bootcamps = await Bootcamp.find() 
        response.status(200).json({success : true,data : bootcamps})       
});

//disc     Get single bootcamps
//route    GET  /api/v1/bootcamps/:id
//access   Public
exports.getBootcamp = asyncHandler(async (request, response, next)=>{
    const bootcamp = await Bootcamp.findById(request.params.id)
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with an id of ${request.params.id}`, 400));
    }
    response.status(200).json({success :true,data : bootcamp})        
});

//disc     update single bootcamp
//route    PUT  /api/v1/bootcamps/:id
//access   AUTH/Private
exports.updateBootcamp = asyncHandler(async (request, response, next) => {
    let bootcamp = await Bootcamp.findById(request.params.id);
  
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${request.params.id}`, 404)
      );
    }
  
    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== request.user.id && request.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${request.user.id} is not authorized to update this bootcamp`,
          401
        )
      );
    }
  
    bootcamp = await Bootcamp.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true
    });
  
    response.status(200).json({ success: true, data: bootcamp });
  });

//disc     delete single bootcamp
//route    DELETE  /api/v1/bootcamps/:id
//access   AUTH/Private
exports.deleteBootcamp = asyncHandler(async (request, response, next) => {
    const bootcamp = await Bootcamp.findById(request.params.id);
  
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${request.params.id}`, 404)
      );
    }
  
    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== request.user.id && request.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${request.user.id} is not authorized to delete this bootcamp`,
          401
        )
      );
    }
  
    await bootcamp.remove();
  
    response.status(200).json({ success: true, data: {} });
  });

