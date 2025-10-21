const pool = require("../config/db");

const Employee = {
  // Buscar usuario por email
  findByEmail: async (email) => {
    const [rows] = await pool.query(
      "SELECT * FROM EmpleadoPropio WHERE email = ?",
      [email]
    );
    return rows[0];
  },

  findAll: async () => {
    const [rows] = await pool.query(`SELECT
        e.dni,
        e.nombre,
        e.apellidos,
        e.numSS,
        e.categoria,
        e.email AS email_empleado,
        ep.salario,
        ep.contadorHoras,
        ep.estado,
        ep.email AS email_propio,
        ep.contraseña
      FROM Empleado e
      JOIN EmpleadoPropio ep ON e.dni = ep.dni;`);
    return rows;
  },
  findByDni: async (dni) => {
    const query = `SELECT
        e.dni,
        e.nombre,
        e.apellidos,
        e.numSS,
        e.categoria,
        e.email AS email_empleado,
        ep.salario,
        ep.contadorHoras,
        ep.estado,
        ep.email AS email_propio,
        ep.contraseña
      FROM Empleado e
      JOIN EmpleadoPropio ep ON e.dni = ep.dni
      WHERE e.dni = ?;`;
    const [rows] = await pool.query(query, [dni]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  },
};

module.exports = Employee;
