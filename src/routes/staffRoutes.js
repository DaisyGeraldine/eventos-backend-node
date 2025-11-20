const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");

// GET /staff/available
router.get("/available", staffController.getAvailableStaff);
// GET /staff/external
router.get("/external", staffController.getAvailableExternalStaff);
// GET /personas - Obtener todas las personas
router.get("/personas", staffController.getAllStaff);
// POST /personas - Crear persona
router.post("/personas", staffController.createStaff);
// PUT /personas/:dni - Actualizar persona
router.put("/personas/:dni", staffController.updateStaff);
// DELETE /personas/:dni - Eliminar persona
router.delete("/personas/:dni", staffController.deleteStaff);

// GET /empleados - Obtener todos los empleados con información de persona
router.get("/empleados", staffController.getAllEmployeesPersonal);


module.exports = router;
