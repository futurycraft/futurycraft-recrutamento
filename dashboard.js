// ==========================================
// FUTURYCRAFT - CENTRAL STAFF DASHBOARD
// ==========================================



// ==========================================
// CARREGAR PERFIL DO STAFF
// ==========================================

async function carregarPerfil(){

    try{


        const { data:user } =
        await supabaseClient.auth.getUser();



        if(!user.user){

            window.location.href = "login.html";
            return;

        }



        const email = user.user.email;



        const { data, error } =
        await supabaseClient
        .from("usuarios_staff")
        .select("*")
        .eq("email", email)
        .single();





        if(error || !data){


            console.log(
                "Usuário não encontrado na staff"
            );


            window.location.href = "login.html";


            return;


        }






        if(!data.cargo){


            console.log(
                "Staff sem cargo"
            );


            window.location.href = "login.html";


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
        ? new Date(data.data_entrada)
            .toLocaleDateString("pt-BR")
        : "--";





        console.log(
            "Staff carregado:",
            data.nick
        );





        await carregarTempoStaff(
            data.nick
        );





    }catch(error){


        console.error(
            "Erro perfil:",
            error
        );


    }


}









// ==========================================
// CARREGAR TEMPO STAFF SKYBLOCK
// ==========================================

async function carregarTempoStaff(nick){


    try{


        console.log(
            "Buscando tempo:",
            nick
        );




        const {data,error} =
        await supabaseClient
        .from("skyblock_tempo")
        .select(
            "nick,tempo_online,grupo,staff"
        )
        .eq(
            "nick",
            nick
        )
        .eq(
            "staff",
            true
        )
        .maybeSingle();





        console.log(
            "Resposta tempo:",
            data,
            error
        );





        if(error || !data){


            document.getElementById("horas")
            .innerHTML = "0h";


            return;


        }






        let segundos = 
Number(data.tempo_online) || 0;



let dias =
Math.floor(
    segundos / 86400
);



let horas =
Math.floor(
    (segundos % 86400) / 3600
);



let minutos =
Math.floor(
    (segundos % 3600) / 60
);




let textoTempo = "";



if(dias > 0){

    textoTempo += dias + "d ";

}



if(horas > 0){

    textoTempo += horas + "h ";

}



if(minutos > 0){

    textoTempo += minutos + "m";

}



if(textoTempo === ""){

    textoTempo = "0m";

}




document.getElementById("horas")
.innerHTML = textoTempo.trim();





    }catch(error){


        console.error(
            "Erro tempo staff:",
            error
        );


    }


}









// ==========================================
// CARREGAR AVISOS
// ==========================================

async function carregarAvisos(){


    const area =
    document.getElementById("avisos");


    try{


        const {data,error} =
        await supabaseClient
        .from("avisos")
        .select("*")
        .order(
            "created_at",
            {
                ascending:false
            }
        )
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


    const area =
    document.getElementById("agenda");


    try{


        const {data,error} =
        await supabaseClient
        .from("agenda")
        .select("*")
        .order(
            "data",
            {
                ascending:true
            }
        )
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






        area.innerHTML = "";





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



    document.getElementById("atendimentos")
    .innerHTML = 0;




    document.getElementById("avaliacoes")
    .innerHTML = 0;




    document.getElementById("progresso")
    .innerHTML = "0%";



}









// ==========================================
// INICIAR DASHBOARD
// ==========================================

document.addEventListener(
"DOMContentLoaded",
async ()=>{


    await verificarLogin();


    await carregarPerfil();


    await carregarAvisos();


    await carregarAgenda();


    await carregarDesempenho();


});
