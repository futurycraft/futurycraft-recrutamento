// Conexão paineladmin supbase final1

const SUPABASE_URL = "https://jssscxlnzytmwzbabvhu.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzc3NjeGxuenl0bXd6YmFidmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NzE2NzcsImV4cCI6MjEwMDA0NzY3N30.Ku_HJdFQYyEmLmjkynye90l0bpM0MbbFVJPZDMCEOXQ";


const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);



async function verificarLogin(){

    const { data } = await supabaseClient.auth.getSession();


    if(!data.session){

        window.location.href = "login.html";

    }

}


verificarLogin();



let candidatos = [];

let filtroAtual = "Todos";



async function carregarCandidatos(){


const { data, error } = await supabaseClient
.from("candidatos")
.select("*")
.order("id",{ascending:false});



if(error){

console.error(error);

return;

}



candidatos = data;



atualizarDashboard();

mostrarCandidatos();


}




function atualizarDashboard(){


let pendentes = candidatos.filter(c =>
    !c.status || c.status.toLowerCase().trim() === "pendente"
).length;



let aprovados = candidatos.filter(c =>
    c.status && c.status.toLowerCase().trim() === "aprovado"
).length;



let recusados = candidatos.filter(c =>
    c.status && c.status.toLowerCase().trim() === "recusado"
).length;



document.querySelector("#pendentes").innerHTML = pendentes;

document.querySelector("#aprovados").innerHTML = aprovados;

document.querySelector("#recusados").innerHTML = recusados;


}




function filtrar(status){

filtroAtual = status;

mostrarCandidatos();

}




function mostrarCandidatos(){


const lista = document.querySelector("#lista-candidatos");


lista.innerHTML = "";



let listaFiltrada = candidatos;



if(filtroAtual !== "Todos"){

listaFiltrada = candidatos.filter(
c=>c.status === filtroAtual
);

}



listaFiltrada.forEach(candidato=>{


lista.innerHTML += `


<div class="card-candidato">


<h3>
${candidato.nick}
</h3>


<p>
Discord:
${candidato.discord}
</p>


<p>
Status:
${candidato.status}
</p>


<button onclick="alterarStatus(${candidato.id}, 'Aprovado')">
✅ Aprovar
</button>


<button onclick="alterarStatus(${candidato.id}, 'Recusado')">
❌ Recusar
</button>



</div>


`;


});


}




async function alterarStatus(id,status){


await supabaseClient
.from("candidatos")
.update({
status:status
})
.eq("id",id);



carregarCandidatos();


}




async function logout(){

await supabaseClient.auth.signOut();

window.location.href="login.html";

}



carregarCandidatos();

async function logout(){

    await supabaseClient.auth.signOut();

    window.location.href = "login.html";

}
