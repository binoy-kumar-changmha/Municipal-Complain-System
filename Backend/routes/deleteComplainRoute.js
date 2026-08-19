const express = require("express");
const router = express.Router();

const { deleteComplain } = require("../controller/deleteComplain");
const protect = require('../middleware/authMiddleware');
router.delete("/complains/:id",protect, deleteComplain);

module.exports = router;