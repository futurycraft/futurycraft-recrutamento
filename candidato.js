const SUPABASE_URL = "https://jssscxlnzytmwzbabvhu.supabase.co";


const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzc3NjeGxuenl0bXd6YmFidmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NzE2NzcsImV4cCI6MjEwMDA0NzY3N30.Ku_HJdFQYyEmLmjkynye90l0bpM0MbbFVJPZDMCEOXQ";


const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);



const parametros = new URLSearchParams(
    window.location.search
);


const id = parametros.get("id");



// ===============================
// CARREGAR CANDIDATO
// ===============================

async function carregarCandidato(){


const {data,error} = await supabaseClient
.from("candidatos")
.select("*")
.eq("id",id)
.single();



if(error){

console.error(error);

return;

}



document.querySelector("#candidato").innerHTML = `


<div class="card-candidato">


<h2>${data.nick}</h2>


<p>
<b>Discord:</b>
${data.discord}
</p>


<p>
<b>Idade:</b>
${data.idade}
</p>


<p>
<b>Tempo:</b>
${data.tempo}
</p>


<p>
<b>Disponibilidade:</b>
${data.disponibilidade}
</p>


<hr>


<h3>Respostas</h3>


<p>
<b>Motivo:</b><br>
${data.motivo}
</p>


<p>
<b>Como ajudaria:</b><br>
${data.ajuda}
</p>


<p>
<b>Hack:</b><br>
${data.hack}
</p>


<hr>


<h3>
Status: ${data.status}
</h3>


<button onclick="alterarStatus('Aprovado')">
✅ Aprovar
</button>


<button onclick="alterarStatus('Recusado')">
❌ Recusar
</button>


</div>


`;


}



// ===============================
// CARREGAR AVALIAÇÕES
// ===============================


async function carregarAvaliacoes(){


const {data,error} = await supabaseClient
.from("avaliacoes")
.select("*")
.eq("candidato_id",id)
.order("created_at",{ascending:false});



if(error){

console.error("Erro avaliações:",error);

return;

}



const area =
document.querySelector("#avaliacoes");



area.innerHTML = "";



if(data.length === 0){

area.innerHTML =
"Não existem avaliações ainda.";

return;

}



data.forEach(avaliacao=>{


area.innerHTML += `


<div class="card-candidato">


<p>
<b>👤 Avaliador:</b>
${avaliacao.avaliador}
</p>


<p>
<b>📅 Data:</b>
${new Date(avaliacao.created_at).toLocaleString()}
</p>


<p>
<b>📝 Avaliação:</b><br>
${avaliacao.observacao}
</p>


<div>


<button onclick="curtirAvaliacao(${avaliacao.id})">

👍 ${avaliacao.likes || 0}

</button>



<button onclick="descurtirAvaliacao(${avaliacao.id})">

👎 ${avaliacao.dislikes || 0}

</button>


<button onclick="excluirAvaliacao(${avaliacao.id})">

🗑️ Excluir

</button>


</div>


</div>


<hr>


`;


});


}



// ===============================
// ADICIONAR AVALIAÇÃO
// ===============================


async function adicionarAvaliacao(){


const observacao =
document.querySelector("#observacao").value;



if(!observacao){

alert("Digite uma avaliação!");

return;

}



const usuario =
await supabaseClient.auth.getUser();



const avaliador =
usuario.data.user.email;



const {error}=await supabaseClient
.from("avaliacoes")
.insert([{

candidato_id:id,

avaliador:avaliador,

observacao:observacao

}]);



if(error){

console.error(error);

alert("Erro ao salvar avaliação");

return;

}



alert("Avaliação adicionada!");



document.querySelector("#observacao").value="";


carregarAvaliacoes();


}




// ===============================
// ALTERAR STATUS
// ===============================


async function alterarStatus(status){


const {error}=await supabaseClient
.from("candidatos")
.update({

status:status

})
.eq("id",id);



if(error){

console.error(error);

return;

}



alert("Status alterado!");

carregarCandidato();


}


async function curtirAvaliacao(idAvaliacao){


const {data} = await supabaseClient
.from("avaliacoes")
.select("likes")
.eq("id",idAvaliacao)
.single();



await supabaseClient
.from("avaliacoes")
.update({

likes:(data.likes || 0) + 1

})
.eq("id",idAvaliacao);



carregarAvaliacoes();


}

async function descurtirAvaliacao(idAvaliacao){


const {data} = await supabaseClient
.from("avaliacoes")
.select("dislikes")
.eq("id",idAvaliacao)
.single();



await supabaseClient
.from("avaliacoes")
.update({

dislikes:(data.dislikes || 0) + 1

})
.eq("id",idAvaliacao);



carregarAvaliacoes();


}


async function excluirAvaliacao(idAvaliacao){


const confirmar = confirm(
"Tem certeza que deseja excluir esta avaliação?"
);



if(!confirmar){

return;

}



const {error}=await supabaseClient
.from("avaliacoes")
.delete()
.eq("id",idAvaliacao);



if(error){

console.error(error);

alert("Erro ao excluir avaliação");

return;

}



alert("Avaliação excluída!");



carregarAvaliacoes();


}



function voltar(){

window.location.href="admin.html";

}



// iniciar

carregarCandidato();

carregarAvaliacoes();

async function reagirAvaliacao(idAvaliacao, tipo){


const usuario =
await supabaseClient.auth.getUser();



const email =
usuario.data.user.email;



// Verifica se já existe reação

const {data: existente} =
await supabaseClient
.from("avaliacoes_reacoes")
.select("*")
.eq("avaliacao_id", idAvaliacao)
.eq("usuario", email)
.single();



if(existente){


    // Se clicou na mesma reação, remove

    if(existente.reacao === tipo){


        await supabaseClient
        .from("avaliacoes_reacoes")
        .delete()
        .eq("id", existente.id);


    }

    // Se mudou de reação

    else{


        await supabaseClient
        .from("avaliacoes_reacoes")
        .update({

            reacao: tipo

        })
        .eq("id", existente.id);


    }


}

else{


    await supabaseClient
    .from("avaliacoes_reacoes")
    .insert([{

        avaliacao_id: idAvaliacao,

        usuario: email,

        reacao: tipo

    }]);


}



carregarAvaliacoes();


}
