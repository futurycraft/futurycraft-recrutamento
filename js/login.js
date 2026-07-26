// ==========================================
// FUTURYCRAFT - LOGIN STAFF
// ==========================================


document.addEventListener(
    "DOMContentLoaded",
    () => {


        const form = document.getElementById("login-form");

        const mensagem = document.getElementById("mensagem");



        if(!form){

            console.error(
                "Formulário de login não encontrado"
            );

            return;

        }





        form.addEventListener(
            "submit",
            async (event)=>{


                event.preventDefault();



                const email =
                document.getElementById("email")
                .value
                .trim();



                const senha =
                document.getElementById("senha")
                .value;





                mensagem.innerHTML =
                "Entrando...";





                try{


                    const {
                        data,
                        error
                    } = await supabaseClient.auth.signInWithPassword({

                        email: email,

                        password: senha

                    });






                    if(error){


                        console.error(
                            "Erro login:",
                            error
                        );



                        mensagem.innerHTML =
                        "Email ou senha incorretos.";



                        return;


                    }






                    console.log(
                        "Login realizado:",
                        data.user.email
                    );





                    mensagem.style.color =
                    "#00ff99";



                    mensagem.innerHTML =
                    "Login realizado!";





                    setTimeout(()=>{


                        window.location.href =
                        "dashboard.html";



                    },1000);







                }catch(error){


                    console.error(
                        "Erro:",
                        error
                    );



                    mensagem.innerHTML =
                    "Erro ao conectar com servidor.";



                }



            }

        );



    }

);
