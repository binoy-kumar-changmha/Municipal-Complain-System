const express = require("express");
const {getAllComplains}= require('../controller/fetchComplain');

const router = express.Router();
const protect = require('../middleware/authMiddleware');
router.get("/complain-list",protect,getAllComplains);

module.exports= router;