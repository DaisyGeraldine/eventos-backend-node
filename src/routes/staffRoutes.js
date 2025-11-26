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
// POST /empleados/complete - Crear empleado completo (Persona + Empleado)
router.post("/empleados/complete", staffController.createCompleteEmployee);
// PUT /empleados/:dni/complete - Actualizar empleado completo
router.put("/empleados/:dni/complete", staffController.updateCompleteEmployee);
// PUT /empleados/:dni/estado - Actualizar solo estado
router.put("/empleados/:dni/estado", staffController.updateEmployeeStatus);
// DELETE /empleados/:dni/complete - Eliminar empleado completo
router.delete("/empleados/:dni/complete", staffController.deleteCompleteEmployee);
// GET /empleados/categoria/:categoria - Empleados por categoría
router.get("/empleados/categoria/:categoria", staffController.getEmployeesByCategory);
// GET /empleados/estado/:estado - Empleados por estado
router.get("/empleados/estado/:estado", staffController.getEmployeesByStatus);

module.exports = router;
