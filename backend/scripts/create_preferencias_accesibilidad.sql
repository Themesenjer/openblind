-- Script de migración: Crear tabla de preferencias de accesibilidad
CREATE TABLE IF NOT EXISTS preferencias_accesibilidad (
  usuario_id INT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
  lector_pantalla BOOLEAN DEFAULT TRUE,
  alto_contraste BOOLEAN DEFAULT FALSE,
  modo_oscuro BOOLEAN DEFAULT FALSE,
  texto_grande BOOLEAN DEFAULT FALSE,
  comandos_voz BOOLEAN DEFAULT TRUE,
  navegacion_teclado BOOLEAN DEFAULT TRUE,
  velocidad_lectura NUMERIC(3,1) DEFAULT 1.2,
  volumen INT DEFAULT 80,
  idioma VARCHAR(10) DEFAULT 'es',
  color_acento VARCHAR(20) DEFAULT 'azul',
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
