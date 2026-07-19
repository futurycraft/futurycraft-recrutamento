const SUPABASE_URL = "https://jssscxlnzytmwzbabvhu.supabase.co";


const SUPABASE_KEY = "SUA_KEY_AQUI";


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
