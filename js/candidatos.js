/* ==========================================================
   FUTURYCRAFT
   CANDIDATURA STAFF
   ETAPA 1
========================================================== */


const STORAGE = "futury_candidatura";



/* ==========================================================
INICIAR
========================================================== */


document.addEventListener("DOMContentLoaded", () => {


    carregarDados();


    configurarEventos();


});




/* ==========================================================
ELEMENTOS
========================================================== */


const form = document.getElementById("form-dados");


const nome = document.getElementById("nome");

const nick = document.getElementById("nick");

const discord = document.getElementById("discord");

const idade = document.getElementById("idade");

const idadeNumero = document.getElementById("idade-numero");

const data = document.getElementById("data");





/* ==========================================================
CONFIGURAR EVENTOS
========================================================== */


function configurarEventos(){



    [

        nome,

        nick,

        discord,

        idade,

        data


    ].forEach(campo => {


        if(campo){


            campo.addEventListener(
                "input",
                salvarDados
            );


            campo.addEventListener(
                "change",
                salvarDados
            );


        }


    });




    document
    .querySelectorAll(
        'input[name="genero"]'
    )
    .forEach(radio => {


        radio.addEventListener(
            "change",
            salvarDados
        );


    });





    if(idade){


        idade.addEventListener(
            "input",
            atualizarNumeroIdade
        );


    }





    data.addEventListener(
        "change",
        atualizarIdade
    );




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





    dados.nome_completo =

    nome.value.trim();





    dados.nick =

    nick.value.trim();





    dados.discord =

    discord.value.trim();





    dados.idade =

    idade.value;





    dados.data_nascimento =

    data.value;





    const generoSelecionado =

    document.querySelector(
        'input[name="genero"]:checked'
    );





    dados.genero =

    generoSelecionado

    ?

    generoSelecionado.value

    :

    "";






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



    if(!dados) return;





    nome.value =

    dados.nome_completo || "";





    nick.value =

    dados.nick || "";





    discord.value =

    dados.discord || "";





    idade.value =

    dados.idade || 18;





    data.value =

    dados.data_nascimento || "";





    atualizarNumeroIdade();





    const genero = document.querySelector(

        `input[name="genero"][value="${dados.genero}"]`

    );



    if(genero){


        genero.checked = true;


    }



}







/* ==========================================================
ATUALIZAR NÚMERO IDADE
========================================================== */


function atualizarNumeroIdade(){


    if(!idadeNumero) return;



    idadeNumero.textContent =

    idade.value;



}







/* ==========================================================
CALCULAR IDADE PELA DATA
========================================================== */


function atualizarIdade(){


    if(!data.value) return;



    const nascimento = new Date(
        data.value
    );


    const hoje = new Date();




    let anos =

    hoje.getFullYear()

    -

    nascimento.getFullYear();




    const mes =

    hoje.getMonth()

    -

    nascimento.getMonth();





    if(

        mes < 0 ||

        (

            mes === 0 &&

            hoje.getDate() < nascimento.getDate()

        )

    ){


        anos--;


    }





    if(anos >= 13 && anos <= 99){


        idade.value = anos;


        atualizarNumeroIdade();


        salvarDados();


    }



}







/* ==========================================================
VALIDAR FORMULÁRIO
========================================================== */


function validarFormulario(){



    if(nome.value.trim().length < 5){


        alert(
            "Informe seu nome completo."
        );


        nome.focus();


        return false;


    }





    if(

        nick.value.trim().length < 3 ||

        nick.value.trim().length > 16

    ){


        alert(
            "Informe um nick válido."
        );


        nick.focus();


        return false;


    }






    if(discord.value.trim().length < 2){


        alert(
            "Informe seu usuário do Discord."
        );


        discord.focus();


        return false;


    }






    if(

        idade.value < 13

    ){


        alert(
            "Você precisa ter pelo menos 13 anos."
        );


        idade.focus();


        return false;


    }






    if(!data.value){


        alert(
            "Informe sua data de nascimento."
        );


        data.focus();


        return false;


    }





    return true;


}







/* ==========================================================
ENVIAR
========================================================== */


function enviarFormulario(e){



    e.preventDefault();





    if(!validarFormulario())

    return;





    salvarDados();





    window.location.href =

    "candidatura-conta.html";



}
