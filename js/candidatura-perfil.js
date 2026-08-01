/* ==========================================================
   FUTURYCRAFT
   CANDIDATURA STAFF
   ETAPA 3 - PERFIL
========================================================== */


const STORAGE = "futury_candidatura";



document.addEventListener(
"DOMContentLoaded",
()=>{


    carregarDados();


    configurarEventos();


    controlarExperiencia();


});





/* ==========================================================
ELEMENTOS
========================================================== */


const form =
document.getElementById(
    "form-perfil"
);




const campos = {


    sobre_voce:
    document.getElementById(
        "sobre_voce"
    ),


    bom_ajudante:
    document.getElementById(
        "bom_ajudante"
    ),


    destaque:
    document.getElementById(
        "destaque"
    ),


    jogador_toxico:
    document.getElementById(
        "jogador_toxico"
    ),


    suspeita_hack:
    document.getElementById(
        "suspeita_hack"
    ),


    amigo_regra:
    document.getElementById(
        "amigo_regra"
    ),


    punicao_injusta:
    document.getElementById(
        "punicao_injusta"
    ),


    novo_jogador:
    document.getElementById(
        "novo_jogador"
    ),


    servidor_anterior:
    document.getElementById(
        "servidor_anterior"
    ),


    cargo_anterior:
    document.getElementById(
        "cargo_anterior"
    ),


    tempo_staff:
    document.getElementById(
        "tempo_staff"
    ),


    motivo_saida:
    document.getElementById(
        "motivo_saida"
    )


};





const experienciaRadios =
document.querySelectorAll(
    'input[name="experiencia_staff"]'
);




const experienciaBox =
document.getElementById(
    "experiencia-box"
);





/* ==========================================================
EVENTOS
========================================================== */


function configurarEventos(){



    Object.values(campos)

    .forEach(campo=>{


        if(!campo)
            return;



        campo.addEventListener(
            "input",
            salvarDados
        );



        campo.addEventListener(
            "change",
            salvarDados
        );


    });






    experienciaRadios.forEach(radio=>{


        radio.addEventListener(
            "change",
            ()=>{
                
                controlarExperiencia();

            }
        );


    });






    form.addEventListener(
        "submit",
        enviarFormulario
    );


}







/* ==========================================================
CONTROLAR EXPERIÊNCIA STAFF
========================================================== */


function controlarExperiencia(){



    const selecionado =

    document.querySelector(

        'input[name="experiencia_staff"]:checked'

    );




    if(

        selecionado

        &&

        selecionado.value === "Sim"

    ){



        experienciaBox.classList.remove(
            "escondido"
        );



        experienciaBox.classList.add(
            "mostrar"
        );



    }

    else{



        experienciaBox.classList.add(
            "escondido"
        );



        experienciaBox.classList.remove(
            "mostrar"
        );



    }



}







/* ==========================================================
SALVAR DADOS
========================================================== */


function salvarDados(){



    const dados = JSON.parse(

        localStorage.getItem(
            STORAGE
        )

    ) || {};





    Object.keys(campos)

    .forEach(chave=>{


        if(campos[chave]){


            dados[chave] =

            campos[chave].value;


        }


    });






    const experiencia =

    document.querySelector(

        'input[name="experiencia_staff"]:checked'

    );





    dados.experiencia_staff =

    experiencia

    ?

    experiencia.value

    :

    "";






    localStorage.setItem(

        STORAGE,

        JSON.stringify(
            dados
        )

    );


}







/* ==========================================================
CARREGAR DADOS
========================================================== */


function carregarDados(){



    const dados = JSON.parse(

        localStorage.getItem(
            STORAGE
        )

    );




    if(!dados)
        return;






    Object.keys(campos)

    .forEach(chave=>{


        if(

            campos[chave]

            &&

            dados[chave]

        ){



            campos[chave].value =

            dados[chave];



        }



    });







    if(dados.experiencia_staff){



        const radio =

        document.querySelector(

        `input[name="experiencia_staff"][value="${dados.experiencia_staff}"]`

        );



        if(radio){

            radio.checked = true;

        }


    }




}







/* ==========================================================
VALIDAÇÃO
========================================================== */


function validarFormulario(){



    const obrigatorios = [


        "sobre_voce",

        "bom_ajudante",

        "destaque",

        "jogador_toxico",

        "suspeita_hack",

        "amigo_regra",

        "punicao_injusta",

        "novo_jogador"


    ];






    for(
        let campo of obrigatorios
    ){



        if(

            campos[campo].value.trim().length < 10

        ){



            alert(
                "Responda todas as perguntas com mais detalhes."
            );



            campos[campo].focus();



            return false;



        }


    }








    const experiencia =

    document.querySelector(

        'input[name="experiencia_staff"]:checked'

    );





    if(!experiencia){



        alert(

            "Informe se já fez parte de uma equipe."

        );



        return false;



    }







    if(

        experiencia.value === "Sim"

    ){



        const camposExperiencia = [


            campos.servidor_anterior,

            campos.cargo_anterior,

            campos.tempo_staff,

            campos.motivo_saida


        ];






        for(
            let campo of camposExperiencia
        ){



            if(

                campo.value.trim() === ""

            ){



                alert(

                "Preencha todas as informações da experiência anterior."

                );



                campo.focus();



                return false;



            }


        }


    }






    return true;



}







/* ==========================================================
ENVIAR FORMULÁRIO
========================================================== */


function enviarFormulario(event){



    event.preventDefault();





    if(
        !validarFormulario()
    )

        return;






    salvarDados();






    window.location.href =

    "candidatura-feedback.html";



}
