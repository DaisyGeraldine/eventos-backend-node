const axios = require("axios");

/**
 * Script para probar el login después de hashear las contraseñas
 */
async function testLogin() {
  const baseURL = "http://localhost:3000"; // Ajusta el puerto si es diferente

  // Datos de prueba (usar un usuario real de tu base de datos)
  const testUser = {
    email: "juan.navarro0@empresa.es", // Cambia por un email real
    password: "Pwd0100", // La contraseña original antes de hashear
  };

  try {
    console.log("🧪 Probando login con credenciales correctas...");
    console.log(`Email: ${testUser.email}`);
    console.log(`Password: ${testUser.password}`);

    const response = await axios.post(`${baseURL}/api/auth/login`, testUser, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Login exitoso!");
    console.log("📋 Respuesta del servidor:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.log("❌ Error en el login:");
      console.log(`Status: ${error.response.status}`);
      console.log("Respuesta:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.log("❌ Error de conexión:", error.message);
      console.log("💡 ¿Está el servidor ejecutándose en el puerto correcto?");
    }
  }

  // Probar con credenciales incorrectas
  try {
    console.log("\n🧪 Probando login con contraseña incorrecta...");

    const wrongPasswordTest = {
      ...testUser,
      password: "contraseña_incorrecta",
    };

    const response = await axios.post(
      `${baseURL}/api/auth/login`,
      wrongPasswordTest
    );
    console.log("⚠️ PROBLEMA: El login debería haber fallado pero fue exitoso");
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log("✅ Correcto: Login falló con contraseña incorrecta");
      console.log("Respuesta:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.log("❌ Error inesperado:", error.message);
    }
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  testLogin().catch(console.error);
}

module.exports = { testLogin };
