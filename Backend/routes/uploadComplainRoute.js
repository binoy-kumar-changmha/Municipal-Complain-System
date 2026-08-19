const express = require("express");
const {uploadComplain}= require('../controller/complainUploadController');

const router = express.Router();
const protect = require('../middleware/authMiddleware');
router.post("/send-complain",protect,uploadComplain);

module.exports= router;