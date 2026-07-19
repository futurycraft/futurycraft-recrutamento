// Conexão paineladmin supbase final1

const SUPABASE_URL = "https://jssscxlnzytmwzbabvhu.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzc3NjeGxuenl0bXd6YmFidmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NzE2NzcsImV4cCI6MjEwMDA0NzY3N30.Ku_HJdFQYyEmLmjkynye90l0bpM0MbbFVJPZDMCEOXQ";


const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);



// Verificar login Staff

async function verificarLogin(){

    const { data } = await supabaseClient.auth.getSession();


    if(!data.session){

        window.location.href = "login.html";

    }

}


verificarLogin();


console.log("Painel FuturyCraft conectado");



async function carregarCandidatos(){


    const { data, error } = await supabaseClient
        .from("candidatos")
        .select("*")
        .order("id", { ascending:false });



    if(error){

        console.error(error);

        document.querySelector("#lista-candidatos").innerHTML =
        "Erro ao carregar candidatos";

        return;

    }



    const lista = document.querySelector("#lista-candidatos");


    lista.innerHTML = "";



    data.forEach((candidato)=>{


        lista.innerHTML += `


        <div class="card-candidato">


            <h3>${candidato.nick}</h3>


            <p>
            Discord:
            ${candidato.discord}
            </p>


            <p>
            Idade:
            ${candidato.idade}
            </p>


            <p>
            Tempo:
            ${candidato.tempo}
            </p>


            <p>
            Disponibilidade:
            ${candidato.disponibilidade}
            </p>


            <p>
            <b>Status:</b>
            ${candidato.status || "Pendente"}
            </p>



            <hr>


            <p>
            <b>Motivo:</b><br>
            ${candidato.motivo}
            </p>


            <p>
            <b>Como ajudaria:</b><br>
            ${candidato.ajuda}
            </p>


            <p>
            <b>Hack:</b><br>
            ${candidato.hack}
            </p>



            <br>


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



async function alterarStatus(id, status){


    const { error } = await supabaseClient
        .from("candidatos")
        .update({
            status: status
        })
        .eq("id", id);



    if(error){

        console.error(error);

        alert("Erro ao atualizar status");

        return;

    }



    alert(
        "Candidatura atualizada para: " + status
    );


    carregarCandidatos();


}



carregarCandidatos();
