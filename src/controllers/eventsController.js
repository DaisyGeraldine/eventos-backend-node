const Event = require("../models/Event");
const RequestEvent = require("../models/RequestEvent");
// Controlador para manejar eventos y solicitudes de eventos

const eventsController = {
  getAllEvents: async (req, res) => {
    try {
      const events = await Event.findAll();
      res.status(200).json({
        status: true,
        message: "Eventos obtenidos exitosamente",
        data: events,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },

  getAllEventRequest: async (_, res) => {
    try {
      const events = await RequestEvent.findAll();
      res.json({
        status: true,
        data: events,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  getEventByDni: async (req, res) => {
    console.log("LLEGÓ AQUI - getEventByDni");
    console.log("BODY:", req.body);
    try {
      const dni = req.body.dni; // <- Aquí lo lees desde el body
      if (!dni) {
        return res
          .status(400)
          .json({ status: false, message: "DNI is required" });
      }

      const events = await Event.findByDni(dni);
      if (!events) {
        return res
          .status(404)
          .json({ status: false, message: "Events not found" });
      }

      res.json({
        status: true,
        message: "Events found",
        data: events,
      });
    } catch (error) {
      console.error("Error en getEventByDni:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  // POST /events/prepare
  prepareEvent: async (req, res) => {
    try {
      await Event.prepareEvent(req.body);

      res.status(200).json({
        status: true,
        message: "Evento preparado exitosamente",
      });
    } catch (error) {
      console.error("Error preparando evento:", error);
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },
};

module.exports = eventsController;
