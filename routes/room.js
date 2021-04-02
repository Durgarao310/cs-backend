const express = require("express");
const router  = express.Router();
const { loginrequired } = require('../middleware/auth');
const { getRoom, getRooms, createRoom, updateRoom, addGuestToRoom } = require('../controllers/room');

router.route('/').get(loginrequired,getRooms).post(loginrequired,createRoom);
router.route('/:roomId').get(loginrequired,getRoom).put(loginrequired,updateRoom);
router.route('/:roomId/guests').post(loginrequired,addGuestToRoom)

module.exports  = router;