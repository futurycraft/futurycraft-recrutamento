const SUPABASE_URL = "https://jssscxlnzytmwzbabvhu.supabase.co";


const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzc3NjeGxuenl0bXd6YmFidmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NzE2NzcsImV4cCI6MjEwMDA0NzY3N30.Ku_HJdFQYyEmLmjkynye90l0bpM0MbbFVJPZDMCEOXQ";


const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);



const formulario = document.querySelector("#login-form");



formulario.addEventListener("submit", async (e)=>{


    e.preventDefault();



    const email = document.querySelector("#email").value;

    const senha = document.querySelector("#senha").value;



    const { data, error } = await supabaseClient.auth.signInWithPassword({

        email: email,

        password: senha

    });



    if(error){


        alert("Email ou senha incorretos!");

        console.error(error);

        return;

    }



    alert("Login realizado com sucesso!");



    window.location.href = "admin.html";



});
