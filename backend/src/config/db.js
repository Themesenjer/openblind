const { Pool } = require('pg');
require('dotenv').config();

// Función auxiliar para limpiar comillas o caracteres raros de dotenv
const cleanEnv = (val, fallback = '') => {
  if (!val) return fallback;
  return String(val).replace(/["'“”]/g, '').trim();
};

const dbName = cleanEnv(process.env.DB_NAME, 'openblind_db');
const dbUser = cleanEnv(process.env.DB_USER, 'postgres');
const dbHost = cleanEnv(process.env.DB_HOST, 'localhost');
const dbPassword = cleanEnv(process.env.DB_PASSWORD, '');
const dbPort = Number(cleanEnv(process.env.DB_PORT, '5432')) || 5432;

console.log(`🔌 Conectando a BD: [${dbName}] como usuario: [${dbUser}]`);

const pool = new Pool({
  user: dbUser,
  host: dbHost,
  database: dbName,
  password: dbPassword,
  port: dbPort,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Error al conectar a PostgreSQL:', err.message);
  }
  console.log(`✅ Conexión exitosa a la base de datos "${dbName}"`);
  release();
});

module.exports = pool;