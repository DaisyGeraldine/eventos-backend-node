const pool = require("../src/config/db");
require("dotenv").config();

/**
 * Script para actualizar el campo contrasena de VARCHAR(16) a VARCHAR(60)
 * para permitir almacenar hashes de bcrypt
 */
async function updatePasswordField() {
  try {
    console.log("🔍 Verificando estructura actual de la tabla Empleado...");

    // Verificar estructura actual
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'Empleado' 
      AND COLUMN_NAME = 'contrasena'
    `);

    if (columns.length === 0) {
      console.log(
        "❌ No se encontró el campo 'contrasena' en la tabla Empleado"
      );
      return;
    }

    const currentField = columns[0];
    console.log("📋 Estructura actual del campo 'contrasena':");
    console.log(`  - Tipo: ${currentField.DATA_TYPE}`);
    console.log(
      `  - Longitud máxima: ${currentField.CHARACTER_MAXIMUM_LENGTH}`
    );
    console.log(`  - Permite NULL: ${currentField.IS_NULLABLE}`);

    if (currentField.CHARACTER_MAXIMUM_LENGTH >= 60) {
      console.log(
        "✅ El campo ya tiene la longitud correcta (>= 60 caracteres)"
      );
      return;
    }

    console.log(
      "\n⚠️  El campo 'contrasena' solo permite 16 caracteres, pero bcrypt necesita 60."
    );
    console.log("🔧 Actualizando estructura de la tabla...");

    // Actualizar el campo
    await pool.query(
      `ALTER TABLE Empleado MODIFY COLUMN contrasena VARCHAR(60)`
    );

    console.log(
      "✅ Campo 'contrasena' actualizado correctamente a VARCHAR(60)"
    );

    // Verificar el cambio
    const [updatedColumns] = await pool.query(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'Empleado' 
      AND COLUMN_NAME = 'contrasena'
    `);

    const updatedField = updatedColumns[0];
    console.log("\n📋 Nueva estructura del campo 'contrasena':");
    console.log(`  - Tipo: ${updatedField.DATA_TYPE}`);
    console.log(
      `  - Longitud máxima: ${updatedField.CHARACTER_MAXIMUM_LENGTH}`
    );

    console.log("\n🎉 ¡Actualización completada!");
    console.log("💡 Ahora puedes ejecutar: node scripts/hashPasswords.js hash");
  } catch (error) {
    console.error("❌ Error actualizando el campo:", error.message);
  } finally {
    await pool.end();
    console.log("🔒 Conexión cerrada.");
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  updatePasswordField().catch(console.error);
}

module.exports = { updatePasswordField };
