const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'fusamaps_db',
  user:     process.env.DB_USER     || 'fusamaps_user',
  password: process.env.DB_PASSWORD || '',
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    console.log('✅ PostgreSQL conectado');
    client.release();
  } catch (err) {
    console.error('❌ Error PostgreSQL:', err.message);
    process.exit(1);
  }
};

module.exports = { pool, connectDB };
