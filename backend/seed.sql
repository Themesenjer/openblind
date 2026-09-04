-- ============================================================
-- SCRIPT DE BASE DE DATOS Y DATOS DE PRUEBA (SEED) - OPENBLIND
-- ============================================================

-- 1. Crear tabla de usuarios si no existe
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'estudiante',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Limpiar e insertar datos de prueba iniciales (Seed Users)
TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE;

INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Pablo Reyes', 'usuario@openblind.com', '123456', 'administrador'),
('Steven Andrade', 'steven@openblind.org', 'admin123', 'administrador'),
('Jandry López', 'jandry@openblind.org', 'jandry123', 'desarrollador'),
('Luis Mejía', 'luis@openblind.org', 'luis123', 'auditor'),
('María Fernández', 'maria.fernandez@openblind.com', 'maria2026', 'estudiante'),
('Carlos Gómez', 'carlos.gomez@openblind.com', 'carlos2026', 'profesor'),
('Ana Torres', 'ana.torres@openblind.com', 'ana2026', 'estudiante');

-- 3. Consultar datos insertados para verificación
SELECT id, nombre, email, rol, creado_en FROM usuarios;
