const pool = require("../config/db");

const Staff = {
  // GET /staff/available
  findAvailableStaff: async () => {
    const [rows] = await pool.query(`
      SELECT p.dni, p.nombre, p.apellidos, p.direccion,
             e.numSS, e.categoriaPersona AS category, e.contratosHoras, e.fechaAlta,
             e.estado, e.email, e.contrasena, e.telefono
      FROM Empleado e
      JOIN Persona p ON p.dni = e.dni
      WHERE e.estado = 'disponible'
      ORDER BY p.apellidos, p.nombre
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
      ORDER BY apellidos, nombre
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

  createCompleteEmployee: async (
    dni,
    nombre,
    apellidos,
    direccion,
    numSS,
    categoriaPersona,
    contratosHoras,
    fechaAlta,
    estado,
    email,
    contrasena,
    telefono,
  ) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert into Persona
      await connection.query(
        `INSERT INTO Persona (dni, nombre, apellidos, direccion) VALUES (?, ?, ?, ?)`,
        [dni, nombre, apellidos, direccion]
      );

      // Insert into Empleado
      await connection.query(
        `INSERT INTO Empleado (dni, numSS, categoriaPersona, contratosHoras, fechaAlta, estado, email, contrasena, telefono) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [dni, numSS, categoriaPersona, contratosHoras, fechaAlta, estado, email, contrasena, telefono]
      );

      await connection.commit();

      const [rows] = await connection.query(
        `SELECT p.dni, p.nombre, p.apellidos, p.direccion,
                e.numSS, e.categoriaPersona, e.contratosHoras, e.fechaAlta,
                e.estado, e.email, e.contrasena, e.telefono
         FROM Persona p
         INNER JOIN Empleado e ON p.dni = e.dni
         WHERE p.dni = ?`,
        [dni]
      );

      return rows[0];
    } catch (error) {
      await connection.rollback();
      console.error('Error al crear empleado:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return null; // Indicar que ya existe
      }
    } finally {
      connection.release();
    }
  },

  updateCompleteEmployee: async (
    dni,
    nombre,
    apellidos,
    direccion,
    numSS,
    categoriaPersona,
    contratosHoras,
    fechaAlta,
    estado,
    email,
    contrasena,
    telefono,
  ) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      // Update Persona
      await connection.query(
        `UPDATE Persona SET nombre = ?, apellidos = ?, direccion = ? WHERE dni = ?`,
        [nombre, apellidos, direccion, dni]
      );

      // Update Empleado
      await connection.query(
        `UPDATE Empleado SET numSS = ?, categoriaPersona = ?, contratosHoras = ?, fechaAlta = ?, estado = ?, email = ?, contrasena = ?, telefono = ? WHERE dni = ?`,
        [numSS, categoriaPersona, contratosHoras, fechaAlta, estado, email, contrasena, telefono, dni]
      );

      await connection.commit();

      const [rows] = await connection.query(
        `SELECT p.dni, p.nombre, p.apellidos, p.direccion,
                e.numSS, e.categoriaPersona, e.contratosHoras, e.fechaAlta,
                e.estado, e.email, e.contrasena, e.telefono
         FROM Persona p
         INNER JOIN Empleado e ON p.dni = e.dni
         WHERE p.dni = ?`,
        [dni]
      );

      if (rows.length === 0) {
        return null;
      }

      return rows[0];
    } catch (error) {
      await connection.rollback();
      console.error('Error al actualizar empleado:', error);
      return null;
    } finally {
      connection.release();
    }
  },

  updateEmployeeStatus: async (dni, estado) => {
    const [result] = await pool.query(
      `UPDATE Empleado SET estado = ? WHERE dni = ?`,
      [estado, dni]
    );

    if (result.affectedRows === 0) {
        return null;
    }
    
    const [rows] = await pool.query(
      `SELECT p.dni, p.nombre, p.apellidos, p.direccion,
             e.numSS, e.categoriaPersona, e.contratosHoras, e.fechaAlta,
             e.estado, e.email, e.contrasena, e.telefono
      FROM Persona p
      INNER JOIN Empleado e ON p.dni = e.dni
      WHERE p.dni = ?`,
      [dni]
    );
    return rows[0];
  },

  deleteCompleteEmployee: async (dni) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Delete from Empleado
      await connection.query(
        `DELETE FROM Empleado WHERE dni = ?`,
        [dni]
      );

      // Delete from Persona
      const [result] = await connection.query(
        `DELETE FROM Persona WHERE dni = ?`,
        [dni]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return null;
      }
      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      console.error('Error al eliminar empleado:', error);
      return false;
    } finally {
      connection.release();
    }
  },

  findEmployeesByCategory: async (category) => {
    const [rows] = await pool.query(`
      SELECT p.dni, p.nombre, p.apellidos, p.direccion,
             e.numSS, e.categoriaPersona, e.contratosHoras, e.fechaAlta,
             e.estado, e.email, e.contrasena, e.telefono
      FROM Persona p
      INNER JOIN Empleado e ON p.dni = e.dni
      WHERE e.categoriaPersona = ?
      ORDER BY p.apellidos, p.nombre
    `, [category]);
    return rows;
  },

  findEmployeesByStatus: async (status) => {
    const [rows] = await pool.query(`
      SELECT p.dni, p.nombre, p.apellidos, p.direccion,
             e.numSS, e.categoriaPersona, e.contratosHoras, e.fechaAlta,
             e.estado, e.email, e.contrasena, e.telefono
      FROM Persona p
      INNER JOIN Empleado e ON p.dni = e.dni
      WHERE e.estado = ?
      ORDER BY p.apellidos, p.nombre
    `, [status]);
    return rows;
  },

  findUpcomingEventsForEmployee: async (dni) => {
    const [rows] = await pool.query(`
      SELECT e.* FROM Evento e
      INNER JOIN EmpleadoEventoPreparado ep ON e.cod = ep.codEvento
      WHERE ep.dni = ? AND e.fechaIni >= CURDATE()
      UNION
      SELECT e.* FROM Evento e
      INNER JOIN EmpleadoEventoEjecutado ee ON e.cod = ee.codEvento
      WHERE ee.dni = ? AND e.fechaIni >= CURDATE()
      ORDER BY fechaIni ASC
      LIMIT 10;
    `, [dni, dni]);
    return rows;
  }

};

module.exports = Staff;
