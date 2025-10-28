const pool = require("../config/db");

const Event = {
  findAll: async () => {
    const [rows] = await pool.query(`
      SELECT 
        e.cod,
        e.nombre,
        e.fechaIni,
        e.fechaFin,
        e.dniUsuario,
        e.descripcionMaterial,
        e.descripcionPersonal,
        e.duracion,
        e.direccion,
        e.aforo,
        e.m2,
        e.anotaciones,
        p.nombre AS nombreUsuario,
        CASE 
          WHEN ej.codEvento IS NOT NULL THEN 'En ejecución'
          WHEN pe.codEvento IS NOT NULL THEN 'En preparación'
          ELSE 'Pendiente'
        END AS estado
      FROM Evento e
      LEFT JOIN PreparacionDeEvento pe ON e.cod = pe.codEvento
      LEFT JOIN EjecucionEvento ej ON e.cod = ej.codEvento
      LEFT JOIN Usuario u ON e.dniUsuario = u.dni
      LEFT JOIN Persona p ON u.dni = p.dni
      ORDER BY e.fechaIni DESC`);
    return rows;
  },

  findByDni: async (dni) => {
    const [rows] = await pool.query(
      `SELECT Evento.* 
        FROM EmpleadoEnEvento
        INNER JOIN Evento ON EmpleadoEnEvento.cod = Evento.cod
        WHERE EmpleadoEnEvento.dni = ?`,
      [dni]
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  },
};

module.exports = Event;
