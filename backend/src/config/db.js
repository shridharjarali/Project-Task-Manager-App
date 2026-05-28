const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

/**
 * Run the initial migration SQL file to set up tables.
 */
async function runMigrations() {
  const migrationPath = path.join(__dirname, '../../migrations/001_init.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');

  try {
    await pool.query(sql);
    console.log('✅ Database migrations completed successfully');
  } catch (err) {
    console.error('❌ Migration error:', err.message);
    throw err;
  }
}

module.exports = { pool, runMigrations };
