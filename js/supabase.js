/* ==========================================
   FUTURYCRAFT
   SUPABASE
========================================== */


const SUPABASE_URL = "https://jssscxlnzytmwzbabvhu.supabase.co";


const SUPABASE_ANON_KEY = "SUA_KEY_AQUI";



/* ==========================================
   CRIA CLIENTE
========================================== */


window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
