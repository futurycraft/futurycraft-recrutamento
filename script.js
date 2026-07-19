// ==========================================
// FUTURYCRAFT - SISTEMA DE CANDIDATURA STAFF
// Conexão Supabase
// ==========================================

const supabaseClient = window.supabase.createClient(
    "https://jssscxlnzytmwzbabvhu.supabase.co/rest/v1/",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzc3NjeGxuenl0bXd6YmFidmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NzE2NzcsImV4cCI6MjEwMDA0NzY3N30.Ku_HJdFQYyEmLmjkynye90l0bpM0MbbFVJPZDMCEOXQ"
);


// ==========================================
// ENVIO DO FORMULÁRIO
// ==========================================

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


console.log("Supabase conectado");


const formulario = document.querySelector("#form-candidatura");


formulario.addEventListener("submit", async (e) => {

    e.preventDefault();


    const dados = {

        nick: document.querySelector("#nick").value,

        discord: document.querySelector("#discord").value,

        idade: document.querySelector("#idade").value,

        tempo: document.querySelector("#tempo").value,

        disponibilidade: document.querySelector("#disponibilidade").value,

        motivo: document.querySelector("#motivo").value,

        ajuda: document.querySelector("#ajuda").value,

        hack: document.querySelector("#hack").value

    };


    console.log("Enviando:", dados);


    const { data, error } = await supabaseClient
        .from("candidaturas")
        .insert([dados]);


    if(error){

        console.error(error);

        alert("Erro ao enviar candidatura!");

        return;

    }


    alert("Candidatura enviada com sucesso!");


    formulario.reset();


});

}

console.log("Supabase FuturyCraft conectado!");
