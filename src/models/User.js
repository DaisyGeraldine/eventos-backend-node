const pool = require("../config/db");

const User = {
  // Buscar usuario por email
  findByEmail: async (email) => {
    const [rows] = await pool.query(
      `SELECT * FROM Empleado e
      JOIN Persona p ON e.dni = p.dni WHERE e.email = ?`,
      [email]
    );
    return rows[0];
  },
};

module.exports = User;
