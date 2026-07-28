/* ==========================================
   FUTURYCRAFT
   SUPABASE
========================================== */

/*
|--------------------------------------------------------------------------
| CONFIGURAÇÃO DO SUPABASE
|--------------------------------------------------------------------------
|
| Cole aqui os dados do seu projeto Supabase.
|
*/

const SUPABASE_URL = "COLE_SUA_SUPABASE_URL_AQUI";

const SUPABASE_ANON_KEY = "COLE_SUA_SUPABASE_ANON_KEY_AQUI";





/*
|--------------------------------------------------------------------------
| INICIALIZAÇÃO
|--------------------------------------------------------------------------
*/

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);





/*
|--------------------------------------------------------------------------
| DISPONIBILIZA GLOBALMENTE
|--------------------------------------------------------------------------
*/

window.supabaseClient = supabase;
