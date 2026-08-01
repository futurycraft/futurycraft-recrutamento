/* ==========================================================
   FUTURYCRAFT
   CANDIDATURA STAFF
   ETAPA 2 - CONTA E SERVIDOR
========================================================== */


const STORAGE = "futury_candidatura";



document.addEventListener("DOMContentLoaded",()=>{


    carregarDados();

    configurarEventos();


});





/* ==========================================================
ELEMENTOS
========================================================== */


const form = document.getElementById(
    "form-conta"
);



const tempoServidor =
document.getElementById(
    "tempo_servidor"
);



const tempoValor =
document.getElementById(
    "tempo-valor"
);




const radios = document.querySelectorAll(
    'input[type="radio"]'
);



const checkboxesDias =
document.querySelectorAll(
    '.dia input[type="checkbox"]'
);







/* ==========================================================
EVENTOS
========================================================== */


function configurarEventos(){



    radios.forEach(radio=>{


        radio.addEventListener(
            "change",
            salvarDados
        );


    });




    checkboxesDias.forEach(check=>{


        check.addEventListener(
            "change",
            salvarDados
        );


    });





    if(tempoServidor){


        tempoServidor.addEventListener(
            "input",
            ()=>{


                atualizarTempo();


                salvarDados();


            }
        );


    }






    form.addEventListener(
        "submit",
        enviarFormulario
    );


}







/* ==========================================================
ATUALIZAR TEXTO TEMPO
========================================================== */


function atualizarTempo(){


    if(!tempoServidor)
        return;



    let valor =
    Number(
        tempoServidor.value
    );



    if(tempoValor){


        if(valor === 0){


            tempoValor.textContent =
            "Menos de 1 mês";


        }

        else if(valor === 60){


            tempoValor.textContent =
            "5 anos ou mais";


        }

        else{


            tempoValor.textContent =
            valor + " meses";


        }


    }



}







/* ==========================================================
SALVAR
========================================================== */


function salvarDados(){



    const dados = JSON.parse(

        localStorage.getItem(STORAGE)

    ) || {};






    const tipoConta =
    document.querySelector(
        'input[name="tipo_conta"]:checked'
    );



    const plataforma =
    document.querySelector(
        'input[name="plataforma"]:checked'
    );



    const acesso =
    document.querySelector(
        'input[name="acesso_conta"]:checked'
    );



    const modo =
    document.querySelector(
        'input[name="modo_interesse"]:checked'
    );



    const horario =
    document.querySelector(
        'input[name="horario_jogo"]:checked'
    );







    dados.tipo_conta =
    tipoConta ?
    tipoConta.value :
    "";



    dados.plataforma =
    plataforma ?
    plataforma.value :
    "";



    dados.acesso_conta =
    acesso ?
    acesso.value :
    "";



    dados.tempo_servidor =
    tempoServidor.value;



    dados.modo_interesse =
    modo ?
    modo.value :
    "";



    dados.horario_jogo =
    horario ?
    horario.value :
    "";







    dados.dias_jogo =

    Array.from(checkboxesDias)

    .filter(
        dia=>dia.checked
    )

    .map(
        dia=>dia.value
    );







    localStorage.setItem(

        STORAGE,

        JSON.stringify(dados)

    );


}







/* ==========================================================
CARREGAR
========================================================== */


function carregarDados(){



    const dados = JSON.parse(

        localStorage.getItem(STORAGE)

    );



    if(!dados)
        return;






    marcarRadio(
        "tipo_conta",
        dados.tipo_conta
    );



    marcarRadio(
        "plataforma",
        dados.plataforma
    );



    marcarRadio(
        "acesso_conta",
        dados.acesso_conta
    );



    marcarRadio(
        "modo_interesse",
        dados.modo_interesse
    );



    marcarRadio(
        "horario_jogo",
        dados.horario_jogo
    );






    if(tempoServidor){


        tempoServidor.value =
        dados.tempo_servidor || 12;


        atualizarTempo();


    }






    if(dados.dias_jogo){


        checkboxesDias.forEach(check=>{


            check.checked =

            dados.dias_jogo.includes(
                check.value
            );


        });


    }


}







function marcarRadio(nome,valor){



    if(!valor)
        return;



    const radio =
    document.querySelector(
        `input[name="${nome}"][value="${valor}"]`
    );



    if(radio){


        radio.checked = true;


    }


}







/* ==========================================================
VALIDAÇÃO
========================================================== */


function validarFormulario(){



    const grupos = [


        "tipo_conta",

        "plataforma",

        "acesso_conta",

        "modo_interesse",

        "horario_jogo"


    ];






    for(const grupo of grupos){



        const selecionado =

        document.querySelector(

            `input[name="${grupo}"]:checked`

        );



        if(!selecionado){


            alert(
                "Preencha todas as opções antes de continuar."
            );


            return false;


        }


    }






    const diasSelecionados =

    Array.from(checkboxesDias)

    .filter(
        d=>d.checked
    );



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
