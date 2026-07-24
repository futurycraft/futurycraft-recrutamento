async function iniciarPagina(){


    const cargo = await pegarCargo();



    if(
        cargo !== "fundador" &&
        cargo !== "diretor" &&
        cargo !== "admin"
    ){

        alert("Você não possui permissão");

        window.location.href="admin.html";

        return;

    }



    carregarStaff();

    carregarUsuarios();


}








async function carregarStaff(){


    const {data,error}=await supabaseClient

    .from("usuarios_staff")

    .select("*")

    .order("cargo");





    if(error){

        console.log("Erro ao carregar staff:", error);

        return;

    }






    let html = "";





    if(data.length === 0){


        html = `

        <div class="loading">

        Nenhum membro na staff

        </div>

        `;


    }








    data.forEach(staff=>{


        html += `


        <div class="staff-card">



            <h3>

            🛡 ${staff.nick ?? "Sem nick"}

            </h3>





            <p>

            <b>Cargo:</b>

            ${formatarCargo(staff.cargo)}

            </p>







            <p>

            <b>📅 Entrou na Staff:</b>

            <br>

            ${
                staff.entrou_staff

                ?

                new Date(staff.entrou_staff)
                .toLocaleString("pt-BR")

                :

                "Não registrado"

            }

            </p>








            <p>

            <b>⏳ Tempo na Staff:</b>

            <br>

            ${calcularTempoStaff(staff.entrou_staff)}

            </p>








            <p>

            <b>👤 Promovido por:</b>

            <br>

            ${staff.promovido_por ?? "Sistema"}

            </p>






        </div>



        `;



    });





    document.getElementById("listaStaff").innerHTML = html;



}









async function carregarUsuarios(){



    const select = document.getElementById("usuarioStaff");





    const {data,error}=await supabaseClient

    .from("usuarios_staff")

    .select("*");






    if(error){


        console.log(error);

        return;


    }






    select.innerHTML="";






    data.forEach(usuario=>{


        select.innerHTML += `


        <option value="${usuario.usuario_id}">


        ${usuario.nick ?? usuario.email}


        </option>


        `;


    });



}









async function adicionarStaff(){



    const usuario_id =

    document.getElementById("usuarioStaff").value;






    const cargo =

    document.getElementById("cargoStaff").value;






    if(!usuario_id){


        alert("Selecione um usuário");


        return;


    }







    // usuário que está fazendo a alteração

    const usuarioLogado =

    await supabaseClient.auth.getUser();





    const emailAdmin =

    usuarioLogado.data.user.email;







    const {data:admin}=await supabaseClient

    .from("usuarios_staff")

    .select("nick")

    .eq("email",emailAdmin)

    .single();






    const nickAdmin =

    admin?.nick ?? "Sistema";









    // verifica se já tem data de entrada

    const {data:usuarioAtual}=await supabaseClient

    .from("usuarios_staff")

    .select("entrou_staff")

    .eq("usuario_id",usuario_id)

    .single();







    let dados = {


        cargo:cargo,


        promovido_por:nickAdmin


    };







    // somente adiciona data na primeira entrada

    if(!usuarioAtual.entrou_staff){


        dados.entrou_staff = new Date();


    }








    const {error}=await supabaseClient

    .from("usuarios_staff")

    .update(dados)

    .eq("usuario_id",usuario_id);








    if(error){


        console.log(error);


        alert("Erro ao alterar cargo");


        return;


    }






    alert("Cargo atualizado com sucesso!");



    carregarStaff();



}









async function removerStaff(id){



    const cargoAtual = await pegarCargo();





    if(cargoAtual !== "fundador"){


        alert(

        "Somente o Fundador pode remover cargos"

        );


        return;


    }






    if(!confirm("Remover este membro?")){


        return;


    }






    const {error}=await supabaseClient

    .from("usuarios_staff")

    .delete()

    .eq("id",id);






    if(error){


        console.log(error);


        alert("Erro ao remover");


        return;


    }






    alert("Membro removido");



    carregarStaff();



}









function calcularTempoStaff(data){



    if(!data){


        return "Não registrado";


    }







    const inicio = new Date(data);


    const agora = new Date();






    let segundos = Math.floor(

        (agora - inicio) / 1000

    );






    const dias = Math.floor(segundos / 86400);


    segundos %= 86400;





    const horas = Math.floor(segundos / 3600);


    segundos %= 3600;






    const minutos = Math.floor(segundos / 60);







    return `${dias}d ${horas}h ${minutos}m`;



}









function formatarCargo(cargo){



    const cargos = {


        fundador:"👑 Fundador",


        diretor:"⭐ Diretor",


        gerente:"🔷 Gerente",


        admin:"🛡 Admin",


        moderador:"🔨 Moderador",


        ajudante:"💬 Ajudante"



    };





    return cargos[cargo] ?? cargo;



}









iniciarPagina();
