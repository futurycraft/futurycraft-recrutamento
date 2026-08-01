/* ==========================================================
   FUTURYCRAFT
   CANDIDATURA STAFF
   ETAPA 1
========================================================== */


const STORAGE = "futury_candidatura";



/* ==========================================================
INICIAR
========================================================== */


document.addEventListener("DOMContentLoaded",()=>{


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



const dia = document.getElementById("dia");

const mes = document.getElementById("mes");

const ano = document.getElementById("ano");







/* ==========================================================
EVENTOS
========================================================== */


function configurarEventos(){



    [

        nome,
        nick,
        discord,
        idade,
        dia,
        mes,
        ano

    ].forEach(campo=>{


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




    if(idade){


        idade.addEventListener(
            "input",
            ()=>{


                atualizarNumeroIdade();


                salvarDados();


            }
        );


    }




    [

        dia,
        mes,
        ano

    ].forEach(campo=>{


        if(campo){


            campo.addEventListener(
                "input",
                atualizarIdade
            );


        }


    });






    document
    .querySelectorAll(
        'input[name="genero"]'
    )
    .forEach(radio=>{


        radio.addEventListener(
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
SALVAR
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
    montarData();





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
MONTAR DATA
========================================================== */


function montarData(){



    if(

        !dia.value ||

        !mes.value ||

        !ano.value

    ){

        return "";

    }





    return (

        ano.value +

        "-" +

        String(mes.value).padStart(2,"0") +

        "-" +

        String(dia.value).padStart(2,"0")

    );


}








/* ==========================================================
CARREGAR
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



    atualizarNumeroIdade();





    if(dados.data_nascimento){


        const partes =
        dados.data_nascimento.split("-");



        ano.value =
        partes[0] || "";



        mes.value =
        partes[1] || "";



        dia.value =
        partes[2] || "";


    }






    const genero =
    document.querySelector(

        `input[name="genero"][value="${dados.genero}"]`

    );



    if(genero){

        genero.checked = true;

    }



}








/* ==========================================================
IDADE VISUAL
========================================================== */


function atualizarNumeroIdade(){


    if(!idadeNumero)
        return;



    idadeNumero.textContent =
    idade.value;



}








/* ==========================================================
CALCULAR IDADE
========================================================== */


function atualizarIdade(){


    const data =
    montarData();



    if(!data)
        return;




    const nascimento =
    new Date(data);



    const hoje =
    new Date();





    let anos =

    hoje.getFullYear()

    -

    nascimento.getFullYear();





    const diferencaMes =

    hoje.getMonth()

    -

    nascimento.getMonth();





    if(

        diferencaMes < 0 ||

        (

            diferencaMes === 0 &&

            hoje.getDate() < nascimento.getDate()

        )

    ){

        anos--;

    }





    if(

        anos >= 13 &&

        anos <= 99

    ){


        idade.value = anos;


        atualizarNumeroIdade();


        salvarDados();


    }



}








/* ==========================================================
VALIDAÇÃO
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
            "Informe seu Discord."
        );


        discord.focus();

        return false;


    }





    if(idade.value < 13){


        alert(
            "Você precisa ter pelo menos 13 anos."
        );


        return false;


    }






    if(!montarData()){


        alert(
            "Informe sua data de nascimento."
        );


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
