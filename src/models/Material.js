const pool = require("../config/db");

const Material = {
  findAvailableInventoryMaterial: async () => {
    const [rows] = await pool.query(`
      SELECT 
        m.cod,
        m.descripcion,
        mi.estado
      FROM Material m
      JOIN MaterialEnInventario mi ON m.cod = mi.cod
      WHERE mi.estado = 'disponible'
    `);

    return rows;
  },

  findAvailableRentalMaterial: async () => {
    const [rows] = await pool.query(`
      SELECT 
        m.cod,
        m.descripcion,
        ml.precio,
        ml.empresaProveedora
      FROM Material m
      JOIN MaterialEnAlquiler ml ON m.cod = ml.cod
    `);

    return rows;
  },

  findAllMaterials: async () => {
    const [rows] = await pool.query(`
      SELECT * FROM Material
    `);
    return rows;
  },

  createMaterial: async (cod, descripcion, fechaIni, fechaFin, precio) => {
    const [result] = await pool.query(
      `INSERT INTO Material (cod, descripcion, fechaIni, fechaFin, precio) VALUES (?, ?, ?, ?, ?)`,
      [cod, descripcion, fechaIni, fechaFin, precio]
    );
    
    if (result.affectedRows === 0) {
        return null;
    }
    const [rows] = await pool.query(
      `SELECT * FROM Material WHERE cod = ?`,
      [cod]
    );
    return rows[0];
  },

  updateMaterial: async (cod, descripcion, fechaIni, fechaFin, precio) => {
    const [result] = await pool.query(
      `UPDATE Material SET descripcion = ?, fechaIni = ?, fechaFin = ?, precio = ? WHERE cod = ?`,
      [descripcion, fechaIni, fechaFin, precio, cod]
    );

    if (result.affectedRows === 0) {
        return null;
    }
    const [rows] = await pool.query(
      `SELECT * FROM Material WHERE cod = ?`,
      [cod]
    );

    return rows[0];
  },

  deleteMaterial: async (cod) => {
    const [result] = await pool.query(
      `DELETE FROM Material WHERE cod = ?`,
      [cod]
    );
    return result.affectedRows;
  },

  findInventoryMaterials : async () => {
    const [rows] = await pool.query(`
      SELECT m.*,
      mi.estado, mi.fechaFabricacion, mi.diasDisponibilidad FROM Material m 
      INNER JOIN MaterialEnInventario mi ON m.cod = mi.cod
    `);
    return rows;
  },

  addInventoryMaterial: async (cod, estado, fechaFabricacion, diasDisponibilidad) => {
    const [result] = await pool.query(
      `INSERT INTO MaterialEnInventario (cod, estado, fechaFabricacion, diasDisponibilidad) VALUES (?, ?, ?, ?)`,
      [cod, estado, fechaFabricacion, diasDisponibilidad]
    );

    if (result.affectedRows === 0) {
        return null;
    }
    const [rows] = await pool.query(
      `SELECT * FROM MaterialEnInventario WHERE cod = ?`,
      [cod]
    );
    return rows[0];
  },

  updateInventoryMaterial: async (cod, estado) => {
    const [result] = await pool.query(
      `UPDATE MaterialEnInventario SET estado = ? WHERE cod = ?`,
      [estado, cod]
    );
    if (result.affectedRows === 0) {
        return null;
    }
    const [rows] = await pool.query(
      `SELECT * FROM MaterialEnInventario WHERE cod = ?`,
      [cod]
    );
    
    return rows[0];
  },

  deleteInventoryMaterial: async (cod) => {
    const [result] = await pool.query(
      `DELETE FROM MaterialEnInventario WHERE cod = ?`,
      [cod]
    );
    return result.affectedRows;
  },

  findMaterialWithInventory: async (cod) => {
    const [rows] = await pool.query(`
      SELECT m.*,
      mi.estado, mi.fechaFabricacion, mi.diasDisponibilidad FROM Material m 
      LEFT JOIN MaterialEnInventario mi ON m.cod = mi.cod
      WHERE m.cod = ?
    `, [cod]);
    return rows[0];
  },
};

module.exports = Material;
