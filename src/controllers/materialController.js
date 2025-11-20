const Material = require("../models/Material");

const materialController = {
  // GET /material/inventory/available - Materiales disponibles en inventario
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

  // GET /material/rental/available - Materiales disponibles para alquiler
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

  // GET /materials - Obtener todos los materiales
  getAllMaterials: async (req, res) => {
    try {
      const materials = await Material.findAllMaterials();
      res.json({
        status: true,
        message: "Todos los materiales obtenidos exitosamente",
        data: materials,
      });
    } catch (error) {
      console.error("Error retrieving all materials:", error);
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },

  // POST /materials - Crear material base
  createMaterial: async (req, res) => {
    try {
      const { cod, descripcion, fechaIni, fechaFin, precio } = req.body;
      const newMaterial = await Material.createMaterial(cod, descripcion, fechaIni, fechaFin, precio);
      res.status(201).json({
        status: true,
        message: "Material creado exitosamente",
        data: newMaterial,
      });
    } catch (error) {
      console.error("Error creating material:", error);
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }   
  },

  // PUT /materials/:cod - Actualizar material
  updateMaterial: async (req, res) => {
    try {
      const cod = req.params.cod;
      const {descripcion, fechaIni, fechaFin, precio} = req.body;
      const updatedMaterial = await Material.updateMaterial(cod, descripcion, fechaIni, fechaFin, precio);
      res.json({  
        status: true,
        message: "Material actualizado exitosamente",
        data: updatedMaterial,
      });
    } catch (error) {
      console.error("Error updating material:", error);
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },

  // DELETE /materials/:cod - Eliminar material base
  deleteMaterial: async (req, res) => {
    try {
      const cod = req.params.cod;
      await Material.deleteMaterial(cod);
      res.json({
        status: true,
        message: "Material eliminado exitosamente",
      });
    } catch (error) {
      console.error("Error deleting material:", error);
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },

  // GET /materials/inventory - Obtener inventario completo
  getInventoryMaterials: async (req, res) => {
    try {
      const materials = await Material.findInventoryMaterials();
      res.json({
        status: true,
        message: "Inventario completo obtenido exitosamente",
        data: materials,
      });
    } catch (error) {
      console.error("Error retrieving inventory materials:", error);
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },

  // POST /materials/inventory - Agregar material al inventario
  addInventoryMaterial: async (req, res) => {
    try {
      const { cod, estado, fechaFabricacion, diasDisponibilidad } = req.body;
      const newInventoryMaterial = await Material.addInventoryMaterial(cod, estado, fechaFabricacion, diasDisponibilidad);
      res.status(201).json({
        status: true,
        message: "Material agregado al inventario exitosamente",
        data: newInventoryMaterial,
      });
    } catch (error) {
      console.error("Error adding inventory material:", error);
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },

  // PUT /materials/inventory/:cod - Actualizar estado en inventario
  updateInventoryMaterial: async (req, res) => {
    try {
      const cod = req.params.cod;
      const { estado } = req.body;
      const updatedInventoryMaterial = await Material.updateInventoryMaterial(cod, estado);
      res.json({
        status: true,
        message: "Material de inventario actualizado exitosamente",
        data: updatedInventoryMaterial,
      });
    } catch (error) {
      console.error("Error updating inventory material:", error);
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },

  // DELETE /materials/inventory/:cod - Remover del inventario
  deleteInventoryMaterial: async (req, res) => {
    try {
      const cod = req.params.cod;
      await Material.deleteInventoryMaterial(cod);
      res.json({
        status: true,
        message: "Material eliminado del inventario exitosamente",
      });
    } catch (error) {
      console.error("Error deleting inventory material:", error);
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },

  // GET /materials/:cod/complete - Material con inventario
  getMaterialWithInventory: async (req, res) => {
    try {
      const cod = req.params.cod;
      const material = await Material.findMaterialWithInventory(cod);
      res.json({
        status: true,
        message: "Material con inventario obtenido exitosamente",
        data: material,
      });
    } catch (error) {
      console.error("Error retrieving material with inventory:", error);
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },
};

module.exports = materialController;
