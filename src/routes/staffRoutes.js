const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");

// GET /staff/available
router.get("/available", staffController.getAvailableStaff);
// GET /staff/external
router.get("/external", staffController.getAvailableExternalStaff);

module.exports = router;
