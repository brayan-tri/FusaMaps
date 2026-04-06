const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'fusamaps_db',
  user:     process.env.DB_USER     || 'fusamaps_user',
  password: process.env.DB_PASSWORD || '',
});

const connectDB = async (retries = 10, delay = 3000) => {
  for (let i = 1; i <= retries; i++) {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      console.log('✅ PostgreSQL conectado');
      client.release();
      return;
    } catch (err) {
      console.log(`⏳ Esperando PostgreSQL... intento ${i}/${retries}`);
      if (i === retries) {
        console.error('❌ No se pudo conectar a PostgreSQL');
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, delay));
    }
  }
};

module.exports = { pool, connectDB };
