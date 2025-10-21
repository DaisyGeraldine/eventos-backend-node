const Employee = require("../models/Employee");
const Task = require("../models/Employee");
const employeeController = {
  // Datos del empleado
  dataEmployee: async (req, res) => {
    try {
      console.log("Datos del empleado recibidos:", req.params.id); // 👈 Nuevo
      const dni = req.params.id;
      console.log("DNI recibido:", dni); // 👈 Nuevo
      const employee = await Employee.findByDni(dni);

      console.log("Empleado encontrado:", employee); // 👈 Nuevo

      if (!employee || employee === null) {
        console.log("Empleado no encontrado"); // 👈 Nuevo
        return res
          .status(404)
          .json({ status: false, error: "Empleado no encontrado" });
      }
      console.log("Empleado encontrado:", employee); // 👈 Nuevo
      res.json({
        status: true,
        data: employee,
      });
    } catch (error) {
      res.status(500).json({ status: false, error: "Error en el servidor" });
    }
  },

  // Lista de empleados
  getAllEmployees: async (_, res) => {
    try {
      const employees = await Employee.findAll();
      res.json({
        status: true,
        data: employees,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = employeeController;
