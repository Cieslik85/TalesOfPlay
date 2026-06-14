const { Pool } = require('pg');
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL;
const hasDatabaseUrl = typeof databaseUrl === 'string' && databaseUrl.trim() !== '';

if (!hasDatabaseUrl) {
    throw new Error('DATABASE_URL is missing. Create backend/.env from backend/.env.example and set a valid PostgreSQL connection string.');
}

const pool = new Pool({
    connectionString: databaseUrl,
});

pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Unexpected PG error', err);
    process.exit(-1);
});

module.exports = pool;