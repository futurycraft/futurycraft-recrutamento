// ==========================================
// FUTURYCRAFT - SISTEMA DE CANDIDATURA STAFF
// ==========================================


// Conexão Supabase final2

const SUPABASE_URL = "https://jssscxlnzytmwzbabvhu.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzc3NjeGxuenl0bXd6YmFidmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NzE2NzcsImV4cCI6MjEwMDA0NzY3N30.Ku_HJdFQYyEmLmjkynye90l0bpM0MbbFVJPZDMCEOXQ";


const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


console.log("Supabase FuturyCraft conectado!");



// ==========================================
// ENVIO DA CANDIDATURA
// ==========================================


const formulario = document.querySelector("#form-candidatos");


if(formulario){


    formulario.addEventListener("submit", async (e)=>{


        e.preventDefault();



        const dados = {


            // Página 1

            nome_completo:
            document.querySelector("#nome_completo").value,


            nick:
            document.querySelector("#nick").value,


            discord:
            document.querySelector("#discord").value,


            idade:
            document.querySelector("#idade").value,


            data_nascimento:
            document.querySelector("#data_nascimento").value,


            genero:
            document.querySelector("#genero").value,



            // Página 2

            tempo:
            document.querySelector("#tempo").value,


            disponibilidade:
            document.querySelector("#disponibilidade").value,


            motivo:
            document.querySelector("#motivo").value,


            ajuda:
            document.querySelector("#ajuda").value,


            hack:
            document.querySelector("#hack").value,



            status:"Pendente"


        };



        console.log("Enviando candidatura:", dados);



        const {data,error} = await supabaseClient

        .from("candidatos")

        .insert([dados]);



        if(error){


            console.error("Erro Supabase:", error);


            alert("Erro ao enviar candidatura!");

            return;


        }



        alert("Candidatura enviada com sucesso!");



        formulario.reset();



    });


}

//novo botao index

<script>

function openRole(role){

console.log("Abrindo cargo:", role);


let modal = document.getElementById(role);
let overlay = document.getElementById("overlay");


if(!modal){

console.log("Modal não encontrado");

return;

}


modal.classList.add("active");

overlay.style.display = "block";


}



function closeRole(){


let modais = document.querySelectorAll(".role-info");


modais.forEach(function(modal){

modal.classList.remove("active");

});


let overlay = document.getElementById("overlay");


overlay.style.display="none";


}


</script>

//1111

// ==========================================
// NAVEGAÇÃO ENTRE PÁGINAS
// ==========================================

function mostrarPagina2(){

    const pagina1 = document.getElementById("pagina1");
    const pagina2 = document.getElementById("pagina2");


    if(pagina1 && pagina2){

        pagina1.style.display = "none";

        pagina2.style.display = "block";

    }

}









/*teste anuncio*/

console.log("SCRIPT FUTURYCRAFT CARREGADO");
