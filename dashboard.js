// ==========================================
// FUTURYCRAFT - CENTRAL STAFF DASHBOARD
// ==========================================


// ==========================================
// CARREGAR PERFIL STAFF
// ==========================================

async function carregarPerfil() {

    try {

        const { data: usuario } = await supabaseClient.auth.getUser();


        if (!usuario.user) {
            window.location.href = "login.html";
            return;
        }


        const email = usuario.user.email;


        // Busca informações do staff
        const { data, error } = await supabaseClient
            .from("staff")
            .select("*")
            .eq("email", email)
            .single();



        if(error){

            console.error(error);

            document.getElementById("nome-staff").textContent = email;

            return;

        }



        document.getElementById("nome-staff").textContent =
            data.nome || "Staff";


        document.getElementById("cargo-staff").textContent =
            data.cargo || "Sem cargo";


        document.getElementById("tempo-staff").textContent =
            data.entrada
            ? new Date(data.entrada).toLocaleDateString("pt-BR")
            : "--";



    } catch(err){

        console.error(err);

    }

}





// ==========================================
// CARREGAR AVISOS
// ==========================================

async function carregarAvisos(){


    const area =
    document.getElementById("avisos");



    const { data, error } =
    await supabaseClient
    .from("avisos")
    .select("*")
    .order("created_at", {
        ascending:false
    })
    .limit(5);



    if(error){

        console.error(error);
        return;

    }



    if(!data || data.length === 0){

        area.innerHTML =
        `
        <div class="activity-item">
            Nenhum aviso disponível.
        </div>
        `;

        return;

    }



    area.innerHTML="";



    data.forEach(aviso=>{


        area.innerHTML +=
        `
        <div class="activity-item">

            <strong>
            ${aviso.titulo}
            </strong>

            <br>

            ${aviso.mensagem}

        </div>
        `;


    });


}






// ==========================================
// CARREGAR AGENDA
// ==========================================

async function carregarAgenda(){


    const area =
    document.getElementById("agenda");



    const {data,error}=

    await supabaseClient
    .from("agenda")
    .select("*")
    .order("data",{
        ascending:true
    })
    .limit(5);



    if(error){

        console.error(error);
        return;

    }



    if(!data || data.length===0){

        area.innerHTML=
        `
        <div class="activity-item">
            Nenhum evento marcado.
        </div>
        `;

        return;

    }



    area.innerHTML="";



    data.forEach(evento=>{


        area.innerHTML +=
        `
        <div class="activity-item">

            <strong>
            ${evento.titulo}
            </strong>

            <br>

            ${evento.data}

        </div>
        `;


    });


}







// ==========================================
// CARREGAR DESEMPENHO
// ==========================================

async function carregarDesempenho(){


    const {data:user}=

    await supabaseClient.auth.getUser();



    if(!user.user)
    return;



    const {data,error}=

    await supabaseClient
    .from("staff_desempenho")
    .select("*")
    .eq("email",user.user.email)
    .single();



    if(error){

        console.log(error);

        return;

    }



    document.getElementById("atendimentos").textContent =
    data.atendimentos || 0;



    document.getElementById("avaliacoes").textContent =
    data.avaliacoes || 0;



    document.getElementById("horas").textContent =
    (data.horas || 0) + "h";



    document.getElementById("progresso").textContent =
    (data.progresso || 0) + "%";



}







// ==========================================
// INICIAR DASHBOARD
// ==========================================

document.addEventListener(
"DOMContentLoaded",
async()=>{


    await verificarLogin();


    await carregarPerfil();


    await carregarAvisos();


    await carregarAgenda();


    await carregarDesempenho();



});
