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

const SUPABASE_URL = "https://jssscxlnzytmwzbabvhu.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzc3NjeGxuenl0bXd6YmFidmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NzE2NzcsImV4cCI6MjEwMDA0NzY3N30.Ku_HJdFQYyEmLmjkynye90l0bpM0MbbFVJPZDMCEOXQ";





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
