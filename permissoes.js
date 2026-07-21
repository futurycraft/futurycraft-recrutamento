async function carregarStaff(){


    const { data, error } = await supabaseClient

        .from("usuarios_staff")

        .select("*")

        .order("cargo", { ascending:true });



    if(error){

        console.log("Erro ao carregar staff:", error);

        return;

    }



    const lista = document.getElementById("listaStaff");



    if(!data || data.length === 0){

        lista.innerHTML = `
            <div class="loading">
                Nenhum membro encontrado
            </div>
        `;

        return;

    }



    lista.innerHTML = "";



    data.forEach(staff => {


        lista.innerHTML += `

        <div class="staff-member">


            <h3>${staff.nick || "Sem nick"}</h3>


            <p>
            Nome: ${staff.nome || "Não informado"}
            </p>


            <p>
            Email: ${staff.email}
            </p>


            <p>
            Cargo:
            <strong>${staff.cargo || "Sem cargo"}</strong>
            </p>


        </div>

        `;


    });



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



    select.innerHTML = "";



    data.forEach(usuario=>{


        select.innerHTML += `

        <option value="${usuario.usuario_id}">

        ${usuario.nick || usuario.email}

        </option>

        `;


    });


}





async function adicionarStaff(){



    const usuario_id = document.getElementById("usuarioStaff").value;


    const cargo = document.getElementById("cargoStaff").value;



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







carregarStaff();

carregarUsuarios();
