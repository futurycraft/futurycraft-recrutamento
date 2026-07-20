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




    document.querySelector("#candidato").innerHTML = `



    <div class="info-grid">


        <div>

            <b>Nome completo</b>

            <p>${data.nome_completo || "Não informado"}</p>

        </div>



        <div>

            <b>Nick Minecraft</b>

            <p>${data.nick}</p>

        </div>



        <div>

            <b>Discord</b>

            <p>${data.discord}</p>

        </div>



        <div>

            <b>Idade</b>

            <p>${data.idade}</p>

        </div>



        <div>

            <b>Data de nascimento</b>

            <p>${data.data_nascimento || "Não informado"}</p>

        </div>



        <div>

            <b>Gênero</b>

            <p>${data.genero || "Não informado"}</p>

        </div>



        <div>

            <b>Status atual</b>

            <p>${data.status || "Pendente"}</p>

        </div>



    </div>




    <hr>



    <h3>
    Experiência
    </h3>



    <p>

    <b>Tempo no FuturyCraft:</b><br>

    ${data.tempo || "Não informado"}

    </p>



    <p>

    <b>Disponibilidade:</b><br>

    ${data.disponibilidade || "Não informado"}

    </p>




    <h3>
    Respostas
    </h3>




    <p>

    <b>Motivo:</b><br>

    ${data.motivo || "Não informado"}

    </p>




    <p>

    <b>Como ajudaria:</b><br>

    ${data.ajuda || "Não informado"}

    </p>




    <p>

    <b>Situação de hack:</b><br>

    ${data.hack || "Não informado"}

    </p>





    <div class="acoes">


        <button onclick="alterarStatus('Aprovado')">

        Aprovar

        </button>



        <button onclick="alterarStatus('Recusado')">

        Recusar

        </button>


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



            <p>
            <b>Avaliador:</b>
            ${avaliacao.avaliador}
            </p>



            <p>
            <b>Data:</b>
            ${new Date(
            avaliacao.created_at
            ).toLocaleString()}
            </p>



            <p>
            ${avaliacao.observacao}
            </p>



            <button id="like-${avaliacao.id}" onclick="reagirAvaliacao(${avaliacao.id},'like')">

👍 ${likes}

</button>



<button id="dislike-${avaliacao.id}" onclick="reagirAvaliacao(${avaliacao.id},'dislike')">

👎 ${dislikes}

</button>



            <button onclick="excluirAvaliacao(${avaliacao.id})">

            Excluir

            </button>



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



document.querySelector(`#like-${idAvaliacao}`).innerHTML =
`👍 ${likes}`;



document.querySelector(`#dislike-${idAvaliacao}`).innerHTML =
`👎 ${dislikes}`;



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
