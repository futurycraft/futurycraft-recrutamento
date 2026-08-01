/* ==========================================================
   FUTURYCRAFT
   CANDIDATURA STAFF
   ETAPA 5 - TERMO
   COM CLOUDFLARE TURNSTILE
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




    dados.aceite_termo =

    aceite.checked;




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
    ){


        aceite.checked = true;


    }



}








/* ==========================================================
VALIDAR TURNSTILE
========================================================== */


function validarCaptcha(){



    const captcha = document.querySelector(

        "[name='cf-turnstile-response']"

    );




    if(

        !captcha

        ||

        !captcha.value

    ){



        alert(

            "Complete a verificação de segurança antes de enviar."

        );



        return false;


    }



    return true;


}








/* ==========================================================
VALIDAÇÃO TERMO
========================================================== */


function validarFormulario(){





    if(
        !aceite.checked
    ){


        alert(

            "Você precisa aceitar o Termo de Voluntariado."

        );


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







    botaoEnviar.disabled = true;



    botaoEnviar.innerHTML =

    "Enviando candidatura...";







    setTimeout(
        () => {



            window.location.href =

            "candidatura-enviado.html";



        },

        700

    );



}
