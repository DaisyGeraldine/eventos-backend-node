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

  // POST /empleados/complete - Crear empleado completo (Persona + Empleado)
  createCompleteEmployee: async (req, res) => {
    try {
      const {
        dni,
        nombre,
        apellidos,
        direccion,
        numSS,
        categoriaPersona,
        contratosHoras,
        fechaAlta,
        estado,
        email,
        contrasena,
        telefono,
      } = req.body; 
      if (!dni || !email || !contrasena) {
        return res.status(400).json({
          status: false,
          message: "DNI, email y contraseña son obligatorios",
        });
      }
      const newEmployee = await Staff.createCompleteEmployee(
        dni,
        nombre,
        apellidos,
        direccion,
        numSS,
        categoriaPersona,
        contratosHoras,
        fechaAlta,
        estado,
        email,
        contrasena,
        telefono
      );

      if (newEmployee === null) {
        return res.status(409).json({
          status: false,
          message: "El DNI o email ya existe en la base de datos",
        });
      }

      return res.status(201).json({
        status: true,
        message: "Empleado creado exitosamente",
        data: newEmployee,
      });
    } catch (error) {
      console.error("Error creating complete employee:", error);
      return res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },

  // PUT /empleados/:dni/complete - Actualizar empleado completo
  updateCompleteEmployee: async (req, res) => {
    try {
      const dni = req.params.dni;
      const {
        nombre,
        apellidos,
        direccion,
        numSS,
        categoriaPersona,
        contratosHoras,
        fechaAlta,
        estado,
        email,
        contrasena,
        telefono,
      } = req.body;
      const updatedEmployee = await Staff.updateCompleteEmployee(
        dni,
        nombre,
        apellidos,
        direccion,
        numSS,
        categoriaPersona,
        contratosHoras,
        fechaAlta,
        estado,
        email,
        contrasena,
        telefono
      );

      if (updatedEmployee === null) {
        return res.status(404).json({
          status: false,
          message: "Empleado no encontrado",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Empleado actualizado exitosamente",
        data: updatedEmployee,
      });
    } catch (error) {
      console.error("Error updating complete employee:", error);
      return res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },

  // PUT /empleados/:dni/estado - Actualizar solo estado
  updateEmployeeStatus: async (req, res) => {
    try {
      const dni = req.params.dni;
      const { estado } = req.body;
      const updatedStatus = await Staff.updateEmployeeStatus(dni, estado);
      return res.status(200).json({
        status: true,
        message: "Estado del empleado actualizado exitosamente",
        data: updatedStatus,
      });
    } catch (error) {
      console.error("Error updating employee status:", error);
      return res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },

  // DELETE /empleados/:dni/complete - Eliminar empleado completo
  deleteCompleteEmployee: async (req, res) => {
    try {
      const dni = req.params.dni;
      const deleteEmployee = await Staff.deleteCompleteEmployee(dni);
      if (!deleteEmployee) {
        return res.status(404).json({
          status: false,
          message: "Empleado no encontrado",
        });
      }
      return res.status(200).json({
        status: true,
        message: "Empleado eliminado exitosamente",
      });
    } catch (error) {
      console.error("Error deleting complete employee:", error);
      return res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },

  // GET /empleados/categoria/:categoria - Empleados por categoría
  getEmployeesByCategory: async (req, res) => {
    try {
      const categoria = req.params.categoria;
      const employees = await Staff.findEmployeesByCategory(categoria);
      return res.status(200).json({
        status: true,
        message: `Empleados de categoría ${categoria} obtenidos exitosamente`,
        data: employees,
      });
    } catch (error) {
      console.error("Error fetching employees by category:", error);
      return res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },

  // GET /empleados/estado/:estado - Empleados por estado
  getEmployeesByStatus: async (req, res) => {
    try {
      const estado = req.params.estado;
      const employees = await Staff.findEmployeesByStatus(estado);
      return res.status(200).json({
        status: true,
        message: `Empleados con estado ${estado} obtenidos exitosamente`,
        data: employees,
      });
    } catch (error) {
      console.error("Error fetching employees by status:", error);
      return res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },

  // POST /empleados/$dni/eventos/proximos
  getUpcomingEventsForEmployee: async (req, res) => {
    try {
      const dni = req.params.dni;
      const events = await Staff.findUpcomingEventsForEmployee(dni);
      return res.status(200).json({
        status: true,
        message: "Eventos próximos obtenidos exitosamente",
        data: events,
      });
    } catch (error) {
      console.error("Error fetching upcoming events for employee:", error);
      return res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  }

};

module.exports = staffController;
