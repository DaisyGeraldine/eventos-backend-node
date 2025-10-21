const pool = require("../config/db");

const RequestEvent = {
  findAll: async () => {
    const [rows] = await pool.query(`SELECT
      s.cod,
      s.nombre,
      s.descripcionMaterial,
      s.descripcionPersonal,
      s.fechaIni,
      s.fechaFin,
      s.duracion,
      s.direccion,
      s.aforo,
      s.m2,
      e.estado AS estado,
      s.presupuesto
    FROM SolicitudEvento s
    JOIN EstadoSolicitud e ON s.estado = e.cod;`);
    return rows;
  },
  create: async (data) => {
    const { usuario_id, evento_id, estado } = data;
    const [result] = await pool.query(
      "INSERT INTO SolicitudEvento (usuario_id, evento_id, estado) VALUES (?, ?, ?)",
      [usuario_id, evento_id, estado]
    );
    return result.insertId;
  },

  // findAll: async () => {
  //   const [rows] = await pool.query(`SELECT * FROM SolicitudDeEvento`);
  //   return rows;
  // },
};

module.exports = RequestEvent;
