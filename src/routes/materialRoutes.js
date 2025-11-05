const express = require("express");
const router = express.Router();
const materialController = require("../controllers/materialController");

// router.get("/", materialController.getAllMaterials);
// router.post("/rental", materialController.createMaterialRental);
// router.post("/event", materialController.createMaterialEvent);

router.get(
  "/inventory/available",
  materialController.getAvailableInventoryMaterial
);
router.get("/rental/available", materialController.getAvailableRentalMaterial);

module.exports = router;
