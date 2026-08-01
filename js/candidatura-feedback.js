/* ==========================================================
   FUTURYCRAFT
   CANDIDATURA STAFF
   ETAPA 5 - TERMO
   CLOUDFLARE TURNSTILE
========================================================== */


const STORAGE = "futury_candidatura";



document.addEventListener(
    "DOMContentLoaded",
    () => {


        carregarDados();

        configurarEventos();


    }
);





/* ==========================================================
ELEMENTOS
========================================================== */


const form = document.getElementById(
    "form-termo"
);



const aceite = document.getElementById(
    "aceite"
);



const botaoEnviar = document.querySelector(
    ".btn-principal"
);







/* ==========================================================
EVENTOS
========================================================== */


function configurarEventos(){



    if(!form)
        return;



    if(aceite){


        aceite.addEventListener(
            "change",
            salvarDados
        );


    }





    form.addEventListener(
        "submit",
        enviarFormulario
    );



}







/* ==========================================================
SALVAR DADOS
========================================================== */


function salvarDados(){



    const dados = JSON.parse(

        localStorage.getItem(STORAGE)

    ) || {};





    if(aceite){


        dados.aceite_termo =

        aceite.checked;


    }






    localStorage.setItem(

        STORAGE,

        JSON.stringify(dados)

    );



}









/* ==========================================================
CARREGAR DADOS
========================================================== */


function carregarDados(){



    const dados = JSON.parse(

        localStorage.getItem(STORAGE)

    );



    if(!dados)
        return;







    if(

        dados.aceite_termo

        &&

        aceite

    ){


        aceite.checked = true;


    }



}








/* ==========================================================
CLOUDFLARE TURNSTILE
========================================================== */


function validarCaptcha(){



    try {



        if(
            typeof turnstile === "undefined"
        ){


            alert(

                "Sistema de segurança carregando. Aguarde alguns segundos."

            );


            return false;


        }







        const resposta =

        turnstile.getResponse();







        if(

            !resposta

            ||

            resposta.length === 0

        ){


            alert(

                "Complete a verificação de segurança antes de enviar."

            );


            return false;


        }







        return true;



    }


    catch(error){



        console.error(
            "Erro Turnstile:",
            error
        );



        alert(

            "Não foi possível validar a segurança. Atualize a página e tente novamente."

        );



        return false;



    }



}









/* ==========================================================
VALIDAÇÃO
========================================================== */


function validarFormulario(){





    if(

        !aceite

        ||

        !aceite.checked

    ){



        alert(

            "Você precisa aceitar o Termo de Voluntariado."

        );



        if(aceite)

            aceite.focus();



        return false;


    }









    if(

        !validarCaptcha()

    ){


        return false;


    }







    return true;



}









/* ==========================================================
ENVIO
========================================================== */


function enviarFormulario(event){



    event.preventDefault();






    if(

        !validarFormulario()

    ){


        return;


    }







    salvarDados();








    if(botaoEnviar){



        botaoEnviar.disabled = true;



        botaoEnviar.innerHTML =


        `
        <span>
        Enviando candidatura...
        </span>
        `;



    }









    setTimeout(

        () => {



            window.location.href =

            "candidatura-enviado.html";



        },


        1000


    );



}
