const express = require("express");

const router = express.Router();

const { resolveComplain } = require("../controller/resolveComplain");
const adminProtect = require('../middleware/adminAuthMiddleware');
router.patch("/complains/:id/resolve", adminProtect, resolveComplain);

module.exports = router;
