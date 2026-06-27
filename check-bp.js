const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  const { data, error } = await supabase.from('daily_habits').select('*').limit(1);
  if (error) {
    console.error('Error fetching:', error);
  } else {
    console.log('Columns:', Object.keys(data[0] || {}));
  }
}
checkColumns();
