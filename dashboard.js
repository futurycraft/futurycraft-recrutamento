// ==========================================
// FUTURYCRAFT - CENTRAL STAFF DASHBOARD
// ==========================================


// ==========================================
// VARIÁVEIS
// ==========================================

let staffAtual = null;


// ==========================================
// CARREGAR PERFIL STAFF
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

            console.error(
                "Staff não encontrado",
                error
            );


            window.location.href =
            "login.html";


            return;

        }




        staffAtual = data;



        document.getElementById(
            "nick-staff"
        ).innerHTML =
        data.nick || "--";



        document.getElementById(
            "nome-staff"
        ).innerHTML =
        data.nome || "--";



        document.getElementById(
            "cargo-staff"
        ).innerHTML =
        data.cargo || "--";



        document.getElementById(
            "tempo-staff"
        ).innerHTML =
        formatarData(
            data.data_entrada
        );



        await carregarTempoStaff(
            data.nick
        );



    }
    catch(error){


        console.error(
            "Erro perfil:",
            error
        );


    }


}






// ==========================================
// FORMATAR DATA
// ==========================================

function formatarData(data){


    if(!data)
        return "--";



    return new Date(data)
    .toLocaleDateString(
        "pt-BR"
    );


}







// ==========================================
// FORMATAR TEMPO ONLINE
// ==========================================

function formatarTempo(segundos){


    segundos =
    Number(segundos) || 0;



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



    let texto = "";



    if(dias > 0)
        texto += dias + "d ";



    if(horas > 0)
        texto += horas + "h ";



    if(minutos > 0)
        texto += minutos + "m";



    if(texto === "")
        texto = "0m";



    return texto.trim();


}






// ==========================================
// CARREGAR HORAS STAFF
// ==========================================

async function carregarTempoStaff(nick){


    try{


        const {data,error} =
        await supabaseClient
        .from("staff_ranking")
        .select(
            "tempo_online,nick"
        )
        .eq(
            "nick",
            nick
        )
        .maybeSingle();




        if(error){

            console.error(error);

        }



        let tempo =
        data
        ? formatarTempo(
            data.tempo_online
        )
        : "0m";




        const horas =
        document.getElementById(
            "horas"
        );



        if(horas)
            horas.innerHTML = tempo;




        const area =
        document.getElementById(
            "horas-online"
        );



        if(area){


            area.innerHTML = `


            <div class="hour-card">


                <div>

                    <span>
                    Seu tempo online
                    </span>


                    <h2>
                    ${tempo}
                    </h2>


                </div>



                <div>

                    ⏱

                </div>


            </div>


            `;


        }



    }
    catch(error){


        console.error(
            "Erro horas:",
            error
        );


    }


}

// ==========================================
// CARREGAR TOP RANKS STAFF
// ==========================================

async function carregarTopStaff(){


    const area =
    document.getElementById(
        "top-staff"
    );


    if(!area)
        return;



    try{


        const {data,error} =
        await supabaseClient
        .from("staff_ranking")
        .select(
            "nick,tempo_online,staff"
        )
        .eq(
            "staff",
            true
        )
        .order(
            "tempo_online",
            {
                ascending:false
            }
        )
        .limit(5);





        if(error){


            console.error(
                "Erro ranking:",
                error
            );


            area.innerHTML = `

            <div class="rank-item">

                Ranking indisponível.

            </div>

            `;


            return;


        }






        if(!data || data.length === 0){


            area.innerHTML = `

            <div class="rank-item">

                Nenhum staff encontrado.

            </div>

            `;


            return;


        }





        area.innerHTML = "";




        data.forEach(
        (staff,index)=>{


            let medalha = "";



            if(index === 0)
                medalha = "🥇";


            else if(index === 1)
                medalha = "🥈";


            else if(index === 2)
                medalha = "🥉";


            else
                medalha = "#" + (index + 1);




            area.innerHTML += `


            <div class="rank-item">


                <div class="rank-position">

                    ${medalha}

                </div>



                <div class="rank-info">


                    <strong>

                        ${staff.nick}

                    </strong>



                    <span>

                        Staff FuturyCraft

                    </span>


                </div>



                <div class="rank-hours">


                    ${formatarTempo(
                        staff.tempo_online
                    )}


                </div>



            </div>


            `;


        });


    }
    catch(error){


        console.error(
            "Erro top staff:",
            error
        );


    }


}







// ==========================================
// CARREGAR AVISOS
// ==========================================

async function carregarAvisos(){


    const area =
    document.getElementById(
        "avisos"
    );



    if(!area)
        return;



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


            console.error(
                "Avisos:",
                error
            );


            area.innerHTML = `

            <div class="activity-item">

                Nenhum aviso disponível.

            </div>

            `;


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




        data.forEach(
        aviso=>{


            area.innerHTML += `


            <div class="activity-item">


                <strong>

                    📢 ${aviso.titulo}

                </strong>



                <br>



                <span>

                    ${aviso.mensagem}

                </span>


            </div>


            `;



        });




    }
    catch(error){


        console.error(
            "Erro avisos:",
            error
        );


    }


}







// ==========================================
// DESEMPENHO STAFF
// ==========================================

async function carregarDesempenho(){


    try{


        let atendimentos = 0;

        let avaliacoes = 0;



        // futuramente puxará
        // das tabelas reais



        const atendimento =
        document.getElementById(
            "atendimentos"
        );


        const avaliacao =
        document.getElementById(
            "avaliacoes"
        );


        const progresso =
        document.getElementById(
            "progresso"
        );




        if(atendimento)
            atendimento.innerHTML =
            atendimentos;




        if(avaliacao)
            avaliacao.innerHTML =
            avaliacoes;




        if(progresso)
            progresso.innerHTML =
            "0%";




    }
    catch(error){


        console.error(
            "Erro desempenho:",
            error
        );


    }


}

// ==========================================
// LOGOUT
// ==========================================

async function logout(){


    try{


        await supabaseClient.auth.signOut();



        localStorage.clear();

        sessionStorage.clear();



        window.location.replace(
            "login.html"
        );


    }
    catch(error){


        console.error(
            "Erro logout:",
            error
        );


    }


}








// ==========================================
// VERIFICAR LOGIN
// ==========================================

async function verificarLogin(){


    try{


        const {data} =
        await supabaseClient.auth.getSession();



        if(!data.session){


            window.location.href =
            "login.html";


            return false;


        }



        return true;



    }
    catch(error){


        console.error(
            "Erro login:",
            error
        );


        return false;


    }


}








// ==========================================
// ATUALIZAÇÃO AUTOMÁTICA
// ==========================================

async function atualizarDashboard(){


    await carregarPerfil();


    await carregarTopStaff();


    await carregarAvisos();


    await carregarDesempenho();


}









// ==========================================
// INICIAR DASHBOARD
// ==========================================

document.addEventListener(
"DOMContentLoaded",
async ()=>{


    const logado =
    await verificarLogin();



    if(!logado)
        return;




    await carregarPerfil();



    await carregarTopStaff();



    await carregarAvisos();



    await carregarDesempenho();



});







// Atualiza a cada 5 minutos

setInterval(()=>{


    atualizarDashboard();


},300000);
