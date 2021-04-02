const ErrorResponse = require('../utils/errorResponse');
const asyncHandler  = require('../middleware/async');
const Room = require('../models/Room')
const User = require('../models/user');
const Types = require('mongoose').Types;

//disc     Get all rooms
//route    GET  /api/v1/rooms
//access   Private
exports.getRooms = asyncHandler(async(request, response, next)=>{
    // console.log(request.user)
    // console.log(Room.find())

    const rooms       = await Room.find({
        $or: [{ owner: request.user.id }, { guests: request.user.id }],
      }).sort({
        createdAt: -1,
      })
    if(!rooms){
        return next(new ErrorResponse(`Rooms are not found`, 400));
    }
    response.status(200).json({success :true,data : rooms })
})

//disc     Get single room
//route    GET  /api/v1/rooms/:roomId
//access   Private
exports.getRoom = asyncHandler(async(request, response, next)=>{
    const { roomId } = request.params
    console.log(roomId)
    const room       = await Room.findOne({
        $and: [
          { _id: roomId },
          { $or: [{ owner: request.user._id }, { guests: request.user._id }] },
        ],
      })
    if(!room){
        return next(new ErrorResponse(`room not found with an id of ${roomId}`, 400));
    }
    response.status(200).json({success :true,data : room })
})

//disc     POST create room
//route    post  /api/v1/rooms/
//access   Private
exports.createRoom = asyncHandler(async(request, response, next)=>{
    request.body.owner = request.user.id
    const room = await Room.create(request.body)
    response.json({success : true,  data : room}).status(200);
})


//disc     PUT update room
//route    put  /api/v1/rooms/:roomId
//access   Private
exports.updateRoom = asyncHandler(async(request, response, next)=>{
    const { roomId } = request.params
    const room       = await Room.findById(roomId)
    const isOwner = room.owner._id.toString() === request.user._id.toString()
    const isGuest = room.guests.includes(request.user._id.toString())
    if(!isGuest && !isOwner){
        return next(new ErrorResponse(`permission deniesd`),401)
    }
    const updateroom = await Room.findByIdAndUpdate(roomId, request.body, {new : true})
    response.json({success : true, data : updateroom}).status(200)
})


//disc     POST add user to the room
//route    Post  /api/v1/rooms/:roomId/guests
//access   Private
exports.addGuestToRoom = asyncHandler(async(request, response, next)=>{
    const { roomId } = request.params
    const guest = await User.findOne({name : request.body.name})
    
    if(!guest){
        return next(new ErrorResponse(`no user found with this name ${request.body.name}`),401)
    }
    try {
        const room = await Room.findByIdAndUpdate(
            roomId,
            { $addToSet: { guests: Types.ObjectId(guest._id) } },
            { new: true, useFindAndModify: false }
          ).populate('guests')
        response.json({success: true, data: room})
    } catch (error) {
        response.status(500).send({ error: `Can not add guest ${error}` })
    }
})