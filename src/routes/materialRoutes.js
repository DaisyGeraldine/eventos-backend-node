const express = require("express");
const router = express.Router();
const materialController = require("../controllers/materialController");

// router.get("/", materialController.getAllMaterials);
// router.post("/rental", materialController.createMaterialRental);
// router.post("/event", materialController.createMaterialEvent);

router.get("/", materialController.getAllMaterials);
router.post("/", materialController.createMaterial);
router.put("/:cod", materialController.updateMaterial);
router.delete("/:cod", materialController.deleteMaterial);

router.get("/inventory", materialController.getInventoryMaterials);
router.post("/inventory", materialController.addInventoryMaterial);
router.put("/inventory/:cod", materialController.updateInventoryMaterial);
router.delete("/inventory/:cod", materialController.deleteInventoryMaterial);

router.get("/:cod/complete", materialController.getMaterialWithInventory);

router.get(
  "/inventory/available",
  materialController.getAvailableInventoryMaterial
);
router.get("/rental/available", materialController.getAvailableRentalMaterial);

module.exports = router;
