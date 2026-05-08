import { pool } from '../src/config/db';

beforeAll(async () => {
  if (process.env.INTEGRATION_TESTS !== 'true') {
    return;
  }

  try {
    await pool.query('SELECT 1');
  } catch {
    throw new Error(
      [
        'No se pudo conectar a la base de datos de test.',
        'Levanta la DB de test con: pnpm db:modular:test:up',
        'Si necesitas reiniciarla limpia: pnpm db:modular:test:reset',
      ].join(' '),
    );
  }
});

afterAll(async () => {
  await pool.end();
});
