const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
  // Login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validar que se envíen los datos requeridos
      if (!email || !password) {
        return res.status(400).json({
          status: false,
          message: "Email y contraseña son requeridos",
        });
      }

      const user = await User.findByEmail(email);

      if (!user) {
        return res.status(401).json({
          status: false,
          message: "Credenciales incorrectas",
        });
      }

      // Verificar contraseña hasheada
      const validPassword = await bcrypt.compare(password, user.contrasena);
      if (!validPassword) {
        return res.status(401).json({
          status: false,
          message: "Credenciales incorrectas",
        });
      }

      // Remover la contraseña de la respuesta por seguridad
      const { contrasena, ...userWithoutPassword } = user;

      // Generar token JWT (válido por 1 hora)
      // const token = jwt.sign(
      //   { id: user.dni, email: user.email },
      //   process.env.JWT_SECRET,
      //   { expiresIn: "1h" }
      // );

      res.status(200).json({
        status: true,
        message: "Inicio de sesión exitoso",
        data: userWithoutPassword,
        // token, // Descomenta cuando implementes JWT
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
      });
    }
  },

  // Registro
  register: async (req, res) => {
    try {
      const { email, password, name } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = await User.create({
        email,
        password: hashedPassword,
        name,
      });
      res.status(201).json({ id: userId, message: "Usuario registrado" });
    } catch (error) {
      res.status(500).json({ error: "Error al registrar usuario" });
    }
  },
};

module.exports = authController;
