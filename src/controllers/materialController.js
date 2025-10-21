const Material = require("../models/Material");

const materialController = {
  getAllMaterials: async (req, res) => {
    try {
      const materials = await Material.findAllMaterial();
      res.json({
        status: true,
        message: "Materials retrieved successfully",
        data: materials,
      });
    } catch (error) {
      console.error("Error retrieving materials:", error);
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },

  createMaterialRental: async (req, res) => {
    try {
      const { description, quantity, price, status } = req.body;
      if (!description || !quantity || !price || !status) {
        return res.status(400).json({
          status: false,
          message: "All fields are required",
        });
      }

      const rentalData = {
        description,
        quantity,
        price,
        status,
      };

      // Here you would typically save the rental data to the database
      const savedRental = await Material.createRental(rentalData);
      console.log("Rental data created:", savedRental);

      res.status(201).json({
        status: true,
        message: "Material rental created successfully",
        data: { savedRental },
      });
    } catch (error) {
      console.error("Error creating material rental:", error);
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },

  createMaterialEvent: async (req, res) => {
    try {
      const { name, description, price, codEvent } = req.body;
      if (!name || !description || !price || !codEvent) {
        return res.status(400).json({
          status: false,
          message: "All fields are required",
        });
      }

      const eventData = {
        name,
        description,
        price,
        codEvent,
      };

      // Here you would typically save the event data to the database
      const savedEvent = await Material.createEvent(eventData);
      console.log("Event data created:", savedEvent);

      res.status(201).json({
        status: true,
        message: "Material event created successfully",
        data: { savedEvent },
      });
    } catch (error) {
      console.error("Error creating material event:", error);
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },
};

module.exports = materialController;
