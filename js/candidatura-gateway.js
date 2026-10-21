/* ==========================================================
   FUTURYCRAFT
   GATEWAY DE CANDIDATURA (candidatura.html)
   - Tempo de jogo: o nick e validado e precisa ter 30 dias
     (720h) jogados para liberar a vaga.
   - Ajudante: unico formulario publico.
   - Moderador/Admin (promocao) sairam daqui: quem ja e do
     quadro solicita o upgrade dentro do painel staff.
   Grava a escolha no storage do fluxo e inicia o formulario.
========================================================== */

(function(){

    const MODOS = {
        skyblock: { rotulo: "Skyblock", chave: "futury_candidatura", href: "candidatos.html" },
        rankup: { rotulo: "Rankup", chave: "futury_candidatura", href: "candidatos.html" },
        survival: { rotulo: "Survival", chave: "futury_candidatura", href: "candidatos.html" }
    };

    const EXIGENCIA_HORAS = 720;
    const SESSAO_CHAVE = "futury_desbloqueio";
    const SESSAO_VALIDADE = 7 * 24 * 60 * 60 * 1000;

    let modo = null;
    let nickAtual = "";
    let verificando = false;
    let tempoValidado = false;
    let horasJogadas = 0;
    let diasJogados = 0;

    const cardsModo = document.querySelectorAll(".modo-card");
    const ctaAjudante = document.getElementById("cta-ajudante");
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

            if (nickInput && nickAtual) {
                nickInput.value = nickAtual;
            }

            atualizarBarra();
            atualizarCtas();

            if (tempoValidado && nickConfirmado()) {
                mostrarMensagem(
                    "Nick confirmado: " + horasJogadas + "h jogadas. Vaga liberada.",
                    "ok"
                );
            }
        } catch (ignorar) {}
    }


    function salvarSessao(){
        localStorage.setItem(
            SESSAO_CHAVE,
            JSON.stringify({
                nick: nickAtual,
                salvo_em: Date.now(),
                tempo_validado: tempoValidado,
                horas_jogadas: horasJogadas,
                dias_jogados: diasJogados
            })
        );
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
            return "Nick não encontrado. Use o nick exato do jogo.";
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
                nickAtual = nick;
                tempoValidado = true;
                salvarSessao();
                atualizarBarra();
                atualizarCtas();

                mostrarMensagem(
                    "Nick confirmado: " + horasJogadas +
                    "h jogadas (" + diasJogados + " dias). Vaga liberada.",
                    "ok"
                );
            } else {
                tempoValidado = false;
                atualizarBarra();
                atualizarCtas();
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


    /* ==========================================================
       CARDS E BOTOES
    ========================================================== */


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
            atualizarCtas();
        });
    }

    if (ctaAjudante) {
        ctaAjudante.addEventListener("click", function () {
            iniciar("Ajudante");
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
    atualizarCtas();

    if (!msg || !msg.textContent) {
        mostrarMensagem(
            "Digite seu nick para conferir o tempo de jogo.",
            ""
        );
    }

})();
