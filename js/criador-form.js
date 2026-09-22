/* ==========================================================
   FUTURYCRAFT - FORMULÁRIOS DE CRIADORES
   Motor de wizard compartilhado (YouTuber / Streamer).
   Configuração por formulário em CRIADOR_CONFIG.
   - Validação por etapa antes de avançar
   - Persistência em localStorage (expira em 7 dias)
   - Envio via API serverless /api/candidatura-criador
========================================================== */

var CRIADOR_CONFIG = {
    youtuber: {
        storage: "futury_youtuber",
        titulos: ["Seus dados", "Seu canal", "Seu conteúdo", "FuturyCraft", "Redes sociais", "Finalização"],
        requisitos: {
            1: ["nome_completo", "nick", "discord", "email", "idade"],
            2: ["nome_canal", "link_canal", "link_melhor_video", "inscritos", "frequencia_publicacao"],
            3: ["tipo_conteudo"],
            4: ["ja_joga", "motivo", "divulgacao"]
        },
        validadores: {
            email: "email",
            idade: ["numero", 13, 99],
            link_canal: "url",
            link_melhor_video: "url",
            inscritos: ["numero", 0, 999999999],
            link_conteudo_minecraft: "url",
            visualizacoes_mensais: ["numero", 0, 9999999999]
        }
    },
    streamer: {
        storage: "futury_streamer",
        titulos: ["Seus dados", "Seu canal", "Seu conteúdo", "FuturyCraft", "Redes sociais", "Finalização"],
        requisitos: {
            1: ["nome_completo", "nick", "discord", "email", "idade"],
            2: ["nome_canal", "plataforma_principal", "link_canal", "seguidores", "frequencia_lives"],
            3: ["tipo_conteudo"],
            4: ["ja_joga", "motivo"]
        },
        validadores: {
            email: "email",
            idade: ["numero", 13, 99],
            link_canal: "url",
            link_live: "url",
            seguidores: ["numero", 0, 999999999],
            espectadores_simultaneos: ["numero", 0, 9999999],
            visualizacoes_por_live: ["numero", 0, 99999999]
        }
    }
};

var TITULOS_POR_ETAPA = {
    1: "Seus dados",
    2: "Seu canal",
    3: "Seu conteúdo",
    4: "FuturyCraft",
    5: "Redes sociais",
    6: "Finalização"
};

function CriadorForm(tipo) {

    var cfg = CRIADOR_CONFIG[tipo];

    if (!cfg) throw new Error("Tipo inválido: " + tipo);

    var form = document.getElementById("form-" + tipo);
    var etapaAtual = 1;
    var TOTAL = 6;

    // ==========================================================
    // COLETA DE CAMPOS
    // ==========================================================

    function valorPorNome(nome) {
        var inputs = form.querySelectorAll('[name="' + CSS.escape(nome) + '"]');
        if (!inputs.length) return "";

        var tipoEntrada = inputs[0].type || "text";

        if (tipoEntrada === "checkbox") {
            var marcados = [];
            inputs.forEach(function (el) {
                if (el.checked) marcados.push(el.value);
            });
            return marcados;
        }

        if (tipoEntrada === "radio") {
            var sel = "";
            inputs.forEach(function (el) {
                if (el.checked) sel = el.value;
            });
            return sel;
        }

        return (inputs[0].value || "").trim();
    }

    function lerTudo() {
        var campos = {};
        form.querySelectorAll("[name]").forEach(function (el) {
            if (!el.name) return;
            if (campos[el.name] !== undefined) return;
            campos[el.name] = valorPorNome(el.name);
        });
        return campos;
    }

    // ==========================================================
    // VALIDAÇÃO
    // ==========================================================

    function validarValor(nome, valor) {
        var regra = cfg.validadores[nome];

        function ehVazio(v) {
            if (v === null || v === undefined) return true;
            if (Array.isArray(v)) return v.length === 0;
            return String(v).trim() === "";
        }

        if (ehVazio(valor)) return true; // opcional

        if (regra === "email") {
            return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(valor));
        }

        if (regra === "url") {
            var u = String(valor);
            return /^https?:\/\/[^\s]+$/i.test(u) && u.length <= 250;
        }

        if (Array.isArray(regra) && regra[0] === "numero") {
            var n = Number(valor);
            if (!Number.isFinite(n)) return false;
            if (regra[1] !== undefined && n < regra[1]) return false;
            if (regra[2] !== undefined && n > regra[2]) return false;
            return true;
        }

        return true;
    }

    function validarEtapa(num) {
        var ok = true;
        var req = cfg.requisitos[num] || [];

        req.forEach(function (nome) {
            var campo = form.querySelector('.campo input[name="' + CSS.escape(nome) + '"], .campo select[name="' + CSS.escape(nome) + '"], .campo textarea[name="' + CSS.escape(nome) + '"]');
            if (!campo) return;
            var grupo = campo.closest(".campo");
            if (!grupo) return;

            var valor = valorPorNome(nome);
            var invalido = false;

            if (Array.isArray(valor)) {
                if (valor.length === 0) invalido = true;
            } else if (String(valor).trim() === "") {
                invalido = true;
            }

            if (!invalido && !validarValor(nome, valor)) invalido = true;

            if (invalido) {
                ok = false;
                grupo.classList.add("invalido");
            } else {
                grupo.classList.remove("invalido");
            }
        });

        // Campos obrigatórios com rotulo próprio (msg-erro automatica)
        form.querySelectorAll(".campo").forEach(function (grupo) {
            var marcado = false;
            var radio = grupo.querySelector('input[type="radio"]');
            if (radio) {
                var n = radio.name;
                var sel = valorPorNome(n);
                // apenas valida se o campo faz parte dos requisitos ou tem msg de erro
                if ((cfg.requisitos[num] || []).indexOf(n) !== -1 && String(sel).trim() === "") {
                    grupo.classList.add("invalido");
                    ok = false;
                    marcado = true;
                }
            }
            if (marcado) return;
            var checkbox = grupo.querySelector('input[type="checkbox"]');
            if (checkbox && (cfg.requisitos[num] || []).indexOf(checkbox.name) !== -1) {
                var vals = valorPorNome(checkbox.name);
                if (vals.length === 0) {
                    grupo.classList.add("invalido");
                    ok = false;
                }
            }
        });

        return ok;
    }

    // ==========================================================
    // ESTADO VISUAL
    // ==========================================================

    function atualizarInterface() {
        var num = document.getElementById("etapa-num");
        var titulo = document.getElementById("etapa-titulo");
        var percent = document.getElementById("etapa-percent");
        var fill = document.getElementById("progresso-fill");

        if (num) num.textContent = etapaAtual;
        if (titulo) titulo.textContent = TITULOS_POR_ETAPA[etapaAtual];
        if (percent) percent.textContent = Math.round((etapaAtual / TOTAL) * 100) + "%";
        if (fill) fill.style.width = Math.round((etapaAtual / TOTAL) * 100) + "%";

        form.querySelectorAll(".etapa-wizard").forEach(function (div) {
            var n = Number(div.getAttribute("data-etapa"));
            div.classList.toggle("ativa", n === etapaAtual);
        });

        document.querySelectorAll(".wizard-step").forEach(function (s) {
            var n = Number(s.getAttribute("data-wstep"));
            s.classList.toggle("ativo", n === etapaAtual);
            s.classList.toggle("concluido", n < etapaAtual);
        });

        if (etapaAtual === TOTAL) {
            var turnstileWidget = form.querySelector(".cf-turnstile");
            if (turnstileWidget && window.turnstile && typeof window.turnstile.reset === "function") {
                try { window.turnstile.reset(); } catch (e) { /* ignore */ }
            }
        }
    }

    function irEtapa(n) {
        if (!validarEtapa(etapaAtual)) {
            return;
        }
        salvar();
        etapaAtual = n;
        atualizarInterface();
    }

    function voltarEtapa() {
        salvar();
        if (etapaAtual > 1) etapaAtual -= 1;
        atualizarInterface();
    }

    // ==========================================================
    // PERSISTÊNCIA
    // ==========================================================

    function salvar() {
        var dados = lerTudo();
        dados._ts = Date.now();
        try {
            localStorage.setItem(cfg.storage, JSON.stringify(dados));
        } catch (e) { /* sem storage */ }
    }

    function carregar() {
        var raw = null;
        try {
            raw = localStorage.getItem(cfg.storage);
        } catch (e) { return; }
        if (!raw) return;

        var dados = null;
        try { dados = JSON.parse(raw); } catch (e) { return; }

        if (dados && dados._ts && (Date.now() - dados._ts > 7 * 86400000)) {
            localStorage.removeItem(cfg.storage);
            return;
        }

        form.querySelectorAll("[name]").forEach(function (el) {
            var v = dados[el.name];
            if (v === undefined || v === null) return;
            if (el.type === "checkbox") {
                el.checked = v.indexOf(el.value) !== -1;
            } else if (el.type === "radio") {
                el.checked = String(v) === el.value;
            } else {
                el.value = v;
            }
        });
    }

    // ==========================================================
    // ENVIO
    // ==========================================================

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var termo1 = document.getElementById("termo1");
        var termo2 = document.getElementById("termo2");
        var erroTermos = document.getElementById("erro-termos");

        if (!validarEtapa(etapaAtual) || !termo1.checked || !termo2.checked) {
            if (erroTermos) erroTermos.style.display = "block";
            return;
        }
        if (erroTermos) erroTermos.style.display = "none";

        var btn = document.getElementById("btn-enviar");
        if (btn) btn.disabled = true;

        var campos = lerTudo();
        var turnstileToken = "";
        if (window.turnstile && typeof window.turnstile.getResponse === "function") {
            turnstileToken = window.turnstile.getResponse() || "";
        }

        var corpo = {
            form_type: tipo,
            campos: campos,
            turnstile_token: turnstileToken
        };

        fetch("/api/candidatura-criador", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(corpo)
        })
            .then(function (resposta) { return resposta.json().then(function (j) { return { ok: resposta.ok, j: j }; }); })
            .then(function (r) {
                if (!r.ok || !r.j.sucesso) {
                    throw new Error(r.j && r.j.erro ? r.j.erro : "Falha no envio.");
                }
                try { localStorage.removeItem(cfg.storage); } catch (e) { /* ignore */ }
                window.location.href = "sucesso-criador.html?form=" + encodeURIComponent(tipo);
            })
            .catch(function (erro) {
                console.error(erro);
                alert("Erro ao enviar candidatura.\n\n" + erro.message);
                if (btn) btn.disabled = false;
            });
    });

    // ==========================================================
    // INICIALIZAÇÃO
    // ==========================================================

    carregar();
    atualizarInterface();

    // expõe para o HTML (onclick)
    window.irEtapa = irEtapa;
    window.voltarEtapa = voltarEtapa;
}