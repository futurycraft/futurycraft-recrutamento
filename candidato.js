const SUPABASE_URL = "https://jssscxlnzytmwzbabvhu.supabase.co";


const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzc3NjeGxuenl0bXd6YmFidmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NzE2NzcsImV4cCI6MjEwMDA0NzY3N30.Ku_HJdFQYyEmLmjkynye90l0bpM0MbbFVJPZDMCEOXQ";


const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);



async function verificarLogin(){

    const {data} = await supabaseClient.auth.getSession();


    if(!data.session){

        window.location.href="login.html";

    }

}


verificarLogin();



const parametros = new URLSearchParams(
    window.location.search
);


const id = parametros.get("id");



async function carregarCandidato(){


const {data,error}=await supabaseClient
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


<h2>
${data.nick}
</h2>


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



<h3>
Status:
${data.status}
</h3>


<p>
<b>Avaliador:</b>
${data.avaliador || "Ainda não analisado"}
</p>


<p>
<b>Observação:</b>
<br>
${data.observacao || "Sem observação"}
</p>

</div>


`;


}




async function alterarStatus(status){


await supabaseClient
.from("candidatos")
.update({
status:status
})
.eq("id",id);



alert(
"Candidatura alterada para "+status
);



async function salvarAnalise(){


const observacao = document.querySelector("#observacao").value;



const usuario = await supabaseClient.auth.getUser();



const avaliador = usuario.data.user.email;



const { error } = await supabaseClient
.from("candidatos")
.update({

    observacao: observacao,

    avaliador: avaliador,

    data_analise: new Date()

})
.eq("id", id);



if(error){

console.error(error);

alert("Erro ao salvar análise");

return;

}



alert("Análise salva com sucesso!");



carregarCandidato();


}



function voltar(){

window.location.href="admin.html";

}



carregarCandidato();
