// supabaseClient.js
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; 
// (o SERVICE_ROLE si lo usas en backend con cuidado)

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Faltan SUPABASE_URL o SUPABASE_ANON_KEY en variables de entorno");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;