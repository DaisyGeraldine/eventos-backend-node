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
        pe.horaPrevistaInicio,
        pe.presupuesto,
        ej.presupuestoModificado,
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
    fechaIni,
    fechaFin,
    horaPrevistaInicio,
    presupuesto = 0,
    staffInternal = [],
    staffExternal = [],
    materialsInventory = [],
    materialsRental = [],
  }) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const fechaIniFormatted = formatDate(fechaIni);
      const fechaFinFormatted = formatDate(fechaFin);
      const horaPrevistaInicioFormatted = formatDate(horaPrevistaInicio);

      // 1️⃣ Insertar en PreparacionDeEvento
      await conn.query(
        `
        INSERT INTO PreparacionDeEvento (
          fechaIni,
          fechaFin,
          horaPrevistaInicio,
          codEvento,
          presupuesto,
          validado
        )
        VALUES (?, ?, ?, ?, ?, false)
        ON DUPLICATE KEY UPDATE
          fechaIni = VALUES(fechaIni),
          fechaFin = VALUES(fechaFin),
          horaPrevistaInicio = VALUES(horaPrevistaInicio),
          presupuesto = VALUES(presupuesto);
        `,
        [fechaIniFormatted, fechaFinFormatted, horaPrevistaInicioFormatted, eventCode, presupuesto]
      );

      // 2️⃣ Personal interno
      for (const staff of staffInternal) {
        const { dni, fechaIni, fechaFin } = staff;
        await conn.query(
          `
          INSERT INTO EmpleadoEventoPreparado (
            dni,
            codEvento,
            fechaIni,
            fechaFin
          )
          VALUES (?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            fechaIni = VALUES(fechaIni),
            fechaFin = VALUES(fechaFin);
          `,
          [dni, eventCode, fechaIniFormatted, fechaFinFormatted]
        );

        // Marcar al empleado como reservado si está disponible
        await conn.query(
          `UPDATE Empleado SET estado = 'reservado' WHERE dni = ? AND estado = 'disponible'`,
          [dni]
        );
      }

      // 3️⃣ Personal externo
      for (const staff of staffExternal) {
        const { dni, precio, fechaIni, fechaFin } = staff;
        await conn.query(
          `
          INSERT INTO PersonalExternoEnEventoPreparado (
            dni,
            codEvento,
            precio,
            fechaIni,
            fechaFin
          )
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            precio = VALUES(precio),
            fechaIni = VALUES(fechaIni),
            fechaFin = VALUES(fechaFin);
          `,
          [dni, eventCode, precio ?? 0, fechaIniFormatted, fechaFinFormatted]
        );
      }

      // 4️⃣ Material inventario
      for (const mat of materialsInventory) {
        const { codMaterial, precio, fechaIni, fechaFin } = mat;
        await conn.query(
          `
          INSERT INTO MaterialInventarioEventoPreparado (
            codMaterial,
            codEvento,
            precio,
            fechaIni,
            fechaFin
          )
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            precio = VALUES(precio),
            fechaIni = VALUES(fechaIni),
            fechaFin = VALUES(fechaFin);
          `,
          [codMaterial, eventCode, precio ?? 0, fechaIniFormatted, fechaFinFormatted]
        );

        // Marcar el material de inventario como reservado si estaba disponible
        // Ajusta el nombre de la tabla/columna si en tu esquema difiere (ej. MaterialEnInventario.cod / Material.cod)
        await conn.query(
          `UPDATE MaterialEnInventario SET estado = 'reservado' WHERE cod = ? AND estado = 'disponible'`,
          [codMaterial]
        );
      }

      // 5️⃣ Material en alquiler
      for (const mat of materialsRental) {
        const { codMaterial, precio, fechaIni, fechaFin } = mat;
        await conn.query(
          `
          INSERT INTO MaterialEnAlquilerEventoPreparado (
            codMaterial,
            codEvento,
            precio,
            fechaIni,
            fechaFin
          )
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            precio = VALUES(precio),
            fechaIni = VALUES(fechaIni),
            fechaFin = VALUES(fechaFin);
          `,
          [codMaterial, eventCode, precio ?? 0, fechaIniFormatted, fechaFinFormatted]
        );
      }

      await conn.commit();
      return { status: true, message: "Event prepared successfully" };
    } catch (error) {
      await conn.rollback();
      console.error("Error preparing event:", error);
      return { status: false, message: error.message };
    } finally {
      conn.release();
    }
  },

  updateEventStatus: async () => {
    try {
      console.log("[CRON] Iniciando verificación de eventos...");

      // Eventos
      const [events] = await pool.query(`
        SELECT pe.codEvento 
        FROM PreparacionDeEvento pe
        INNER JOIN Evento e ON pe.codEvento = e.cod
        WHERE pe.validado = false 
        AND DATE(e.fechaIni) <= CURDATE();
      `);

      console.log(`[CRON] Eventos encontrados: ${events.length}`);

      for (const event of events) {
        console.log(`[CRON] Actualizando evento: ${event.codEvento}`);

        await pool.query(`
          UPDATE PreparacionDeEvento
          SET validado = true
          WHERE codEvento = ?;
        `, [event.codEvento]);

        await pool.query(`
          INSERT IGNORE INTO EjecucionEvento (codEvento, fechaIni)
          VALUES (?, NOW());
        `, [event.codEvento]);
      }
      console.log(`[CRON] Eventos procesados: ${events.length}`);

      // Empleados se actualizan y ejecutan
      const [employees] = await pool.query(`
        UPDATE Empleado e
        JOIN EmpleadoEventoPreparado eep ON e.dni = eep.dni
        JOIN PreparacionDeEvento pe ON eep.codEvento = pe.codEvento
        JOIN Evento ev ON pe.codEvento = ev.cod
        SET e.estado = 'enEvento'
        WHERE ev.fechaIni <= NOW() AND e.estado = 'reservado';
      `);
      console.log(`[CRON] Empleados actualizados: ${employees.affectedRows}`);

      // Insertar en EmpleadoEventoEjecutado
      await pool.query(`
        INSERT INTO EmpleadoEventoEjecutado (dni, codEvento, fechaIni, fechaFin)
        SELECT eep.dni, eep.codEvento, ev.fechaIni, ev.fechaFin
        FROM EmpleadoEventoPreparado eep
        JOIN PreparacionDeEvento pe ON eep.codEvento = pe.codEvento
        JOIN Evento ev ON pe.codEvento = ev.cod
        WHERE ev.fechaIni <= NOW();
      `);


      // Material de inventario se actualiza y ejecuta
      const [materials] = await pool.query(`
        UPDATE MaterialEnInventario mi
        JOIN MaterialInventarioEventoPreparado miep ON mi.cod = miep.codMaterial
        JOIN PreparacionDeEvento pe ON miep.codEvento = pe.codEvento
        JOIN Evento ev ON pe.codEvento = ev.cod
        SET mi.estado = 'enUso'
        WHERE ev.fechaIni <= NOW() AND mi.estado = 'reservado';
      `);
      console.log(`[CRON] Materiales de inventario actualizados: ${materials.affectedRows}`);

      // Insertar en MaterialInventarioEventoEjecutado
      await pool.query(`
        INSERT INTO MaterialInventarioEventoEjecutado (codMaterial, codEvento, precio, fechaIni, fechaFin)
        SELECT miep.codMaterial, miep.codEvento, miep.precio, ev.fechaIni, ev.fechaFin
        FROM MaterialInventarioEventoPreparado miep
        JOIN PreparacionDeEvento pe ON miep.codEvento = pe.codEvento
        JOIN Evento ev ON pe.codEvento = ev.cod
        WHERE ev.fechaIni <= NOW();
      `);
      
      return { updated: events.length };
    } catch (error) {
      console.error("[CRON ERROR]", error);
    }
  },  
};

// 🔧 Función para formatear fechas al formato que MySQL entiende (YYYY-MM-DD HH:MM:SS)
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

module.exports = Event;
