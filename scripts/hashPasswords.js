const bcrypt = require("bcrypt");
const pool = require("../src/config/db");
require("dotenv").config();

/**
 * Script para hashear todas las contraseñas existentes en la base de datos
 * que estén almacenadas en texto plano
 */
async function hashExistingPasswords() {
  try {
    console.log("🔍 Buscando contraseñas en texto plano...");

    // Obtener todos los empleados con contraseñas
    const [employees] = await pool.query(`
      SELECT e.dni, e.email, e.contrasena 
      FROM Empleado e 
      WHERE e.contrasena IS NOT NULL 
      AND e.contrasena != ''
      AND e.contrasena NOT LIKE '$2b$%'
    `);

    if (employees.length === 0) {
      console.log(
        "✅ No se encontraron contraseñas en texto plano. Todas las contraseñas ya están hasheadas."
      );
      return;
    }

    console.log(
      `📋 Encontradas ${employees.length} contraseñas en texto plano:`
    );

    let updated = 0;
    let errors = 0;

    for (const employee of employees) {
      try {
        console.log(`  - Procesando: ${employee.email}`);

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(employee.contrasena, 10);

        // Actualizar en la base de datos
        const [result] = await pool.query(
          `UPDATE Empleado SET contrasena = ? WHERE dni = ?`,
          [hashedPassword, employee.dni]
        );

        if (result.affectedRows > 0) {
          console.log(`    ✅ Contraseña actualizada para ${employee.email}`);
          updated++;
        } else {
          console.log(`    ❌ No se pudo actualizar ${employee.email}`);
          errors++;
        }
      } catch (error) {
        console.log(
          `    ❌ Error procesando ${employee.email}:`,
          error.message
        );
        errors++;
      }
    }

    console.log("\n📊 Resumen:");
    console.log(`  ✅ Contraseñas actualizadas: ${updated}`);
    console.log(`  ❌ Errores: ${errors}`);
    console.log(`  📋 Total procesadas: ${employees.length}`);

    if (updated > 0) {
      console.log(
        "\n🎉 ¡Proceso completado! Las contraseñas han sido hasheadas correctamente."
      );
      console.log(
        "⚠️  IMPORTANTE: Actualiza tu código de login para usar bcrypt.compare() solamente."
      );
    }
  } catch (error) {
    console.error("❌ Error general:", error.message);
  } finally {
    // Cerrar el pool de conexiones
    await pool.end();
    console.log("🔒 Conexión a la base de datos cerrada.");
  }
}

/**
 * Función para verificar el estado de las contraseñas sin modificar nada
 */
async function checkPasswordStatus() {
  try {
    console.log("🔍 Verificando estado de las contraseñas...");

    const [allPasswords] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN contrasena LIKE '$2b$%' THEN 1 ELSE 0 END) as hashed,
        SUM(CASE WHEN contrasena NOT LIKE '$2b$%' AND contrasena IS NOT NULL AND contrasena != '' THEN 1 ELSE 0 END) as plain_text,
        SUM(CASE WHEN contrasena IS NULL OR contrasena = '' THEN 1 ELSE 0 END) as empty
      FROM Empleado
    `);

    const stats = allPasswords[0];

    console.log("\n📊 Estado actual de las contraseñas:");
    console.log(`  📋 Total de empleados: ${stats.total}`);
    console.log(`  ✅ Contraseñas hasheadas: ${stats.hashed}`);
    console.log(`  ⚠️  Contraseñas en texto plano: ${stats.plain_text}`);
    console.log(`  ❌ Contraseñas vacías: ${stats.empty}`);

    return stats;
  } catch (error) {
    console.error("❌ Error verificando estado:", error.message);
  }
}

// Ejecutar según el argumento pasado
async function main() {
  const action = process.argv[2];

  switch (action) {
    case "check":
      await checkPasswordStatus();
      await pool.end();
      break;
    case "hash":
      await hashExistingPasswords();
      break;
    default:
      console.log("📝 Uso del script:");
      console.log(
        "  node scripts/hashPasswords.js check  - Verificar estado actual"
      );
      console.log(
        "  node scripts/hashPasswords.js hash   - Hashear contraseñas en texto plano"
      );
      await pool.end();
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  main().catch(console.error);
}
