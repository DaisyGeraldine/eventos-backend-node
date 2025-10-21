const pool = require("../config/db");

const Event = {
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM Evento");
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
