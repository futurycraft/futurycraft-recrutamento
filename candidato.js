// ==========================================
// FUTURYCRAFT - DETALHES DO CANDIDATO
// ==========================================



// VERIFICAR LOGIN

async function verificarAcesso(){

    const { data } = await supabaseClient.auth.getSession();


    if(!data.session){

        window.location.href = "login.html";

        return;

    }

}


verificarAcesso();




// PEGAR ID DA URL

const parametros = new URLSearchParams(
    window.location.search
);


const id = parametros.get("id");





// ==========================================
// CARREGAR CANDIDATO
// ==========================================


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




    document.querySelector("#perfil-candidato").innerHTML = `


<div class="player-perfil">


<img 
src="https://mc-heads.net/avatar/${data.nick}"
>



<div class="player-info">


<h2>
${data.nome_completo || data.nick}
</h2>



<p>
🎮 Nick: ${data.nick}
</p>


<p>
💬 Discord: ${data.discord}
</p>


<p>
🎂 Idade: ${data.idade}
</p>


<p class="status status-${data.status}">
${data.status || "Pendente"}
</p>


</div>


</div>


`;






document.querySelector("#respostas").innerHTML = `


<div class="resposta">

<strong>
Por que deseja entrar para a equipe?
</strong>


<p>
${data.motivo}
</p>


</div>




<div class="resposta">

<strong>
Como ajudaria o servidor?
</strong>


<p>
${data.ajuda}
</p>


</div>





<div class="resposta">

<strong>
Como agiria contra hackers?
</strong>


<p>
${data.hack}
</p>


</div>


`;


}



// ==========================================
// CARREGAR AVALIAÇÕES
// ==========================================


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


    area.innerHTML="";



    if(data.length === 0){

        area.innerHTML = 
        "<p>Nenhuma avaliação registrada.</p>";

        return;

    }





    for(const avaliacao of data){



        const {data:reacoes} = await supabaseClient

        .from("avaliacoes_reacoes")

        .select("*")

        .eq("avaliacao_id",avaliacao.id);



        const likes = reacoes
        ?
        reacoes.filter(
            r=>r.reacao==="like"
        ).length
        :
        0;



        const dislikes = reacoes
        ?
        reacoes.filter(
            r=>r.reacao==="dislike"
        ).length
        :
        0;




        area.innerHTML += `


<div class="avaliacao">


<div class="autor">


<div class="avatar-staff">
${avaliacao.avaliador.charAt(0).toUpperCase()}
</div>



<div>

<b>
${avaliacao.avaliador}
</b>


<div class="data-comentario">

${new Date(avaliacao.created_at).toLocaleString()}

</div>


</div>


</div>





<p>

${avaliacao.observacao}

</p>





<div class="reacoes">


<button 
class="like"
id="like-${avaliacao.id}"
onclick="reagirAvaliacao(${avaliacao.id},'like')">

👍 ${likes}

</button>



<button 
class="dislike"
id="dislike-${avaliacao.id}"
onclick="reagirAvaliacao(${avaliacao.id},'dislike')">

👎 ${dislikes}

</button>



<button 
class="delete"
onclick="excluirAvaliacao(${avaliacao.id})">

🗑

</button>


</div>



</div>


`;


    }



}








// ==========================================
// ADICIONAR AVALIAÇÃO
// ==========================================


async function adicionarAvaliacao(){


    const texto =
    document.querySelector("#observacao").value;



    if(!texto.trim()){

        alert("Digite uma avaliação!");

        return;

    }



    const {data} =
    await supabaseClient.auth.getUser();



    if(!data.user){

        window.location.href="login.html";

        return;

    }




    const {error}=await supabaseClient

    .from("avaliacoes")

    .insert([{


        candidato_id:id,

        avaliador:data.user.email,

        observacao:texto



    }]);




    if(error){

        console.error(error);

        alert("Erro ao adicionar avaliação");

        return;

    }



    document.querySelector("#observacao").value="";


    carregarAvaliacoes();


}








// ==========================================
// ALTERAR STATUS
// ==========================================


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



    alert(
    "Status atualizado!"
    );


    carregarCandidato();



}



// ==========================================
// REAÇÃO LIKE / DISLIKE
// ==========================================


async function reagirAvaliacao(idAvaliacao,tipo){


const {data} = await supabaseClient.auth.getUser();


if(!data.user){

    alert("Sessão expirada!");

    return;

}



const email = data.user.email;



const {data:existente} = await supabaseClient

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



atualizarReacoes(idAvaliacao);



}

async function atualizarReacoes(idAvaliacao){


const {data,error}=await supabaseClient

.from("avaliacoes_reacoes")

.select("*")

.eq("avaliacao_id",idAvaliacao);



if(error){

console.error(error);

return;

}



const likes = data.filter(
r=>r.reacao==="like"
).length;



const dislikes = data.filter(
r=>r.reacao==="dislike"
).length;



const botaoLike = document.querySelector(
`#like-${idAvaliacao}`
);


const botaoDislike = document.querySelector(
`#dislike-${idAvaliacao}`
);



if(botaoLike){

botaoLike.innerHTML =
`👍 ${likes}`;

}



if(botaoDislike){

botaoDislike.innerHTML =
`👎 ${dislikes}`;

}



}
// ==========================================
// EXCLUIR AVALIAÇÃO
// ==========================================


async function excluirAvaliacao(idAvaliacao){



    if(!confirm(
    "Excluir avaliação?"
    )) return;




    const {error}=await supabaseClient

    .from("avaliacoes")

    .delete()

    .eq("id",idAvaliacao);




    if(error){

        console.error(error);

        return;

    }



    carregarAvaliacoes();



}






// ==========================================
// VOLTAR
// ==========================================


function voltar(){

    window.location.href="admin.html";

}




carregarCandidato();

carregarAvaliacoes();
