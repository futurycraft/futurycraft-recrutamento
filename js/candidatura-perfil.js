/* ==========================================================
   FUTURYCRAFT
   CANDIDATURA STAFF
   ETAPA 3 - PERFIL
========================================================== */


const STORAGE = "futury_candidatura";


document.addEventListener("DOMContentLoaded", () => {

    carregarDados();

    configurarEventos();

});



/* ==========================================================
ELEMENTOS
========================================================== */


const form = document.getElementById("form-perfil");


const campos = {

    sobre_voce:
    document.getElementById("sobre_voce"),

    bom_ajudante:
    document.getElementById("bom_ajudante"),

    destaque:
    document.getElementById("destaque"),

    jogador_toxico:
    document.getElementById("jogador_toxico"),

    suspeita_hack:
    document.getElementById("suspeita_hack"),

    amigo_regra:
    document.getElementById("amigo_regra"),

    punicao_injusta:
    document.getElementById("punicao_injusta"),

    novo_jogador:
    document.getElementById("novo_jogador"),

    experiencia_staff:
    document.querySelector(
      'input[name="experiencia_staff"]:checked'
      )?.value || "";

    servidor_anterior:
    document.getElementById("servidor_anterior"),

    cargo_anterior:
    document.getElementById("cargo_anterior"),

    tempo_staff:
    document.getElementById("tempo_staff"),

    motivo_saida:
    document.getElementById("motivo_saida")

};



const experienciaBox =
document.getElementById("experiencia-box");



/* ==========================================================
EVENTOS
========================================================== */


function configurarEventos(){


    Object.values(campos)

    .forEach(campo => {


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



    campos.experiencia_staff

    .addEventListener(
        "change",
        controlarExperiencia
    );



    form.addEventListener(
        "submit",
        enviarFormulario
    );


}



/* ==========================================================
MOSTRAR EXPERIÊNCIA
========================================================== */


function controlarExperiencia(){


    if(
        campos.experiencia_staff.value
        ===
        "Sim"
    ){


        experienciaBox.classList.remove(
            "escondido"
        );


        experienciaBox.classList.add(
            "mostrar"
        );


    }else{


        experienciaBox.classList.add(
            "escondido"
        );


        experienciaBox.classList.remove(
            "mostrar"
        );


    }



    salvarDados();

}



/* ==========================================================
SALVAR
========================================================== */


function salvarDados(){


    const dados = JSON.parse(

        localStorage.getItem(STORAGE)

    ) || {};



    Object.keys(campos)

    .forEach(chave => {


        if(campos[chave]){


            dados[chave] =

            campos[chave].value;


        }


    });



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



    Object.keys(campos)

    .forEach(chave => {


        if(

            campos[chave]

            &&

            dados[chave]

        ){


            campos[chave].value =

            dados[chave];


        }


    });



    controlarExperiencia();



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

            campos[campo].value.trim()
            .length < 10

        ){


            alert(

                "Responda todas as perguntas com mais detalhes."

            );


            campos[campo].focus();


            return false;


        }


    }



    if(

        !campos.experiencia_staff.value

    ){


        alert(

            "Informe se já fez parte de uma equipe."

        );


        campos.experiencia_staff.focus();


        return false;


    }




    if(

        campos.experiencia_staff.value
        ===
        "Sim"

    ){


        if(

            campos.servidor_anterior.value.trim()
            === ""

            ||

            campos.cargo_anterior.value.trim()
            === ""

            ||

            campos.tempo_staff.value.trim()
            === ""

            ||

            campos.motivo_saida.value.trim()
            === ""

        ){


            alert(

                "Preencha todas as informações da experiência anterior."

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

    "candidatura-feedback.html";


}
