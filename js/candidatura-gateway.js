/* ==========================================================
   FUTURYCRAFT
   GATEWAY DE CANDIDATURA (candidatura.html)
   Seleção de vaga (Ajudante/Moderador/Admin) + servidor.
   Moderador e Admin são promoções bloqueadas: só liberam para
   staff ativo há 30 dias no cargo anterior (validado via
   api/desbloqueio.js contra cargo_historico). Grava a escolha
   no storage do fluxo e inicia o formulário.
========================================================== */

(function(){

    const MODOS = {
        skyblock: { rotulo: "Skyblock", chave: "futury_candidatura", href: "candidatos.html" },
        rankup: { rotulo: "Rankup", chave: "futury_candidatura", href: "candidatos.html" },
        survival: { rotulo: "Survival", chave: "futury_candidatura", href: "candidatos.html" }
    };

    const VAGAS_BLOQUEADAS = ["Moderador", "Admin"];
    const EXIGENCIA = 30;
    const SESSIAO_CHAVE = "futury_desbloqueio";
    const SESSIAO_VALIDADE = 7 * 24 * 60 * 60 * 1000;

    let vaga = null;
    let modo = null;
    let nickAtual = "";
    let verificando = false;

    const desbloqueadas = {
        Moderador: false,
        Admin: false
    };

    const cardsVaga = document.querySelectorAll(".vaga-card");
    const cardsModo = document.querySelectorAll(".modo-card");
    const cta = document.getElementById("cta-iniciar");
    const hint = document.getElementById("cta-hint");

    const painel = document.getElementById("painel-desbloqueio");
    const painelTitulo = document.getElementById("painel-titulo");
    const painelSub = document.getElementById("painel-sub");
    const nickInput = document.getElementById("nick-verificacao");
    const btnVerificar = document.getElementById("btn-verificar");
    const msgDesbloqueio = document.getElementById("msg-desbloqueio");
    const painelFechar = document.getElementById("painel-fechar");


    /* ==========================================================
       ESTADO SALVO (desbloqueio permanece 7 dias)
    ========================================================== */


    function carregarSessao(){
        try {
            const salvo = JSON.parse(
                localStorage.getItem(SESSIAO_CHAVE) || "null"
            );

            if (!salvo || !salvo.salvo_em)
                return;

            if (Date.now() - salvo.salvo_em > SESSIAO_VALIDADE) {
                localStorage.removeItem(SESSIAO_CHAVE);
                return;
            }

            if (salvo.nick) {
                nickAtual = salvo.nick;
            }

            (salvo.liberadas || []).forEach(function (rotulo) {
                if (desbloqueadas.hasOwnProperty(rotulo)) {
                    desbloqueadas[rotulo] = true;
                }
            });

            aplicarDesbloqueios();
        } catch (ignorar) {}
    }


    function salvarSessao(){
        const liberadas = [];

        Object.keys(desbloqueadas).forEach(function (rotulo) {
            if (desbloqueadas[rotulo]) {
                liberadas.push(rotulo);
            }
        });

        localStorage.setItem(
            SESSIAO_CHAVE,
            JSON.stringify({
                nick: nickAtual,
                salvo_em: Date.now(),
                liberadas: liberadas
            })
        );
    }


    function aplicarDesbloqueios(){
        cardsVaga.forEach(function (card) {
            const rotulo = card.dataset.vaga;

            if (desbloqueadas[rotulo]) {
                card.classList.remove("bloqueada");
                const btn = card.querySelector(".server-btn");
                if (btn) {
                    btn.innerHTML =
                        'Selecionar vaga <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';
                }
                const cadeado = card.querySelector(".vaga-lock");
                if (cadeado) {
                    cadeado.remove();
                }
            }
        });
    }


    /* ==========================================================
       CTA
    ========================================================== */


    function atualizarCta(){
        if (vaga && modo) {
            cta.disabled = false;
            cta.classList.add("pronto");
        }
    }


    /* ==========================================================
       PAINEL DE DESBLOQUEIO
    ========================================================== */


    function mostrarPainel(rotulo){
        if (!painel)
            return;

        const cargoExigido =
            rotulo === "Moderador" ? "Ajudante" : "Moderador";

        painelTitulo.textContent = "Liberar vaga de " + rotulo;
        painelSub.textContent =
            "Promoção: exige " + EXIGENCIA +
            " dias ativo como " + cargoExigido +
            ". Informe seu nick de staff para validar.";

        msgDesbloqueio.textContent = "";
        msgDesbloqueio.classList.remove("ok", "erro");
        nickInput.value = nickAtual;

        painel.classList.remove("escondido");
        nickInput.focus();
    }


    function fecharPainel(){
        if (painel) {
            painel.classList.add("escondido");
        }
    }


    function mostrarMensagem(texto, tipo){
        msgDesbloqueio.textContent = texto;
        msgDesbloqueio.classList.remove("ok", "erro");

        if (tipo) {
            msgDesbloqueio.classList.add(tipo);
        }
    }


    async function verificarVaga(){
        const rotulo = vagaPendente;
        const nick = nickInput.value.trim();

        if (nick.length < 3) {
            mostrarMensagem("Digite seu nick para verificar.", "erro");
            return;
        }

        if (verificando)
            return;

        verificando = true;
        btnVerificar.disabled = true;
        btnVerificar.innerHTML =
            'Verificando... <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>';
        mostrarMensagem("", "");

        try {
            const resp = await fetch("./api/desbloqueio.js", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nick: nick, vaga: rotulo })
            });

            const dados = await resp.json();

            if (!dados || dados.sucesso === false) {
                mostrarMensagem(
                    (dados && dados.erro) || "Não foi possível validar. Tente de novo.",
                    "erro"
                );
                return;
            }

            if (dados.liberado) {
                nickAtual = nick;
                desbloqueadas[rotulo] = true;
                salvarSessao();
                aplicarDesbloqueios();
                fecharPainel();

                selecionarVaga(rotulo);
                hint.textContent = "Vaga " + rotulo + " liberada! Agora escolha o servidor.";
                hint.classList.add("visivel");
            } else {
                mostrarMensagem(mensagemBloqueio(dados), "erro");
            }
        } catch (erro) {
            mostrarMensagem("Falha de conexão. Verifique sua internet e tente de novo.", "erro");
        } finally {
            verificando = false;
            btnVerificar.disabled = false;
            btnVerificar.innerHTML =
                'Verificar <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';
        }
    }


    function mensagemBloqueio(dados){
        const cargo = dados.cargo ? dados.cargo : "o cargo anterior";

        if (dados.motivo === "staff_nao_encontrado") {
            return "Seu nick não foi reconhecido como staff do servidor. Confira e tente de novo.";
        }

        if (dados.motivo === "cargo_incorreto") {
            return "Bloqueado: essa promoção exige estar ativo como " + cargo + ".";
        }

        const falta = Math.max(0, (dados.exigido || EXIGENCIA) - (dados.dias || 0));
        return "Bloqueado: faltam " + falta +
            " dia(s) ativo como " + cargo + " para liberar essa vaga.";
    }


    /* ==========================================================
       SELEÇÃO DE VAGA
    ========================================================== */

    let vagaPendente = null;

    function selecionarVaga(rotulo){
        cardsVaga.forEach(function (card) {
            card.classList.toggle("selecionado", card.dataset.vaga === rotulo);
        });
        vaga = rotulo;
        atualizarCta();
    }


    cardsVaga.forEach(card => {
        card.addEventListener("click", () => {
            const rotulo = card.dataset.vaga;

            if (VAGAS_BLOQUEADAS.indexOf(rotulo) !== -1 && !desbloqueadas[rotulo]) {
                if (!vaga) {
                    hint.textContent = "";
                    hint.classList.remove("visivel");
                }
                vagaPendente = rotulo;
                mostrarPainel(rotulo);
                return;
            }

            vagaPendente = null;
            hint.classList.remove("visivel");
            selecionarVaga(rotulo);
        });
    });


    /* ==========================================================
       SELEÇÃO DE SERVIDOR
    ========================================================== */


    cardsModo.forEach(card => {
        card.addEventListener("click", () => {
            if (!vaga) {
                hint.textContent = "Primeiro escolha a vaga acima.";
                hint.classList.add("visivel");
                return;
            }
            cardsModo.forEach(x => x.classList.remove("selecionado"));
            card.classList.add("selecionado");
            modo = card.dataset.modo;
            hint.classList.remove("visivel");
            atualizarCta();
        });
    });


    /* ==========================================================
       PRESELEÇÃO POR URL (?modo=rankup|survival)
    ========================================================== */


    function preselecionarModo(){
        const parametros = new URLSearchParams(window.location.search);
        const modoInicial = parametros.get("modo");

        const card = modoInicial && MODOS[modoInicial]
            ? document.querySelector('.modo-card[data-modo="' + modoInicial + '"]')
            : null;

        if (card) {
            card.classList.add("selecionado");
            modo = card.dataset.modo;
        }
    }


    /* ==========================================================
       INICIAR
    ========================================================== */


    if (btnVerificar) {
        btnVerificar.addEventListener("click", verificarVaga);
    }

    if (nickInput) {
        nickInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                verificarVaga();
            }
        });
    }

    if (painelFechar) {
        painelFechar.addEventListener("click", fecharPainel);
    }

    cta.addEventListener("click", () => {
        if (!vaga || !modo)
            return;

        const alvo = MODOS[modo];

        localStorage.setItem(
            alvo.chave,
            JSON.stringify({
                vaga: vaga,
                modo_interesse: alvo.rotulo
            })
        );

        window.location.href = "./" + alvo.href;
    });

    carregarSessao();
    preselecionarModo();

    if (!vaga) {
        selecionarVaga("Ajudante");
    }

})();