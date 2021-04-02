const express = require("express");
const { register, login, getMe, logout, forgotPassword, resetPassword } = require('../controllers/auth');
const { loginrequired } = require('../middleware/auth');

const router  = express.Router()

router.route('/register').post( register);
router.route('/login').post( login);
router.route('/logout').get(logout);
router.route('/me').get(loginrequired, getMe);
router.route('/forgotpassword').post(forgotPassword);
router.route('/passwordreset/:resetToken').put(resetPassword);


module.exports  = router;