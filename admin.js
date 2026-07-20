// Conexão paineladmin supbase final1


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


    console.log("Candidatos para contar:", candidatos);


    let pendentes = 0;
    let aprovados = 0;
    let recusados = 0;



    candidatos.forEach((candidato)=>{


        let status = candidato.status;


        if(!status){

            pendentes++;

        }


        else if(status.toLowerCase().trim() === "pendente"){

            pendentes++;

        }


        else if(status.toLowerCase().trim() === "aprovado"){

            aprovados++;

        }


        else if(status.toLowerCase().trim() === "recusado"){

            recusados++;

        }


    });



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


<button onclick="verCandidato(${candidato.id})">
🔎 Ver candidatura
</button>


</div>


`;


});


}

async function logout(){

    await supabaseClient.auth.signOut();

    // limpa qualquer sessão salva
    localStorage.clear();
    sessionStorage.clear();

    window.location.replace("login.html");

}


async function alterarStatus(id,status){


await supabaseClient
.from("candidatos")
.update({
status:status
})
.eq("id",id);



}


function verCandidato(id){

window.location.href =
"candidato.html?id="+id;

}

// INICIAR PAINEL


carregarCandidatos();
