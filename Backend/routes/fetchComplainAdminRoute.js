const express = require("express");
const { getAllComplains } = require('../controller/fetchComplain');

const router = express.Router();
const adminProtect = require('../middleware/adminAuthMiddleware');
router.get("/complain-list/Admin", adminProtect, getAllComplains);

module.exports = router;