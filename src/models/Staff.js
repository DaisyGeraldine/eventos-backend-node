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

  findAllStaff: async () => {
    const [rows] = await pool.query(`
      SELECT * FROM Persona ORDER BY apellidos, nombre
    `);
    return rows;
  },

  createStaff: async (dni, nombre, apellidos, direccion) => {
    const [result] = await pool.query(
      `INSERT INTO Persona (dni, nombre, apellidos, direccion) VALUES (?, ?, ?, ?)`,
      [dni, nombre, apellidos, direccion]
    );
    if (result.affectedRows === 0) {
        return null;
    }
    const [rows] = await pool.query(
      `SELECT * FROM Persona WHERE dni = ?`,
      [dni]
    );
    return rows[0];
  },

  updateStaff: async (dni, nombre, apellidos, direccion) => {
    const [result] = await pool.query(
      `UPDATE Persona SET nombre = ?, apellidos = ?, direccion = ? WHERE dni = ?`,
      [nombre, apellidos, direccion, dni]
    );
    if (result.affectedRows === 0) {
        return null;
    }
    const [rows] = await pool.query(
      `SELECT * FROM Persona WHERE dni = ?`,
      [dni]
    );
    return rows[0];
  },

  deleteStaff: async (dni) => {
    const [result] = await pool.query(
      `DELETE FROM Persona WHERE dni = ?`,
      [dni]
    );
    return result.affectedRows > 0;
  },

  findAllEmployeesPersonalData: async () => {
    const [rows] = await pool.query(`
      SELECT p.dni, p.nombre, p.apellidos, p.direccion,
             e.numSS, e.categoriaPersona, e.contratosHoras, e.fechaAlta,
             e.estado, e.email, e.contrasena, e.telefono
      FROM Persona p
      INNER JOIN Empleado e ON p.dni = e.dni
      ORDER BY p.apellidos, p.nombre
    `);
    return rows;
  },

};

module.exports = Staff;
