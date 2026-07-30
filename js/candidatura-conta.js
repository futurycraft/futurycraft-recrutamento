/* ==========================================================
   FUTURYCRAFT
   CANDIDATURA STAFF
   ETAPA 2 - CONTA E SERVIDOR
========================================================== */


const STORAGE = "futury_candidatura";


document.addEventListener("DOMContentLoaded", () => {

    carregarDados();

    configurarEventos();

});



/* ==========================================================
ELEMENTOS
========================================================== */


const form = document.getElementById("form-conta");


const tipoConta = document.getElementById("tipo_conta");

const plataforma = document.getElementById("plataforma");

const acessoConta = document.getElementById("acesso_conta");

const tempoServidor = document.getElementById("tempo_servidor");

const modoInteresse = document.getElementById("modo_interesse");

const horarioJogo = document.getElementById("horario_jogo");


const checkboxesDias = document.querySelectorAll(
    ".checkbox-item input"
);



/* ==========================================================
EVENTOS
========================================================== */


function configurarEventos(){


    [

        tipoConta,

        plataforma,

        acessoConta,

        tempoServidor,

        modoInteresse,

        horarioJogo


    ].forEach(campo => {


        campo.addEventListener(
            "input",
            salvarDados
        );


        campo.addEventListener(
            "change",
            salvarDados
        );


    });



    checkboxesDias.forEach(check => {


        check.addEventListener(
            "change",
            salvarDados
        );


    });



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



    dados.tipo_conta =
        tipoConta.value;



    dados.plataforma =
        plataforma.value;



    dados.acesso_conta =
        acessoConta.value;



    dados.tempo_servidor =
        tempoServidor.value.trim();



    dados.modo_interesse =
        modoInteresse.value;



    dados.horario_jogo =
        horarioJogo.value;



    dados.dias_jogo =

        Array.from(checkboxesDias)

        .filter(check => check.checked)

        .map(check => check.value);



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



    tipoConta.value =
        dados.tipo_conta || "";



    plataforma.value =
        dados.plataforma || "";



    acessoConta.value =
        dados.acesso_conta || "";



    tempoServidor.value =
        dados.tempo_servidor || "";



    modoInteresse.value =
        dados.modo_interesse || "";



    horarioJogo.value =
        dados.horario_jogo || "";



    if(dados.dias_jogo){


        checkboxesDias.forEach(check => {


            if(

                dados.dias_jogo.includes(
                    check.value
                )

            ){

                check.checked = true;

            }


        });


    }


}



/* ==========================================================
VALIDAÇÃO
========================================================== */


function validarFormulario(){



    if(!tipoConta.value){


        alert(
            "Selecione se sua conta é original ou pirata."
        );


        tipoConta.focus();

        return false;

    }



    if(!plataforma.value){


        alert(
            "Selecione sua plataforma."
        );


        plataforma.focus();

        return false;


    }



    if(!acessoConta.value){


        alert(
            "Informe se alguém possui acesso à sua conta."
        );


        acessoConta.focus();

        return false;


    }



    if(
        tempoServidor.value.trim().length < 2
    ){


        alert(
            "Informe há quanto tempo joga no FuturyCraft."
        );


        tempoServidor.focus();

        return false;


    }



    if(!modoInteresse.value){


        alert(
            "Selecione o modo que deseja atuar."
        );


        modoInteresse.focus();

        return false;


    }



    if(!horarioJogo.value){


        alert(
            "Selecione o horário que costuma jogar."
        );


        horarioJogo.focus();

        return false;


    }



    const diasSelecionados =

        Array.from(checkboxesDias)

        .filter(check => check.checked);



    if(
        diasSelecionados.length === 0
    ){


        alert(
            "Selecione pelo menos um dia da semana."
        );


        return false;


    }



    return true;


}



/* ==========================================================
ENVIAR
========================================================== */


function enviarFormulario(event){


    event.preventDefault();



    if(!validarFormulario())
        return;



    salvarDados();



    window.location.href =

    "candidatura-perfil.html";

}

