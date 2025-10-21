const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");

router.post("/data/:id", employeeController.dataEmployee);
router.get("/list", employeeController.getAllEmployees);

module.exports = router;
