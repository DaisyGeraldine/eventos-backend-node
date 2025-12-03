const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/eventsController");

router.get("/", eventsController.getAllEvents);
router.post("/employee", eventsController.getEventByDni);
router.get("/requestEvents", eventsController.getAllEventRequest);
router.post("/prepare", eventsController.prepareEvent);
router.put("/:cod/presupuesto-final", eventsController.updateFinalBudget);

module.exports = router;
