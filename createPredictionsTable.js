const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createPredictionsTable() {
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS predictions (
      id SERIAL PRIMARY KEY,
      prediction_text TEXT NOT NULL,
      prediction_year INT NOT NULL,
      user_id UUID REFERENCES auth.users(id)
    );
  `;

  const { error } = await supabase.rpc('run_sql', { sql: createTableSql });

  if (error) {
    console.error('Error creating predictions table:', error);
    return;
  }

  console.log('Predictions table created successfully.');
}

createPredictionsTable();
