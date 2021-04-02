const express = require("express");
const {  getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp } = require('../controllers/bootcamps');
const { loginrequired } = require('../middleware/auth');
const router  = express.Router()


router.route('/').get(getBootcamps).post(loginrequired,createBootcamp);

router.route('/:id').get(loginrequired,getBootcamp).put(loginrequired, updateBootcamp).delete(loginrequired, deleteBootcamp);


module.exports  = router;