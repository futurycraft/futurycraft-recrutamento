/* ==========================================================
   FUTURYCRAFT
   CANDIDATURA STAFF
   ETAPA 4 - FEEDBACK
   SISTEMA DE ESTRELAS
========================================================== */


const STORAGE = "futury_candidatura";


document.addEventListener("DOMContentLoaded", () => {


    carregarDados();


    configurarEventos();


});





/* ==========================================================
ELEMENTOS
========================================================== */


const form = document.getElementById(
    "form-feedback"
);



const camposEstrelas = [


    "avaliacao_servidor",


    "avaliacao_equipe",


    "avaliacao_organizacao",


    "avaliacao_eventos",


    "avaliacao_atualizacoes"


];



const melhorias =
document.getElementById("melhorias");







/* ==========================================================
EVENTOS
========================================================== */


function configurarEventos(){



    camposEstrelas.forEach(nome => {



        const radios = document.querySelectorAll(

            `input[name="${nome}"]`

        );



        radios.forEach(radio => {



            radio.addEventListener(

                "change",

                salvarDados

            );



        });



    });




    melhorias.addEventListener(

        "input",

        salvarDados

    );




    form.addEventListener(

        "submit",

        enviarFormulario

    );



}







/* ==========================================================
PEGAR ESTRELA SELECIONADA
========================================================== */


function pegarAvaliacao(nome){



    const selecionado = document.querySelector(

        `input[name="${nome}"]:checked`

    );



    return selecionado ?

    selecionado.value :

    "";



}






/* ==========================================================
SALVAR DADOS
========================================================== */


function salvarDados(){



    const dados = JSON.parse(

        localStorage.getItem(STORAGE)

    ) || {};





    camposEstrelas.forEach(nome => {



        dados[nome] = pegarAvaliacao(nome);



    });





    dados.melhorias =

    melhorias.value.trim();





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





    camposEstrelas.forEach(nome => {



        if(!dados[nome])

            return;





        const radio = document.querySelector(

            `input[name="${nome}"][value="${dados[nome]}"]`

        );



        if(radio){


            radio.checked = true;


        }



    });





    melhorias.value =

    dados.melhorias || "";



}








/* ==========================================================
VALIDAÇÃO
========================================================== */


function validarFormulario(){



    for(let campo of camposEstrelas){



        const valor = pegarAvaliacao(campo);



        if(!valor){



            alert(

                "Por favor avalie todas as categorias com estrelas."

            );



            const primeiro = document.querySelector(

                `input[name="${campo}"]`

            );



            if(primeiro)

                primeiro.focus();



            return false;



        }



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

    "candidatura-termo.html";



}
