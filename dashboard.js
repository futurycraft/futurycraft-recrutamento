// ==========================================
// FUTURYCRAFT - CENTRAL STAFF DASHBOARD
// ==========================================


// ==========================================
// CARREGAR PERFIL DO STAFF
// ==========================================

async function carregarPerfil(){

    try{


        const { data:user } = await supabaseClient.auth.getUser();


        if(!user.user){

            window.location.href = "login.html";
            return;

        }



        const email = user.user.email;



        const { data, error } = await supabaseClient
        .from("usuarios_staff")
        .select("*")
        .eq("email", email)
        .single();



        if(error){

            console.error("Erro ao buscar staff:", error);

            return;

        }



        document.getElementById("nick-staff").innerHTML =
        data.nick || "--";



        document.getElementById("nome-staff").innerHTML =
        data.nome || "--";



        document.getElementById("cargo-staff").innerHTML =
        data.cargo || "Sem cargo";



        document.getElementById("tempo-staff").innerHTML =
        data.data_entrada
        ? new Date(data.data_entrada).toLocaleDateString("pt-BR")
        : "--";



    }catch(error){

        console.error(error);

    }


}







// ==========================================
// CARREGAR AVISOS
// ==========================================

async function carregarAvisos(){

    const area = document.getElementById("avisos");


    try{


        const {data,error} = await supabaseClient
        .from("avisos")
        .select("*")
        .order("created_at",{ascending:false})
        .limit(5);



        if(error){

            console.error(error);

            return;

        }



        if(!data || data.length === 0){

            area.innerHTML = `

            <div class="activity-item">
                Nenhum aviso disponível.
            </div>

            `;

            return;

        }



        area.innerHTML = "";


        data.forEach(aviso=>{


            area.innerHTML += `

            <div class="activity-item">

                <strong>
                    ${aviso.titulo}
                </strong>

                <br>

                ${aviso.mensagem}

            </div>

            `;


        });



    }catch(error){

        console.error(error);

    }

}







// ==========================================
// CARREGAR AGENDA
// ==========================================

async function carregarAgenda(){


    const area = document.getElementById("agenda");


    try{


        const {data,error} = await supabaseClient
        .from("agenda")
        .select("*")
        .order("data",{ascending:true})
        .limit(5);



        if(error){

            console.error(error);

            return;

        }



        if(!data || data.length === 0){

            area.innerHTML = `

            <div class="activity-item">
                Nenhum evento agendado.
            </div>

            `;

            return;

        }



        area.innerHTML="";


        data.forEach(evento=>{


            area.innerHTML += `

            <div class="activity-item">

                <strong>
                    ${evento.titulo}
                </strong>

                <br>

                ${evento.data}

            </div>

            `;


        });



    }catch(error){

        console.error(error);

    }


}







// ==========================================
// CARREGAR DESEMPENHO
// ==========================================

async function carregarDesempenho(){


    document.getElementById("atendimentos").innerHTML = 0;


    document.getElementById("avaliacoes").innerHTML = 0;


    document.getElementById("horas").innerHTML = "0h";


    document.getElementById("progresso").innerHTML = "0%";


}







// ==========================================
// INICIAR DASHBOARD
// ==========================================

document.addEventListener("DOMContentLoaded", async ()=>{


    await verificarLogin();


    await carregarPerfil();


    await carregarAvisos();


    await carregarAgenda();


    await carregarDesempenho();


});
