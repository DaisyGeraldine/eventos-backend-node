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
};

module.exports = staffController;
