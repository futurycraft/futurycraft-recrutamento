


async function verificarAcesso(){


    const { data } = await supabaseClient.auth.getSession();



    if(!data.session){


        window.location.href = "login.html";


        return;


    }



}



verificarAcesso();



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


<h3>Status: ${data.status || "Pendente"}</h3>



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

console.error(error);

return;

}



const area = document.querySelector("#avaliacoes");


area.innerHTML = "";



if(data.length === 0){

area.innerHTML =
"Não existem avaliações ainda.";

return;

}



for(const avaliacao of data){



const {data: reacoes} = await supabaseClient
.from("avaliacoes_reacoes")
.select("*")
.eq("avaliacao_id",avaliacao.id);



const likes = reacoes.filter(
r => r.reacao === "like"
).length;



const dislikes = reacoes.filter(
r => r.reacao === "dislike"
).length;



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



<button onclick="reagirAvaliacao(${avaliacao.id},'like')">

👍 ${likes}

</button>



<button onclick="reagirAvaliacao(${avaliacao.id},'dislike')">

👎 ${dislikes}

</button>



<button onclick="excluirAvaliacao(${avaliacao.id})">

🗑️ Excluir

</button>



</div>


<hr>


`;


}


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
// STATUS
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




// ===============================
// REAÇÃO LIKE/DISLIKE
// ===============================


async function reagirAvaliacao(idAvaliacao,tipo){



const usuario =
await supabaseClient.auth.getUser();



const email =
usuario.data.user.email;



const {data: existente} =
await supabaseClient
.from("avaliacoes_reacoes")
.select("*")
.eq("avaliacao_id",idAvaliacao)
.eq("usuario",email)
.maybeSingle();



if(existente){


if(existente.reacao === tipo){


await supabaseClient
.from("avaliacoes_reacoes")
.delete()
.eq("id",existente.id);


}

else{


await supabaseClient
.from("avaliacoes_reacoes")
.update({

reacao:tipo

})
.eq("id",existente.id);


}


}

else{


await supabaseClient
.from("avaliacoes_reacoes")
.insert([{

avaliacao_id:idAvaliacao,

usuario:email,

reacao:tipo

}]);


}



carregarAvaliacoes();


}





// ===============================
// EXCLUIR AVALIAÇÃO
// ===============================


async function excluirAvaliacao(idAvaliacao){


if(!confirm("Excluir esta avaliação?")){

return;

}



const {error}=await supabaseClient
.from("avaliacoes")
.delete()
.eq("id",idAvaliacao);



if(error){

console.error(error);

alert("Erro ao excluir");

return;

}



alert("Avaliação excluída!");

carregarAvaliacoes();


}

async function logout(){

    await supabaseClient.auth.signOut();

    // limpa qualquer sessão salva
    localStorage.clear();
    sessionStorage.clear();

    window.location.replace("login.html");

}


function voltar(){

window.location.href="admin.html";

}




carregarCandidato();

carregarAvaliacoes();
