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
          WHEN e.fechaFin < CURDATE() THEN 'Finalizado'
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

  /** NEW: PREPARE EVENT */
  prepareEvent: async ({
    eventCode,
    staffInternal = [],
    staffExternal = [],
    materialsInventory = [],
    materialsRental = [],
  }) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Insert preparation event row
      await conn.query(
        `
        INSERT INTO PreparacionDeEvento (codEvento, validado)
        VALUES (?, false)
        ON DUPLICATE KEY UPDATE codEvento = codEvento
      `,
        [eventCode]
      );

      // Internal staff
      for (let dni of staffInternal) {
        await conn.query(
          `
          INSERT INTO EmpleadoEventoPreparado (dni, codEvento)
          VALUES (?, ?)
        `,
          [dni, eventCode]
        );
      }

      // External staff
      for (let dni of staffExternal) {
        await conn.query(
          `
          INSERT INTO PersonalExternoEnEventoPreparado (dni, codEvento)
          VALUES (?, ?)
        `,
          [dni, eventCode]
        );
      }

      // Inventory material
      for (let cod of materialsInventory) {
        await conn.query(
          `
          INSERT INTO MaterialInventarioEventoPreparado (codMaterial, codEvento)
          VALUES (?, ?)
        `,
          [cod, eventCode]
        );
      }

      // Rental material
      for (let cod of materialsRental) {
        await conn.query(
          `
          INSERT INTO MaterialEnAlquilerEventoPreparado (codMaterial, codEvento)
          VALUES (?, ?)
        `,
          [cod, eventCode]
        );
      }

      await conn.commit();
      return { status: true };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },
};

module.exports = Event;
