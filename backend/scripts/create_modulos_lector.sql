-- Script de migración: Crear tablas para Módulos y Lector Inteligente

CREATE TABLE IF NOT EXISTS modulos (
  slug VARCHAR(100) PRIMARY KEY,
  categoria VARCHAR(50) NOT NULL,
  titulo JSONB NOT NULL,
  badge JSONB NOT NULL,
  descripcion JSONB NOT NULL,
  icon_name VARCHAR(50) DEFAULT 'lectura',
  icon_bg VARCHAR(100) DEFAULT 'bg-blue-100/70 text-[#2563eb]',
  items JSONB DEFAULT '[]'::jsonb,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS progreso_modulos (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  modulo_slug VARCHAR(100) NOT NULL REFERENCES modulos(slug) ON DELETE CASCADE,
  progreso INT DEFAULT 0 CHECK (progreso BETWEEN 0 AND 100),
  es_favorito BOOLEAN DEFAULT FALSE,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(usuario_id, modulo_slug)
);

CREATE TABLE IF NOT EXISTS textos_lector (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo VARCHAR(150) NOT NULL,
  contenido TEXT NOT NULL,
  idioma VARCHAR(10) DEFAULT 'es-ES',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
