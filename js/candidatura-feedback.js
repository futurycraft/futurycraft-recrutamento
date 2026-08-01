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
const melhorias = document.getElementById("melhorias");
const botao = document.querySelector(".btn-principal");

/* ==========================================================
EVENTOS
========================================================== */

function configurarEventos() {

    if (!form) return;

    form.addEventListener("submit", continuar);

    document.querySelectorAll("input[type='radio']").forEach(input => {
        input.addEventListener("change", salvarDados);
    });

    if (melhorias) {
        melhorias.addEventListener("input", salvarDados);
    }

}

/* ==========================================================
SALVAR
========================================================== */

function salvarDados() {

    const dados = JSON.parse(localStorage.getItem(STORAGE)) || {};

    dados.avaliacao_servidor =
        document.querySelector("input[name='avaliacao_servidor']:checked")?.value || "";

    dados.avaliacao_equipe =
        document.querySelector("input[name='avaliacao_equipe']:checked")?.value || "";

    dados.avaliacao_organizacao =
        document.querySelector("input[name='avaliacao_organizacao']:checked")?.value || "";

    dados.avaliacao_eventos =
        document.querySelector("input[name='avaliacao_eventos']:checked")?.value || "";

    dados.avaliacao_atualizacoes =
        document.querySelector("input[name='avaliacao_atualizacoes']:checked")?.value || "";

    dados.melhorias =
        melhorias ? melhorias.value.trim() : "";

    localStorage.setItem(
        STORAGE,
        JSON.stringify(dados)
    );

}

/* ==========================================================
CARREGAR
========================================================== */

function carregarDados() {

    const dados = JSON.parse(
        localStorage.getItem(STORAGE)
    );

    if (!dados) return;

    restaurarRadio(
        "avaliacao_servidor",
        dados.avaliacao_servidor
    );

    restaurarRadio(
        "avaliacao_equipe",
        dados.avaliacao_equipe
    );

    restaurarRadio(
        "avaliacao_organizacao",
        dados.avaliacao_organizacao
    );

    restaurarRadio(
        "avaliacao_eventos",
        dados.avaliacao_eventos
    );

    restaurarRadio(
        "avaliacao_atualizacoes",
        dados.avaliacao_atualizacoes
    );

    if (melhorias) {
        melhorias.value =
            dados.melhorias || "";
    }

}

function restaurarRadio(nome, valor) {

    if (!valor) return;

    const radio = document.querySelector(
        `input[name="${nome}"][value="${valor}"]`
    );

    if (radio) {
        radio.checked = true;
    }

}

/* ==========================================================
VALIDAÇÃO
========================================================== */

function validarFormulario() {

    const obrigatorios = [

        "avaliacao_servidor",

        "avaliacao_equipe",

        "avaliacao_organizacao",

        "avaliacao_eventos",

        "avaliacao_atualizacoes"

    ];

    for (const campo of obrigatorios) {

        const marcado = document.querySelector(
            `input[name="${campo}"]:checked`
        );

        if (!marcado) {

            alert("Avalie todos os itens antes de continuar.");

            return false;

        }

    }

    return true;

}

/* ==========================================================
CONTINUAR
========================================================== */

function continuar(event) {

    event.preventDefault();

    if (!validarFormulario())
        return;

    salvarDados();

    if (botao) {

        botao.disabled = true;

        botao.innerHTML =
            "Continuando...";

    }

    setTimeout(() => {

        window.location.href =
            "candidatura-termo.html";

    }, 600);

}
