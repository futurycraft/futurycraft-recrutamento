const supabaseClient = window.supabaseClient;


const formulario = document.querySelector("#login-form");


formulario.addEventListener("submit", async (e)=>{

    e.preventDefault();


    const email = document.querySelector("#email").value;

    const senha = document.querySelector("#senha").value;



    const { data, error } = await supabaseClient.auth.signInWithPassword({

        email: email,

        password: senha

    });



    if(error){

        alert("Email ou senha incorretos!");

        console.error(error);

        return;

    }



    const cargo = await pegarCargo();



    if(!cargo){

        alert("Sua conta ainda não possui cargo");

        await supabaseClient.auth.signOut();

        return;

    }



    /*
    =====================================
    ATUALIZAR USUARIO STAFF
    =====================================
    */


    const usuario = data.user;



    const { error: erroStaff } = await supabaseClient

    .from("usuarios_staff")

    .update({

        usuario_id: usuario.id

    })

    .eq("email", usuario.email);



    if(erroStaff){

        console.log(
            "Usuário ainda não está cadastrado como staff:",
            erroStaff
        );

    }



    alert("Login realizado com sucesso!");



    window.location.href = "dashboard.html";


});
