const pool = require('../src/config/db');
const bcrypt = require('bcryptjs');

async function migratePasswords() {
  const client = await pool.connect();

  try {
    // Iniciar la transacción PostgreSQL
    await client.query('BEGIN');

    // Consultar id y password de todos los usuarios
    const result = await client.query('SELECT id, password FROM usuarios');
    const usuarios = result.rows;

    let migratedCount = 0;
    let alreadyEncryptedCount = 0;

    for (const usuario of usuarios) {
      const { id, password } = usuario;

      // Verificar si la contraseña ya es un hash Bcrypt ($2a$, $2b$, $2y$)
      const isBcrypt = password && (
        password.startsWith('$2a$') ||
        password.startsWith('$2b$') ||
        password.startsWith('$2y$')
      );

      if (isBcrypt) {
        alreadyEncryptedCount++;
      } else {
        // Generar hash bcrypt con 10 salt rounds
        const hashedPassword = await bcrypt.hash(password, 10);

        // Actualizar únicamente la columna password del usuario
        await client.query(
          'UPDATE usuarios SET password = $1 WHERE id = $2',
          [hashedPassword, id]
        );

        migratedCount++;
      }
    }

    // Confirmar la transacción
    await client.query('COMMIT');

    // Mostrar únicamente los conteos requeridos (sin passwords ni hashes)
    console.log(`Usuarios migrados a bcrypt: ${migratedCount}`);
    console.log(`Usuarios que ya estaban cifrados: ${alreadyEncryptedCount}`);

  } catch (error) {
    // Revertir cualquier cambio en caso de error
    await client.query('ROLLBACK');
    console.error('Error en la migración de contraseñas. Se ejecutó ROLLBACK:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

migratePasswords();
