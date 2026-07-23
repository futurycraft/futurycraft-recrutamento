// ==========================================
// FUTURYCRAFT - CENTRAL STAFF DASHBOARD
// ==========================================


// CARREGAR PERFIL DO STAFF
async function carregarPerfil(){

    try{

        const { data } = await supabaseClient.auth.getUser();

        if(!data.user){
            window.location.href = "login.html";
            return;
        }


        const email = data.user.email;


        document.getElementById("nome-staff").innerHTML = email;


        // futuramente vai buscar o cargo no banco
        document.getElementById("cargo-staff").innerHTML = "Staff";


        document.getElementById("tempo-staff").innerHTML = "--";


    }catch(error){

        console.error(error);

    }

}



// CARREGAR AVISOS
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




// CARREGAR AGENDA
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




// CARREGAR DESEMPENHO
async function carregarDesempenho(){


    document.getElementById("atendimentos").innerHTML = 0;

    document.getElementById("avaliacoes").innerHTML = 0;

    document.getElementById("horas").innerHTML = "0h";

    document.getElementById("progresso").innerHTML = "0%";


}





// INICIAR

document.addEventListener("DOMContentLoaded",()=>{


    verificarLogin();


    carregarPerfil();


    carregarAvisos();


    carregarAgenda();


    carregarDesempenho();



});
