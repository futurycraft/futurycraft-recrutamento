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

        await carregarMetasStaff(
            data.nick,
            data.cargo
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
        .from("skyblock_tempo")
        .select(
            "tempo_online,nick"
        )
        .eq(
            "nick",
            nick
        )
        .single();



        if(error){

            console.error(
                "Erro horas:",
                error
            );

        }



        let tempo = "0m";



        if(data){

            tempo =
            formatarTempo(
                data.tempo_online
            );

        }



        // Card principal

        const horas =
        document.getElementById(
            "horas"
        );


        if(horas){

            horas.innerHTML =
            tempo;

        }




        // Card horas online staff

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



    }catch(error){


        console.error(
            "Erro tempo staff:",
            error
        );


    }


}

// ==========================================
// CARREGAR TOP RANKS STAFF
// ==========================================

async function carregarTopStaff(){


    const area =
    document.getElementById("top-staff");


    if(!area)
        return;



    try{


        const {data,error}=await supabaseClient

        .from("skyblock_tempo")

        .select(
            "nick,tempo_online,grupo"
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




        console.log(
            "Top Staff:",
            data,
            error
        );





        if(error || !data || data.length === 0){


            area.innerHTML = `

            <div class="activity-item">

                Ranking indisponível.

            </div>

            `;


            return;

        }






        area.innerHTML = "";




        data.forEach((staff,index)=>{


            let medalha;


            if(index === 0){

                medalha="🥇";

            }
            else if(index === 1){

                medalha="🥈";

            }
            else if(index === 2){

                medalha="🥉";

            }
            else{

                medalha="#"+(index+1);

            }





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

                        ${staff.grupo || "Staff FuturyCraft"}

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




    }catch(error){


        console.error(
            "Erro ranking staff:",
            error
        );


        area.innerHTML = `

        <div class="activity-item">

            Erro carregando ranking.

        </div>

        `;


    }


}





// ==========================================
// RETORNA SEGUNDA-FEIRA DA SEMANA
// ==========================================


function pegarInicioSemana(){


    let hoje = new Date();


    let dia = hoje.getDay();


    let diferenca = hoje.getDate() - dia + (dia === 0 ? -6 : 1);



    let segunda = new Date(
        hoje.setDate(diferenca)
    );



    return segunda
    .toISOString()
    .split("T")[0];


}







// ==========================================
// SALVAR HISTÓRICO STAFF
// ==========================================


async function salvarHistoricoStaff(
nick,
horas,
avaliacoes,
atividades
){


    const semana =
    pegarInicioSemana();




    const {error}=

    await supabaseClient

    .from("historico_staff")

    .upsert({

        nick:nick,

        semana_inicio:semana,

        horas_online:horas,

        avaliacoes:avaliacoes,

        atividades:atividades

    },

    {

        onConflict:
        "nick,semana_inicio"

    });



    if(error){


        console.error(

            "Erro salvar histórico:",

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
// SEMANA ATUAL
// ==========================================


function pegarInicioSemana(){


    let hoje = new Date();


    let dia = hoje.getDay();


    let diferenca = hoje.getDate() - dia + (dia === 0 ? -6 : 1);



    let segunda = new Date(
        hoje.setDate(diferenca)
    );


    return segunda
    .toISOString()
    .split("T")[0];


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
// METAS SEMANAIS STAFF AUTOMÁTICAS
// ==========================================


async function carregarMetasStaff(nick, cargo){


    const area = document.getElementById("metas-staff");


    if(!area) return;



    try{


        area.innerHTML = "";



        // ======================================
        // BUSCAR META DO CARGO
        // ======================================


        const {data:meta,error:erroMeta}=

        await supabaseClient

        .from("metas_staff")

        .select("*")

        .eq("cargo",cargo)

        .single();




        if(erroMeta || !meta){


            area.innerHTML=`

            <div class="activity-item">

            Nenhuma meta configurada para ${cargo}

            </div>

            `;


            return;

        }






        // ======================================
        // HORAS ONLINE
        // ======================================


        const {data:tempo,error:erroTempo}=

        await supabaseClient

        .from("skyblock_tempo")

        .select("tempo_online")

        .eq("nick",nick)

        .maybeSingle();





        let segundos = Number(
            tempo?.tempo_online || 0
        );



        let horas = Math.floor(
            segundos / 3600
        );







        // ======================================
        // AVALIAÇÕES
        // ======================================


        const {count:avaliacoes,error:erroAvaliacao}=

        await supabaseClient

        .from("candidatos")

        .select(
            "*",
            {
                count:"exact",
                head:true
            }
        )

        .eq(
            "avaliador",
            nick
        );






        let totalAvaliacoes =
        avaliacoes || 0;






        // ======================================
        // ATIVIDADES
        // ======================================


        let atividades =
        totalAvaliacoes;








        // ======================================
        // SALVAR HISTÓRICO DA SEMANA
        // ======================================


        await salvarHistoricoStaff(

            nick,

            horas,

            totalAvaliacoes,

            atividades

        );








        // ======================================
        // MOSTRAR METAS
        // ======================================


        criarMeta(

            "⏱ Tempo Online",

            horas,

            meta.meta_horas,

            "h"

        );




        criarMeta(

            "📝 Avaliações",

            totalAvaliacoes,

            meta.meta_avaliacoes,

            ""

        );





        criarMeta(

            "⭐ Atividades Staff",

            atividades,

            meta.meta_atividades,

            ""

        );






    }catch(error){


        console.error(

            "Erro metas staff:",

            error

        );


    }


}





        // ==============================
        // HORAS ONLINE
        // ==============================


        const {data:tempo}=

        await supabaseClient

        .from("skyblock_tempo")

        .select("tempo_online")

        .eq("nick",nick)

        .maybeSingle();



        let segundos = Number(
            tempo?.tempo_online || 0
        );



        let horas = Math.floor(
            segundos / 3600
        );






        // ==============================
        // AVALIAÇÕES
        // ==============================


        const {count:avaliacoes}=

        await supabaseClient

        .from("candidatos")

        .select(
            "*",
            {
                count:"exact",
                head:true
            }
        )

        .eq(
            "avaliador",
            nick
        );







        // ==============================
        // ATIVIDADES
        // ==============================


        // Inicialmente vamos usar avaliações
        // depois podemos trocar por outro sistema


        let atividades = avaliacoes || 0;






        criarMeta(

            "⏱ Tempo Online",

            horas,

            meta.meta_horas,

            "h"

        );



        criarMeta(

            "📝 Avaliações",

            avaliacoes || 0,

            meta.meta_avaliacoes,

            ""

        );



        criarMeta(

            "⭐ Atividades Staff",

            atividades,

            meta.meta_atividades,

            ""

        );





    }catch(error){


        console.error(
            "Erro metas:",
            error
        );


    }


}






function criarMeta(
nome,
valor,
objetivo,
unidade
){


const area =
document.getElementById("metas-staff");



let porcentagem = 0;



if(objetivo > 0){

    porcentagem =
    Math.min(
        (valor / objetivo) * 100,
        100
    );

}



area.innerHTML += `


<div class="meta-item">


<div class="meta-header">


<strong>

${nome}

</strong>


<span>

${Math.floor(porcentagem)}%

</span>


</div>




<div class="meta-progresso">


<div class="meta-barra"

style="width:${porcentagem}%">

</div>


</div>




<div class="meta-info">

${valor}${unidade} / ${objetivo}${unidade}

</div>



</div>


`;

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



// ==========================================
// RANKING STAFF SEMANAL
// ==========================================


async function carregarRankingStaff(){


const area =
document.getElementById("ranking-staff");



if(!area) return;




try{


const semana =
pegarInicioSemana();




const {data,error}=

await supabaseClient

.from("historico_staff")

.select("*")

.eq(
"semana_inicio",
semana
)

.order(
"horas_online",
{
ascending:false
}
)

.limit(10);





if(error || !data || data.length===0){


area.innerHTML=`

<div class="activity-item">

Ranking indisponível.

</div>

`;


return;


}







area.innerHTML="";





data.forEach((staff,index)=>{



let medalha="🏅";


if(index===0)
medalha="🥇";


if(index===1)
medalha="🥈";


if(index===2)
medalha="🥉";






area.innerHTML += `


<div class="ranking-item">


<div class="ranking-posicao">

${medalha}

</div>



<div class="ranking-nome">


<strong>

${staff.nick}

</strong>


<span>

Staff FuturyCraft

</span>


</div>



<div class="ranking-tempo">

${staff.horas_online}h

</div>



</div>


`;



});




}catch(error){


console.error(
"Erro ranking:",
error
);


}


}



// Atualiza a cada 5 minutos

setInterval(()=>{


    atualizarDashboard();


},300000);
