/* ==========================================================
   FUTURYCRAFT
   CANDIDATURA STAFF
   ETAPA 4 - FEEDBACK
   SISTEMA DE ESTRELAS NOVO
========================================================== */


const STORAGE = "futury_candidatura";



/* ==========================================================
   INICIAR
========================================================== */


document.addEventListener(
    "DOMContentLoaded",
    () => {

        carregarDados();

        configurarEstrelas();

        configurarEventos();

        atualizarContador();

    }
);





/* ==========================================================
   ELEMENTOS
========================================================== */


const form =
document.getElementById(
    "form-feedback"
);


const melhorias =
document.getElementById(
    "melhorias"
);


const contador =
document.getElementById(
    "contador"
);


const botao =
document.querySelector(
    ".btn-principal"
);






/* ==========================================================
   CONFIGURAR EVENTOS
========================================================== */


function configurarEventos(){


    if(form){

        form.addEventListener(
            "submit",
            continuar
        );

    }



    if(melhorias){

        melhorias.addEventListener(
            "input",
            () => {

                salvarDados();

                atualizarContador();

            }
        );

    }


}







/* ==========================================================
   SISTEMA DE ESTRELAS
========================================================== */


function configurarEstrelas(){


    document
    .querySelectorAll(".rating")
    .forEach(rating=>{


        const estrelas =
        rating.querySelectorAll(".star");


        const input =
        rating.querySelector(
            "input[type='hidden']"
        );



        estrelas.forEach(estrela=>{


            estrela.addEventListener(
                "mouseenter",
                ()=>{


                    const valor =
                    Number(
                        estrela.dataset.value
                    );


                    pintarHover(
                        estrelas,
                        valor
                    );


                }
            );




            estrela.addEventListener(
                "mouseleave",
                ()=>{


                    limparHover(
                        estrelas
                    );


                    atualizarVisual(
                        estrelas,
                        input.value
                    );


                }
            );





            estrela.addEventListener(
                "click",
                ()=>{


                    const valor =
                    Number(
                        estrela.dataset.value
                    );



                    input.value =
                    valor;



                    atualizarVisual(
                        estrelas,
                        valor
                    );



                    salvarDados();


                }
            );



        });



    });



}







/* ==========================================================
   HOVER
========================================================== */


function pintarHover(estrelas,valor){


    estrelas.forEach(estrela=>{


        const estrelaValor =
        Number(
            estrela.dataset.value
        );



        if(estrelaValor <= valor){

            estrela.classList.add(
                "hover"
            );

        }
        else{

            estrela.classList.remove(
                "hover"
            );

        }


    });


}




function limparHover(estrelas){


    estrelas.forEach(estrela=>{


        estrela.classList.remove(
            "hover"
        );


    });


}







/* ==========================================================
   ATUALIZAR VISUAL
========================================================== */


function atualizarVisual(
    estrelas,
    valor
){


    estrelas.forEach(estrela=>{


        const estrelaValor =
        Number(
            estrela.dataset.value
        );



        if(
            estrelaValor <= Number(valor)
        ){

            estrela.classList.add(
                "active"
            );


        }
        else{


            estrela.classList.remove(
                "active"
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



    document
    .querySelectorAll(".rating")
    .forEach(rating=>{


        const nome =
        rating.dataset.name;



        const valor =
        rating.querySelector(
            "input[type='hidden']"
        ).value;



        dados[nome] =
        valor || "";



    });




    dados.melhorias =
    melhorias
    ?
    melhorias.value.trim()
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


    const dados =
    JSON.parse(
        localStorage.getItem(STORAGE)
    );


    if(!dados)
        return;



    document
    .querySelectorAll(".rating")
    .forEach(rating=>{


        const nome =
        rating.dataset.name;



        const valor =
        dados[nome];



        const input =
        rating.querySelector(
            "input[type='hidden']"
        );



        if(valor){


            input.value =
            valor;



            atualizarVisual(
                rating.querySelectorAll(".star"),
                valor
            );


        }



    });




    if(melhorias){

        melhorias.value =
        dados.melhorias || "";

    }



}








/* ==========================================================
   CONTADOR TEXTO
========================================================== */


function atualizarContador(){


    if(!melhorias || !contador)
        return;



    contador.innerHTML =

    `${melhorias.value.length} / 800`;



}







/* ==========================================================
   VALIDAR FORMULÁRIO
========================================================== */


function validarFormulario(){


    const avaliacoes = [


        "avaliacao_servidor",

        "avaliacao_equipe",

        "avaliacao_organizacao",

        "avaliacao_eventos",

        "avaliacao_atualizacoes"


    ];




    for(const campo of avaliacoes){



        const input =
        document.querySelector(
            `input[name="${campo}"]`
        );



        if(
            !input ||
            !input.value
        ){


            alert(
                "Avalie todos os itens antes de continuar."
            );


            return false;


        }


    }



    return true;



}








/* ==========================================================
   CONTINUAR
========================================================== */


function continuar(event){


    event.preventDefault();



    if(
        !validarFormulario()
    )
    return;




    salvarDados();





    if(botao){


        botao.disabled =
        true;



        botao.innerHTML =
        "Salvando...";


    }





    setTimeout(()=>{


        window.location.href =
        "candidatura-termo.html";



    },600);



}







/* ==========================================================
   GARANTIR RESTAURAÇÃO
========================================================== */


window.addEventListener(
    "pageshow",
    ()=>{


        carregarDados();


        document
        .querySelectorAll(".rating")
        .forEach(rating=>{


            const valor =
            rating.querySelector(
                "input[type='hidden']"
            ).value;



            atualizarVisual(
                rating.querySelectorAll(".star"),
                valor
            );


        });



    }
);
