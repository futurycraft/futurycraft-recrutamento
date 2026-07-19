const SUPABASE_URL = "https://jssscxlnzytmwzbabvhu.supabase.co";

const SUPABASE_KEY = "SUA_KEY_AQUI";


const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);



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


            <hr>


            <p>
            <b>Motivo:</b><br>
            ${candidato.motivo}
            </p>


            <p>
            <b>Ajuda:</b><br>
            ${candidato.ajuda}
            </p>


            <p>
            <b>Hack:</b><br>
            ${candidato.hack}
            </p>


        </div>

        `;


    });


}


carregarCandidatos();
