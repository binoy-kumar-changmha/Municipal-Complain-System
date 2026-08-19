const express = require("express");

const router = express.Router();

const { acceptComplain } = require("../controller/acceptComplain");
const adminProtect = require('../middleware/adminAuthMiddleware');
router.patch("/complains/:id/accept", adminProtect, acceptComplain);

module.exports = router;