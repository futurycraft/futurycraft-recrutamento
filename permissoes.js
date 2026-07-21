async function pegarCargo(){

    const { data: { user } } = await supabaseClient.auth.getUser();


    if(!user){

        return null;

    }



    const { data, error } = await supabaseClient

        .from("usuarios_staff")

        .select("cargo")

        .eq("usuario_id", user.id)

        .maybeSingle();



    if(error){

        console.log("Erro ao buscar cargo:", error);

        return null;

    }



    if(!data || !data.cargo){

        console.log("Usuário sem cargo");

        return null;

    }



    return data.cargo.toLowerCase();


}





async function verificarPermissaoStaff(){


    const cargo = await pegarCargo();



    if(!cargo){

        alert("Usuário sem permissão");

        window.location.href = "admin.html";

        return false;

    }



    const cargosPermitidos = [

        "fundador",

        "diretor",

        "admin"

    ];



    if(!cargosPermitidos.includes(cargo)){


        alert("Você não possui permissão para acessar esta página");


        window.location.href = "admin.html";


        return false;


    }



    return true;


}





// Executa proteção apenas na página de gerenciamento

if(window.location.pathname.includes("gerenciar-staff.html")){


    verificarPermissaoStaff();


}
