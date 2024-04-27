const { Pool } = require('pg');

// Database connection credentials
const dbConfig = {
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

const pool = new Pool(dbConfig);

async function createPredictionsTable() {
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS predictions (
      id SERIAL PRIMARY KEY,
      prediction_text TEXT NOT NULL,
      prediction_year INT NOT NULL,
      user_id UUID REFERENCES auth.users(id)
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(createTableSql);
    console.log('Predictions table created successfully.');
    client.release();
  } catch (error) {
    console.error('Error creating predictions table:', error);
  }
}

createPredictionsTable();
