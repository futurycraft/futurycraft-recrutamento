const SUPABASE_URL = "https://jssscxlnzytmwzbabvhu.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzc3NjeGxuenl0bXd6YmFidmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NzE2NzcsImV4cCI6MjEwMDA0NzY3N30.Ku_HJdFQYyEmLmjkynye90l0bpM0MbbFVJPZDMCEOXQ";


const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);



async function verificarAcesso(){


    const { data } = await supabaseClient.auth.getSession();


    if(!data.session){

        window.location.href = "login.html";

        return;

    }


}


verificarAcesso();

window.addEventListener("pageshow", async function(){

    const {data} = await supabaseClient.auth.getSession();


    if(!data.session){

        window.location.replace("login.html");

    }

});
