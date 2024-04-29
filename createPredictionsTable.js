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

async function createTables() {

  const createAdminTableSql = `
    CREATE TABLE IF NOT EXISTS admins (
      id UUID REFERENCES auth.users(id) PRIMARY KEY
    );
  `;

  const createProfilesTableSql = `
    CREATE TABLE IF NOT EXISTS profiles (
      user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
      email TEXT,
      name TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createPredictionPromptTableSql = `
    CREATE TABLE IF NOT EXISTS prediction_prompt (
      id SERIAL PRIMARY KEY,
      prediction_text TEXT NOT NULL,
      user_id UUID REFERENCES auth.users(id),
      unit TEXT NOT NULL,
      is_active BOOLEAN NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createUserPredictionTableSql = `
    CREATE TABLE IF NOT EXISTS user_prediction (
      id SERIAL PRIMARY KEY,
      prediction_prompt_id INT REFERENCES prediction_prompt(id),
      user_id UUID REFERENCES auth.users(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      rationale TEXT,
      is_active BOOLEAN NOT NULL
    );
  `;

  const createPredictionValuesTableSql = `
    CREATE TABLE IF NOT EXISTS prediction_values (
      id SERIAL PRIMARY KEY,
      user_prediction_id INT REFERENCES user_prediction(id),
      prediction_prompt_id INT REFERENCES prediction_prompt(id),
      year INT NOT NULL,
      value NUMERIC NOT NULL,
      user_id UUID REFERENCES auth.users(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createGroundTruthTableSql = `
    CREATE TABLE IF NOT EXISTS ground_truth (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      source_link TEXT,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      user_id UUID REFERENCES auth.users(id)
    );
  `;

  const createGroundTruthValuesTableSql = `
    CREATE TABLE IF NOT EXISTS ground_truth_values (
      id SERIAL PRIMARY KEY,
      ground_truth_id INT REFERENCES ground_truth(id),
      year INT NOT NULL,
      value NUMERIC NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      user_id UUID REFERENCES auth.users(id)
    );
  `;

  try {
    const client = await pool.connect();

    await client.query(createAdminTableSql);
    console.log('admin table created successfully.');

    await client.query(createProfilesTableSql);
    console.log('Profiles table created successfully.');

    await client.query(createPredictionPromptTableSql);
    console.log('Prediction Prompt table created successfully.');

    await client.query(createUserPredictionTableSql);
    console.log('User Prediction table created successfully.');

    await client.query(createPredictionValuesTableSql);
    console.log('Prediction Values table created successfully.');

    await client.query(createGroundTruthTableSql);
    console.log('Ground Truth table created successfully.');

    await client.query(createGroundTruthValuesTableSql);
    console.log('Ground Truth Values table created successfully.');

    client.release();
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

createTables();