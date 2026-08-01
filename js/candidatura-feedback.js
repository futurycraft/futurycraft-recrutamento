/* ==========================================================
   FUTURYCRAFT
   CANDIDATURA STAFF
   ETAPA 4 - FEEDBACK
   SISTEMA DE ESTRELAS PREMIUM
========================================================== */


const STORAGE = "futury_candidatura";


document.addEventListener("DOMContentLoaded", () => {


    carregarDados();


    configurarEventos();


    atualizarTodasEstrelas();


});



/* ==========================================================
ELEMENTOS
========================================================== */


const form =
document.getElementById("form-feedback");



const melhorias =
document.getElementById("melhorias");



const avaliacoes = {


    servidor:
    document.querySelectorAll(
        '[data-avaliacao="servidor"] .estrela'
    ),


    equipe:
    document.querySelectorAll(
        '[data-avaliacao="equipe"] .estrela'
    ),


    organizacao:
    document.querySelectorAll(
        '[data-avaliacao="organizacao"] .estrela'
    ),


    eventos:
    document.querySelectorAll(
        '[data-avaliacao="eventos"] .estrela'
    ),


    atualizacoes:
    document.querySelectorAll(
        '[data-avaliacao="atualizacoes"] .estrela'
    )


};




/* ==========================================================
EVENTOS
========================================================== */


function configurarEventos(){



    Object.keys(avaliacoes)

    .forEach(tipo => {



        avaliacoes[tipo]

        .forEach((estrela,index)=>{


            estrela.addEventListener(
                "click",
                ()=>{


                    selecionarEstrelas(
                        tipo,
                        index + 1
                    );


                    salvarDados();


                }
            );



            estrela.addEventListener(
                "mouseenter",
                ()=>{


                    pintarHover(
                        tipo,
                        index + 1
                    );


                }
            );



            estrela.addEventListener(
                "mouseleave",
                ()=>{


                    atualizarEstrelas(
                        tipo
                    );


                }
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
SELECIONAR ESTRELAS
========================================================== */


function selecionarEstrelas(tipo,valor){



    const dados =
    JSON.parse(

        localStorage.getItem(STORAGE)

    ) || {};



    dados[
        "avaliacao_" + tipo
    ] = valor;



    localStorage.setItem(

        STORAGE,

        JSON.stringify(dados)

    );



    atualizarEstrelas(tipo);


}



/* ==========================================================
ATUALIZAR VISUAL
========================================================== */


function atualizarEstrelas(tipo){



    const dados =
    JSON.parse(

        localStorage.getItem(STORAGE)

    ) || {};



    const valor =
    Number(

        dados[
            "avaliacao_" + tipo
        ]

    ) || 0;



    avaliacoes[tipo]

    .forEach((estrela,index)=>{


        if(index < valor){


            estrela.classList.add(
                "ativo"
            );


        }else{


            estrela.classList.remove(
                "ativo"
            );


        }


    });


}




function atualizarTodasEstrelas(){



    Object.keys(avaliacoes)

    .forEach(tipo=>{


        atualizarEstrelas(tipo);


    });


}





/* ==========================================================
HOVER
========================================================== */


function pintarHover(tipo,valor){



    avaliacoes[tipo]

    .forEach((estrela,index)=>{


        if(index < valor){


            estrela.classList.add(
                "hover"
            );


        }else{


            estrela.classList.remove(
                "hover"
            );


        }


    });



}




/* ==========================================================
SALVAR DADOS
========================================================== */


function salvarDados(){



    const dados =
    JSON.parse(

        localStorage.getItem(STORAGE)

    ) || {};



    dados.melhorias =
    melhorias.value.trim();



    localStorage.setItem(

        STORAGE,

        JSON.stringify(dados)

    );


}





/* ==========================================================
CARREGAR
========================================================== */


function carregarDados(){



    const dados =
    JSON.parse(

        localStorage.getItem(STORAGE)

    );



    if(!dados)
        return;



    melhorias.value =
    dados.melhorias || "";



}



/* ==========================================================
VALIDAÇÃO
========================================================== */


function validarFormulario(){



    const nomes = {


        servidor:
        "Avalie o FuturyCraft.",


        equipe:
        "Avalie o atendimento da equipe.",


        organizacao:
        "Avalie a organização.",


        eventos:
        "Avalie os eventos.",


        atualizacoes:
        "Avalie as atualizações."

    };




    for(let tipo in nomes){



        const dados =
        JSON.parse(

            localStorage.getItem(STORAGE)

        ) || {};



        if(

            !dados[
                "avaliacao_" + tipo
            ]

        ){


            alert(
                nomes[tipo]
            );


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
