const pool = require("../config/db");

const Staff = {
  findAvailableStaff: async () => {
    const [rows] = await pool.query(`
      SELECT 
        e.dni,
        p.nombre,
        p.apellidos,
        e.categoriaPersona AS category
      FROM Empleado e
      JOIN Persona p ON p.dni = e.dni
      WHERE e.estado = 'disponible'
    `);

    return rows;
  },

  // GET /staff/external
  findAvailableExternalStaff: async () => {
    const [rows] = await pool.query(`
        SELECT 
        dni,
        nombre,
        apellidos,
        categoria AS category,
        precio
      FROM PersonaExterno
    `);
    return rows;
  },
};

module.exports = Staff;
