const { Pool } = require('pg');
const config = require('config');

const db = config.get('db');

const pool = new Pool({
  connectionString: db,
});

async function startdb() {
  const client = await pool.connect().then(console.log(`Connected to ${db}`));
  return client;
}

module.exports = startdb();
