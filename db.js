const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "FPL",
    password: "Moa0d9aMnw",
    port: 5432,
  });

module.exports = pool;