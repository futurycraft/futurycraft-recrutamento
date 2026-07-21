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

    .select("*");



    if(error){

        console.log("Erro ao carregar staff:", error);

        return;

    }



    let html="";



    data.forEach(staff=>{


        html += `

        <div class="staff-card">


            <p>
            <b>Nick:</b>
            ${staff.nick ?? "Sem nick"}
            </p>



            <p>
            <b>Email:</b>
            ${staff.email ?? "Sem email"}
            </p>



            <p>
            <b>Cargo:</b>
            ${staff.cargo ?? "Sem cargo"}
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




    const {error}=await supabaseClient

    .from("usuarios_staff")

    .update({

        cargo:cargo

    })

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






iniciarPagina();
