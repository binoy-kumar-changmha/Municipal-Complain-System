const express = require("express");
const {adminLogin}= require('../controller/adminLoginController');

const router = express.Router();

router.post("/login/Admin",adminLogin);

module.exports= router;