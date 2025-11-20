const Staff = require("../models/Staff");

const staffController = {
  // GET /staff/available
  getAvailableStaff: async (req, res) => {
    try {
      const staff = await Staff.findAvailableStaff();
      return res.status(200).json({
        status: true,
        message: "Personal disponible obtenido exitosamente",
        data: staff,
      });
    } catch (error) {
      console.error("Error fetching available staff:", error);
      return res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },
  // GET /staff/external
  getAvailableExternalStaff: async (req, res) => {
    try {
      const externalStaff = await Staff.findAvailableExternalStaff();
      return res.status(200).json({
        status: true,
        message: "Personal externo disponible obtenido exitosamente",
        data: externalStaff,
      });
    } catch (error) {
      console.error("Error fetching available external staff:", error);
      return res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },

  // GET /personas - Obtener todas las personas
  getAllStaff: async (req, res) => {
    try {
      const staff = await Staff.findAllStaff();
      return res.status(200).json({
        status: true,
        message: "Todas las personas obtenidas exitosamente",
        data: staff,
      });
    } catch (error) {
      console.error("Error fetching all staff:", error);
      return res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },

  // POST /personas - Crear persona
  createStaff: async (req, res) => {
    try {
      const { dni, nombre, apellidos, direccion} = req.body;
      if (!dni) {
        return res.status(400).json({
          status: false,
          message: "El DNI es obligatorio",
        });
      }
      const newStaff = await Staff.createStaff(dni, nombre, apellidos, direccion);
      return res.status(201).json({
        status: true,
        message: "Persona creada exitosamente",
        data: newStaff,
      });
    } catch (error) {
      console.error("Error creating staff:", error);
      return res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },

  // PUT /personas/:dni - Actualizar persona
  updateStaff: async (req, res) => {
    try {
      const dni = req.params.dni;
      const { nombre, apellidos, direccion } = req.body;
      const updatedStaff = await Staff.updateStaff(dni, nombre, apellidos, direccion);
      return res.status(200).json({
        status: true,
        message: "Persona actualizada exitosamente",
        data: updatedStaff,
      });
    } catch (error) {
      console.error("Error updating staff:", error);
      return res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },

  // DELETE /personas/:dni - Eliminar persona
  deleteStaff: async (req, res) => {
    try {
      const dni = req.params.dni;
      const deleteStaff = await Staff.deleteStaff(dni);
      if (!deleteStaff) {
        return res.status(404).json({
          status: false,
          message: "Persona no encontrada",
        });
      }
      return res.status(200).json({
        status: true,
        message: "Persona eliminada exitosamente",
      });
    } catch (error) {
      console.error("Error deleting staff:", error);
      return res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },

  // GET /empleados - Obtener todos los empleados con información de persona
  getAllEmployeesPersonal: async (req, res) => {
    try {
      const employees = await Staff.findAllEmployeesPersonalData();
      return res.status(200).json({
        status: true,
        message: "Todos los empleados obtenidos exitosamente",
        data: employees,
      });
    } catch (error) {
      console.error("Error fetching all employees:", error);
      return res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },

};

module.exports = staffController;
