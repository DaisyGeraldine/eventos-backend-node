-- Script para actualizar el campo contrasena en la tabla Empleado
-- para permitir almacenar hashes de bcrypt (60 caracteres)

USE prueba; -- Cambia por el nombre de tu base de datos

-- Mostrar estructura actual
DESCRIBE Empleado;

-- Actualizar el campo contrasena para permitir hashes de bcrypt
ALTER TABLE Empleado 
MODIFY COLUMN contrasena VARCHAR(60);

-- Verificar que el cambio se aplicó correctamente
DESCRIBE Empleado;

-- Mostrar algunos registros para verificar
SELECT dni, email, LEFT(contrasena, 20) as contrasena_preview 
FROM Empleado 
WHERE contrasena IS NOT NULL 
LIMIT 5;