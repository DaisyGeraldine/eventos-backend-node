const express = require("express");
const router = express.Router();
const materialController = require("../controllers/materialController");

router.get("/", materialController.getAllMaterials);
router.post("/rental", materialController.createMaterialRental);
router.post("/event", materialController.createMaterialEvent);

module.exports = router;
