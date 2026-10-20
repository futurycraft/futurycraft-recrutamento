/* ==========================================================
   FUTURYCRAFT
   GATEWAY DE CANDIDATURA (candidatura.html)
   - Tempo de jogo: o nick e validado no FuturySync e precisa
     ter 30 dias (720h) jogados para liberar QUALQUER vaga.
   - Ajudante: libera com o tempo confirmado.
   - Moderador/Admin: alem do tempo, exigem o cargo anterior
     por 30 dias (conferido ao clicar na vaga).
   Grava a escolha no storage do fluxo e inicia o formulario.
========================================================== */

(function(){

    const MODOS = {
        skyblock: { rotulo: "Skyblock", chave: "futury_candidatura", href: "candidatos.html" },
        rankup: { rotulo: "Rankup", chave: "futury_candidatura", href: "candidatos.html" },
        survival: { rotulo: "Survival", chave: "futury_candidatura", href: "candidatos.html" }
    };

    const VAGAS_BLOQUEADAS = ["Moderador", "Admin"];
    const EXIGENCIA_CARGO = 30;
    const EXIGENCIA_HORAS = 720;
    const SESSAO_CHAVE = "futury_desbloqueio";
    const SESSAO_VALIDADE = 7 * 24 * 60 * 60 * 1000;

    let modo = null;
    let vagaPromocao = null;
    let nickAtual = "";
    let verificando = false;
    let tempoValidado = false;
    let horasJogadas = 0;
    let diasJogados = 0;

    const desbloqueadas = {
        Moderador: false,
        Admin: false
    };

    const cardsVaga = document.querySelectorAll(".vaga-card");
    const cardsModo = document.querySelectorAll(".modo-card");
    const ctaAjudante = document.getElementById("cta-ajudante");
    const ctaPromocao = document.getElementById("cta-promocao");
    const hint = document.getElementById("cta-hint");

    const barra = document.getElementById("painel-desbloqueio");
    const selo = document.getElementById("verificacao-selo");
    const progresso = document.getElementById("verificacao-progresso");
    const barraFill = document.getElementById("verificacao-fill");
    const detalhe = document.getElementById("verificacao-detalhe");
    const nickInput = document.getElementById("nick-verificacao");
    const btnVerificar = document.getElementById("btn-verificar");
    const msg = document.getElementById("msg-desbloqueio");


    /* ==========================================================
       ESTADO SALVO (validacao permanece 7 dias)
    ========================================================== */


    function carregarSessao(){
        try {
            const salvo = JSON.parse(
                localStorage.getItem(SESSAO_CHAVE) || "null"
            );

            if (!salvo || !salvo.salvo_em)
                return;

            if (Date.now() - salvo.salvo_em > SESSAO_VALIDADE) {
                localStorage.removeItem(SESSAO_CHAVE);
                return;
            }

            if (salvo.nick) {
                nickAtual = salvo.nick;
            }

            tempoValidado = !!salvo.tempo_validado;
            horasJogadas = Number(salvo.horas_jogadas) || 0;
            diasJogados = Number(salvo.dias_jogados) || 0;

            (salvo.liberadas || []).forEach(function (rotulo) {
                if (desbloqueadas.hasOwnProperty(rotulo)) {
                    desbloqueadas[rotulo] = true;
                }
            });

            if (nickInput && nickAtual) {
                nickInput.value = nickAtual;
            }

            atualizarBarra();
            aplicarDesbloqueios();

            if (tempoValidado && nickConfirmado()) {
                mostrarMensagem(
                    "Nick confirmado: " + horasJogadas + "h jogadas. Vagas liberadas.",
                    "ok"
                );
            }
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
            SESSAO_CHAVE,
            JSON.stringify({
                nick: nickAtual,
                salvo_em: Date.now(),
                tempo_validado: tempoValidado,
                horas_jogadas: horasJogadas,
                dias_jogados: diasJogados,
                liberadas: liberadas
            })
        );
    }


    function limparPromocoes(){
        desbloqueadas.Moderador = false;
        desbloqueadas.Admin = false;
        vagaPromocao = null;
        cardsVaga.forEach(function (card) {
            card.classList.remove("selecionado");
        });
    }


    /* ==========================================================
       BARRA DE VERIFICACAO
    ========================================================== */


    function nickConfirmado(){
        if (!tempoValidado || !nickAtual) return false;
        const atual = nickInput ? nickInput.value.trim() : "";
        return atual.toLowerCase() === nickAtual.toLowerCase();
    }


    function atualizarBarra(){
        const confirmado = nickConfirmado();

        if (barra) {
            barra.classList.toggle("liberada", confirmado);
        }

        if (selo) {
            selo.textContent = confirmado ? "Liberado" : "Pendente";
            selo.classList.toggle("ok", confirmado);
        }

        const consultado = tempoValidado || horasJogadas > 0;

        if (progresso) {
            progresso.hidden = !consultado;
        }

        if (barraFill) {
            const pct = Math.min(
                100,
                Math.round((horasJogadas / EXIGENCIA_HORAS) * 100)
            );
            barraFill.style.width = pct + "%";
        }

        if (detalhe && consultado) {
            detalhe.textContent =
                horasJogadas + "h de " + EXIGENCIA_HORAS + "h (" +
                Math.min(30, diasJogados) + "/30 dias)" +
                (confirmado ? "" : " — confirme o nick");
        }
    }


    function mostrarMensagem(texto, tipo){
        if (!msg) return;
        msg.textContent = texto;
        msg.classList.remove("ok", "erro");

        if (tipo) {
            msg.classList.add(tipo);
        }
    }


    function mensagemTempo(dados){
        if (dados.motivo === "nick_invalido") {
            return "Digite um nick válido (3 a 24 caracteres).";
        }

        if (dados.motivo === "nick_nao_encontrado") {
            return "Nick não encontrado no FuturySync. Use o nick exato do jogo.";
        }

        if (dados.motivo === "tempo_indisponivel") {
            return "Não foi possível ler seu tempo de jogo agora. Tente novamente em instantes.";
        }

        if (dados.motivo === "tempo_insuficiente") {
            const horas = Number(dados.horas_jogadas) || 0;
            const falta = Math.max(0, EXIGENCIA_HORAS - horas);
            return "Faltam " + falta + "h de jogo. Você tem " +
                horas + "h de " + EXIGENCIA_HORAS + "h (30 dias).";
        }

        return "Não foi possível validar seu nick. Tente novamente.";
    }


    function mensagemCargo(dados){
        if (
            dados.motivo === "nick_invalido" ||
            dados.motivo === "nick_nao_encontrado" ||
            dados.motivo === "tempo_indisponivel" ||
            dados.motivo === "tempo_insuficiente"
        ) {
            return mensagemTempo(dados);
        }

        const cargo = dados.cargo ? dados.cargo : "o cargo anterior";

        if (dados.motivo === "staff_nao_encontrado") {
            return "Nick validado no jogo, mas não encontrado como staff para essa promoção.";
        }

        if (dados.motivo === "cargo_incorreto") {
            return "Bloqueado: essa promoção exige estar ativo como " + cargo + ".";
        }

        const falta = Math.max(
            0,
            (dados.exigido_cargo_dias || EXIGENCIA_CARGO) -
            (dados.dias_cargo || 0)
        );

        return "Bloqueado: faltam " + falta +
            " dia(s) ativo como " + cargo + " para liberar essa vaga.";
    }


    function travarBotoes(texto){
        if (btnVerificar) {
            btnVerificar.disabled = true;
            btnVerificar.innerHTML =
                texto + ' <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>';
        }
    }


    function liberarBotao(){
        if (btnVerificar) {
            btnVerificar.disabled = false;
            btnVerificar.innerHTML =
                'Verificar <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';
        }
    }


    async function verificarNick(){
        const nick = nickInput ? nickInput.value.trim() : "";

        if (nick.length < 3) {
            mostrarMensagem("Digite seu nick do servidor para verificar.", "erro");
            return;
        }

        if (verificando)
            return;

        verificando = true;
        travarBotoes("Verificando");
        mostrarMensagem("", "");

        try {
            const resp = await fetch("./api/desbloqueio.js", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nick: nick, vaga: "Ajudante" })
            });

            const dados = await resp.json();

            if (!dados || dados.sucesso === false) {
                mostrarMensagem(
                    (dados && dados.erro) || "Não foi possível validar. Tente de novo.",
                    "erro"
                );
                return;
            }

            horasJogadas = Number(dados.horas_jogadas) || 0;
            diasJogados = Number(dados.dias_jogados) || 0;

            if (dados.liberado) {
                const mesmoNick =
                    nickAtual &&
                    nickAtual.toLowerCase() === nick.toLowerCase();

                if (!mesmoNick) {
                    limparPromocoes();
                }

                nickAtual = nick;
                tempoValidado = true;
                salvarSessao();
                atualizarBarra();
                aplicarDesbloqueios();

                mostrarMensagem(
                    "Nick confirmado: " + horasJogadas +
                    "h jogadas (" + diasJogados + " dias). Vagas liberadas.",
                    "ok"
                );
            } else {
                tempoValidado = false;
                limparPromocoes();
                atualizarBarra();
                aplicarDesbloqueios();
                mostrarMensagem(mensagemTempo(dados), "erro");
            }
        } catch (erro) {
            mostrarMensagem(
                "Falha de conexão. Verifique sua internet e tente de novo.",
                "erro"
            );
        } finally {
            verificando = false;
            liberarBotao();
        }
    }


    async function verificarPromocao(rotulo){
        if (!nickConfirmado()) {
            mostrarMensagem(
                "Valide seu nick na barra acima para desbloquear as vagas.",
                "erro"
            );
            if (nickInput) nickInput.focus();
            return;
        }

        if (verificando)
            return;

        verificando = true;
        travarBotoes("Verificando cargo");
        mostrarMensagem("", "");

        try {
            const resp = await fetch("./api/desbloqueio.js", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nick: nickAtual, vaga: rotulo })
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
                desbloqueadas[rotulo] = true;
                salvarSessao();
                aplicarDesbloqueios();
                selecionarVaga(rotulo);

                hint.textContent = modo
                    ? "Vaga " + rotulo + " liberada! Clique em iniciar formulário."
                    : "Vaga " + rotulo + " liberada! Agora escolha o servidor.";
                hint.classList.add("visivel");

                mostrarMensagem("Vaga " + rotulo + " liberada.", "ok");
            } else {
                mostrarMensagem(mensagemCargo(dados), "erro");
            }
        } catch (erro) {
            mostrarMensagem(
                "Falha de conexão. Verifique sua internet e tente de novo.",
                "erro"
            );
        } finally {
            verificando = false;
            liberarBotao();
        }
    }


    /* ==========================================================
       CARDS E BOTOES
    ========================================================== */


    function aplicarCard(card, liberada){
        card.classList.toggle("bloqueada", !liberada);

        const btn = card.querySelector(".server-btn");
        if (btn) {
            btn.innerHTML = liberada
                ? 'Selecionar vaga <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>'
                : 'Bloqueado';
        }

        let cadeado = card.querySelector(".vaga-lock");

        if (liberada) {
            if (cadeado) cadeado.remove();
            return;
        }

        if (!cadeado) {
            cadeado = document.createElement("span");
            cadeado.className = "vaga-lock";
            cadeado.setAttribute("aria-hidden", "true");
            cadeado.innerHTML = '<i class="fa-solid fa-lock"></i>';
            card.appendChild(cadeado);
        }
    }


    function aplicarDesbloqueios(){
        const confirmado = nickConfirmado();

        cardsVaga.forEach(function (card) {
            const rotulo = card.dataset.vaga;
            const liberada = confirmado && !!desbloqueadas[rotulo];
            aplicarCard(card, liberada);
        });

        atualizarCtas();
    }


    function atualizarCtas(){
        const servidorOk = !!modo;
        const confirmado = nickConfirmado();

        if (ctaAjudante) {
            const pronto = servidorOk && confirmado;

            ctaAjudante.disabled = !servidorOk;
            ctaAjudante.classList.toggle("pronto", pronto);
            ctaAjudante.classList.toggle("cta-travado", !pronto);
            ctaAjudante.innerHTML = pronto
                ? 'Iniciar formulário <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>'
                : '<i class="fa-solid fa-lock" aria-hidden="true"></i> Iniciar formulário';
        }

        if (ctaPromocao) {
            const liberada =
                confirmado && !!vagaPromocao && !!desbloqueadas[vagaPromocao];
            const pronto = servidorOk && liberada;

            ctaPromocao.disabled = !pronto;
            ctaPromocao.classList.toggle("pronto", pronto);
            ctaPromocao.classList.toggle("cta-travado", !pronto);

            if (pronto) {
                ctaPromocao.innerHTML =
                    'Iniciar formulário de ' + vagaPromocao +
                    ' <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';
            } else {
                ctaPromocao.innerHTML =
                    '<i class="fa-solid fa-lock" aria-hidden="true"></i> Iniciar formulário de ' +
                    (vagaPromocao || "Moderador+");
            }
        }
    }


    function selecionarVaga(rotulo){
        cardsVaga.forEach(function (card) {
            card.classList.toggle("selecionado", card.dataset.vaga === rotulo);
        });
        vagaPromocao = rotulo === "Ajudante" ? null : rotulo;
        atualizarCtas();
    }


    function iniciar(vagaEscolhida){
        if (!modo) {
            hint.textContent = "Escolha o servidor para continuar.";
            hint.classList.add("visivel");
            return;
        }

        if (!nickConfirmado()) {
            mostrarMensagem(
                "Valide seu nick na barra acima antes de iniciar o formulário.",
                "erro"
            );
            if (nickInput) nickInput.focus();
            return;
        }

        if (
            vagaEscolhida !== "Ajudante" &&
            !desbloqueadas[vagaEscolhida]
        ) {
            mostrarMensagem(
                "Confira o cargo anterior antes de iniciar essa promoção.",
                "erro"
            );
            return;
        }

        const alvo = MODOS[modo];

        localStorage.setItem(
            alvo.chave,
            JSON.stringify({
                vaga: vagaEscolhida,
                modo_interesse: alvo.rotulo,
                nick: nickAtual,
                nick_verificado: nickAtual,
                horas_jogadas: horasJogadas,
                salvo_em: Date.now()
            })
        );

        window.location.href = "./" + alvo.href;
    }


    /* ==========================================================
       EVENTOS
    ========================================================== */


    cardsVaga.forEach(function (card) {
        card.addEventListener("click", function () {
            const rotulo = card.dataset.vaga;

            if (!nickConfirmado()) {
                hint.classList.remove("visivel");
                mostrarMensagem(
                    "Valide seu nick na barra acima para desbloquear as vagas.",
                    "erro"
                );
                if (nickInput) nickInput.focus();
                return;
            }

            if (
                VAGAS_BLOQUEADAS.indexOf(rotulo) !== -1 &&
                !desbloqueadas[rotulo]
            ) {
                hint.classList.remove("visivel");
                verificarPromocao(rotulo);
                return;
            }

            hint.classList.remove("visivel");
            selecionarVaga(rotulo);
        });
    });


    cardsModo.forEach(function (card) {
        card.addEventListener("click", function () {
            cardsModo.forEach(function (x) { x.classList.remove("selecionado"); });
            card.classList.add("selecionado");
            modo = card.dataset.modo;
            hint.classList.remove("visivel");
            atualizarCtas();
        });
    });


    if (btnVerificar) {
        btnVerificar.addEventListener("click", verificarNick);
    }

    if (nickInput) {
        nickInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                verificarNick();
            }
        });

        nickInput.addEventListener("input", function () {
            mostrarMensagem("", "");
            atualizarBarra();
            aplicarDesbloqueios();
        });
    }

    if (ctaAjudante) {
        ctaAjudante.addEventListener("click", function () {
            iniciar("Ajudante");
        });
    }

    if (ctaPromocao) {
        ctaPromocao.addEventListener("click", function () {
            if (!vagaPromocao || !desbloqueadas[vagaPromocao])
                return;
            iniciar(vagaPromocao);
        });
    }


    /* ==========================================================
       PRESELECAO POR URL (?modo=rankup|survival)
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


    preselecionarModo();
    carregarSessao();
    selecionarVaga("Ajudante");

    if (!msg || !msg.textContent) {
        mostrarMensagem(
            "Digite seu nick para conferir o tempo de jogo no FuturySync.",
            ""
        );
    }

})();
