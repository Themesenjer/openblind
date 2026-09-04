const pool = require('./db');

const initialUsers = [
  { nombre: 'Pablo Reyes', email: 'usuario@openblind.com', password: '123', rol: 'administrador' },
  { nombre: 'Steven Andrade', email: 'steven@openblind.org', password: 'admin123', rol: 'administrador' },
  { nombre: 'Jandry López', email: 'jandry@openblind.org', password: 'jandry123', rol: 'desarrollador' },
  { nombre: 'Luis Mejía', email: 'luis@openblind.org', password: 'luis123', rol: 'auditor' },
  { nombre: 'María Fernández', email: 'maria.fernandez@openblind.com', password: 'maria2026', rol: 'estudiante' },
  { nombre: 'Carlos Gómez', email: 'carlos.gomez@openblind.com', password: 'carlos2026', rol: 'profesor' },
  { nombre: 'Ana Torres', email: 'ana.torres@openblind.com', password: 'ana2026', rol: 'estudiante' }
];

async function seedDatabase() {
  console.log('🌱 Iniciando carga de datos de prueba (Seed)...');

  try {
    // 1. Crear la tabla de usuarios si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        rol VARCHAR(50) DEFAULT 'estudiante',
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Tabla "usuarios" asegurada en la base de datos.');

    // 2. Insertar usuarios evadiendo duplicados
    for (const u of initialUsers) {
      await pool.query(
        `INSERT INTO usuarios (nombre, email, password, rol)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO UPDATE 
         SET nombre = EXCLUDED.nombre, password = EXCLUDED.password, rol = EXCLUDED.rol;`,
        [u.nombre, u.email, u.password, u.rol]
      );
    }

    console.log(`✅ ¡${initialUsers.length} usuarios cargados correctamente en PostgreSQL!`);

    // 3. Imprimir lista de usuarios en consola
    const result = await pool.query('SELECT id, nombre, email, rol FROM usuarios ORDER BY id ASC;');
    console.table(result.rows);

  } catch (error) {
    console.error('❌ Error cargando datos de prueba:', error.message);
  } finally {
    pool.end();
  }
}

seedDatabase();
