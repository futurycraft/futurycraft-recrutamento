/* ==========================================================
   FUTURYCRAFT
   CANDIDATURA STAFF
   ETAPA 4 - FEEDBACK
========================================================== */

const STORAGE = "futury_candidatura";

document.addEventListener("DOMContentLoaded", () => {

    carregarDados();

    configurarEventos();

});


/* ==========================================================
ELEMENTOS
========================================================== */

const form = document.getElementById("form-feedback");

const avaliacaoServidor =
document.getElementById("avaliacao_servidor");

const avaliacaoEquipe =
document.getElementById("avaliacao_equipe");

const avaliacaoOrganizacao =
document.getElementById("avaliacao_organizacao");

const avaliacaoEventos =
document.getElementById("avaliacao_eventos");

const avaliacaoAtualizacoes =
document.getElementById("avaliacao_atualizacoes");

const melhorias =
document.getElementById("melhorias");


/* ==========================================================
EVENTOS
========================================================== */

function configurarEventos(){

    [

        avaliacaoServidor,

        avaliacaoEquipe,

        avaliacaoOrganizacao,

        avaliacaoEventos,

        avaliacaoAtualizacoes,

        melhorias

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

    dados.avaliacao_servidor =
    avaliacaoServidor.value;

    dados.avaliacao_equipe =
    avaliacaoEquipe.value;

    dados.avaliacao_organizacao =
    avaliacaoOrganizacao.value;

    dados.avaliacao_eventos =
    avaliacaoEventos.value;

    dados.avaliacao_atualizacoes =
    avaliacaoAtualizacoes.value;

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

    const dados = JSON.parse(

        localStorage.getItem(STORAGE)

    );

    if(!dados)
        return;

    avaliacaoServidor.value =
    dados.avaliacao_servidor || "";

    avaliacaoEquipe.value =
    dados.avaliacao_equipe || "";

    avaliacaoOrganizacao.value =
    dados.avaliacao_organizacao || "";

    avaliacaoEventos.value =
    dados.avaliacao_eventos || "";

    avaliacaoAtualizacoes.value =
    dados.avaliacao_atualizacoes || "";

    melhorias.value =
    dados.melhorias || "";

}


/* ==========================================================
VALIDAÇÃO
========================================================== */

function validarFormulario(){

    if(!avaliacaoServidor.value){

        alert("Avalie o FuturyCraft.");

        avaliacaoServidor.focus();

        return false;

    }

    if(!avaliacaoEquipe.value){

        alert("Avalie o atendimento da equipe.");

        avaliacaoEquipe.focus();

        return false;

    }

    if(!avaliacaoOrganizacao.value){

        alert("Avalie a organização do servidor.");

        avaliacaoOrganizacao.focus();

        return false;

    }

    if(!avaliacaoEventos.value){

        alert("Avalie os eventos.");

        avaliacaoEventos.focus();

        return false;

    }

    if(!avaliacaoAtualizacoes.value){

        alert("Avalie as atualizações.");

        avaliacaoAtualizacoes.focus();

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
    "candidatura-termo.html";

}
