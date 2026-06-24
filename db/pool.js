require('dotenv').config(); // Loads environment variables
const { Pool } = require('pg');


const pool = new Pool({
   connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
