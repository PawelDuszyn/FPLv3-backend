const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://fpl_ppj0_user:pVVJT6yzEllocA418PPJa8QrhS2roRQw@dpg-crgagprv2p9s73aaeql0-a.frankfurt-postgres.render.com/fpl_ppj0',
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect((err) => {
  if (err) {
    console.error('Błąd połączenia z bazą danych', err);
  } else {
    console.log('Połączono z bazą danych');
  }
});