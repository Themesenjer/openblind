const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Probar conexión a la base de datos
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error al conectar a PostgreSQL:', err.stack);
  }
  console.log('✅ Conexión exitosa a la base de datos PostgreSQL');
  release();
});

module.exports = pool;