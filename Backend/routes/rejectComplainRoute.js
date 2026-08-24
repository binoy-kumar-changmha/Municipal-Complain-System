const express = require("express");

const router = express.Router();

const { rejectComplain } = require("../controller/rejectComplain");
const adminProtect = require('../middleware/adminAuthMiddleware');
router.patch("/complains/:id/reject", adminProtect, rejectComplain);

module.exports = router;
