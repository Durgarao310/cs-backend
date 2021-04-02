const express = require("express");
const {  codeRun } = require('../controllers/code');
const { loginrequired } = require('../middleware/auth');
const router  = express.Router()


router.route('/run').post(codeRun,loginrequired);

module.exports  = router;