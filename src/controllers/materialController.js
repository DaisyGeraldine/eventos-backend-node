const Material = require("../models/Material");

const materialController = {
  // GET /material/inventory/available
  getAvailableInventoryMaterial: async (req, res) => {
    try {
      const materials = await Material.findAvailableInventoryMaterial();
      res.json({
        status: true,
        message: "Materiales de inventario disponibles obtenidos exitosamente",
        data: materials,
      });
    } catch (error) {
      console.error("Error retrieving available inventory materials:", error);
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },

  // GET /material/rental/available
  getAvailableRentalMaterial: async (req, res) => {
    try {
      const materials = await Material.findAvailableRentalMaterial();
      res.json({
        status: true,
        message: "Materiales de alquiler disponibles obtenidos exitosamente",
        data: materials,
      });
    } catch (error) {
      console.error("Error retrieving available rental materials:", error);
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },
};

module.exports = materialController;
