const { createClient } = require('@supabase/supabase-js');

// Initialize the Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyPredictionsTable() {
  // Attempt to select from the 'predictions' table
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error selecting from predictions table:', error);
    return;
  }

  if (data.length > 0) {
    console.log('The predictions table exists and has data:', data);
  } else {
    console.log('The predictions table exists but is empty.');
  }
}

verifyPredictionsTable();
