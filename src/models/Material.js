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
};

module.exports = Material;
