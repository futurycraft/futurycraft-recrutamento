// ==========================================
// FUTURYCRAFT - PAINEL ADMIN
// ==========================================


let candidatos = [];

let filtroAtual = "Todos";




// ==========================================
// CARREGAR CANDIDATOS
// ==========================================


async function carregarCandidatos(){


const {data,error}=await supabaseClient

.from("candidatos")

.select("*")

.order("id",{ascending:false});



if(error){

console.error(error);

return;

}



candidatos=data;



atualizarDashboard();

mostrarCandidatos();



}






// ==========================================
// DASHBOARD
// ==========================================


function atualizarDashboard(){


let pendentes=0;

let aprovados=0;

let recusados=0;



candidatos.forEach(c=>{


let status=(c.status || "Pendente")
.toLowerCase()
.trim();



if(status==="pendente"){

pendentes++;

}


else if(status==="aprovado"){

aprovados++;

}


else if(status==="recusado"){

recusados++;

}


});



document.querySelector("#pendentes").innerHTML=pendentes;

document.querySelector("#aprovados").innerHTML=aprovados;

document.querySelector("#recusados").innerHTML=recusados;



}







// ==========================================
// FILTRO
// ==========================================


function filtrar(status){


filtroAtual=status;


mostrarCandidatos();



}








// ==========================================
// LISTAR CANDIDATOS
// ==========================================


function mostrarCandidatos(){


const lista =
document.querySelector("#lista-candidatos");



lista.innerHTML="";



let listaFiltrada=candidatos;



if(filtroAtual!=="Todos"){


listaFiltrada=candidatos.filter(c=>{


return (c.status || "Pendente")
.toLowerCase()
===
filtroAtual.toLowerCase();


});


}




if(listaFiltrada.length===0){


lista.innerHTML=`

<p>
Nenhuma candidatura encontrada.
</p>

`;

return;


}






listaFiltrada.forEach(candidato=>{



let status=
candidato.status || "Pendente";



lista.innerHTML += `


<div class="candidato-card">



<div class="dados-candidato">


<h3>

${candidato.nome_completo || candidato.nick}

</h3>


<p>

🎮 Nick:
<b>${candidato.nick}</b>

</p>


<p>

💬 Discord:
${candidato.discord}

</p>


</div>





<div class="acoes-candidato">



<span class="status status-${status}">

${status}

</span>



<br><br>



<button class="ver"

onclick="verCandidato(${candidato.id})">

Ver candidatura

</button>



</div>



</div>


`;



});



}








// ==========================================
// ABRIR CANDIDATO
// ==========================================


function verCandidato(id){


window.location.href=
"candidato.html?id="+id;


}








// ==========================================
// LOGOUT
// ==========================================


async function logout(){


await supabaseClient.auth.signOut();


localStorage.clear();

sessionStorage.clear();


window.location.replace("login.html");


}







carregarCandidatos();
