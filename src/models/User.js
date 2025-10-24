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

  // // Crear nuevo usuario (registro)
  // create: async (userData) => {
  //   const { email, password, name } = userData;
  //   const [result] = await pool.query(
  //     "INSERT INTO EmpleadoPropio (email, password, name) VALUES (?, ?, ?)",
  //     [email, password, name]
  //   );
  //   return result.insertId;
  // },
};

module.exports = User;
