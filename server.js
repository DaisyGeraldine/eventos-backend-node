require("dotenv").config(); // Carga las variables de entorno

const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const tasksRoutes = require("./src/routes/tasksRoutes");
const employeeRoutes = require("./src/routes/employeeRoutes");
const eventsRoutes = require("./src/routes/eventsRoutes");
const materialRoutes = require("./src/routes/materialRoutes");
const staffRoutes = require("./src/routes/staffRoutes");
const cron = require("node-cron");
const Event = require("./src/models/Event");

// Inicializar Express
const app = express();

// Middlewares
app.use(cors()); // Permite peticiones desde cualquier origen (en desarrollo)
app.use(express.json()); // Habilita el parseo de JSON en las peticiones

// Rutas públicas (sin autenticación)
app.use("/api/auth", authRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/staff", staffRoutes);

// Rutas protegidas (requieren token JWT)
app.use("/api/tasks", require("./src/middlewares/authMiddleware"), tasksRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Backend de Task Manager funcionando!");
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT,"0.0.0.0", () => {
  console.log(`Servidor corriendo en el http://${process.env.DB_HOST}:${PORT}`);
});

// Ejecutar todos los días a medianoche
cron.schedule("* * * * *", async () => {
  console.log(`[CRON TEST] Ejecutado a ${new Date().toLocaleString()}`);
  await Event.updateEventStatus();
});
