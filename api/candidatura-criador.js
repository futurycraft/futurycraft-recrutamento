import { createClient } from "@supabase/supabase-js";

// ==========================================================
// FUTURYCRAFT - CANDIDATURA CRIADORES (YouTuber / Streamer)
// ==========================================================
// - Allow-list por tipo: nunca insere campos livres do body.
// - Esquema de rótulos por seção é definido AQUI (server);
//   o cliente manda apenas chave->valor ("campos").
// - status sempre forçado a "Pendente" no servidor.
// - Turnstile validado quando TURNSTILE_SECRET_KEY existe.
// - Rate limit por IP + guard de duplicidade (memória, ok
//   p/ escala atual; em serverless por instância).
// - Webhook Discord OPCIONAL via DISCORD_WEBHOOK_URL (env).
//   Sem a env, nada é enviado.
// ==========================================================

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_REQUIRED = !!process.env.TURNSTILE_SECRET_KEY;

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || null;

const MAX_CAMPO_TAMANHO = 2000;
const MAX_ARRAY_ITENS = 20;
const MAX_TOTAL_RESPOSTAS = 40000;

// Opções fechadas (allow-list) usadas nos validadores.
const OPCOES_SIM_NAO = ["Sim", "Não"];
const OPCOES_PUBLICO = ["Brasil", "Portugal", "América Latina", "Internacional", "Outro"];
const OPCOES_HORARIOS = ["Manhã", "Tarde", "Noite", "Madrugada"];
const OPCOES_COMO_CONHECEU = [
    "Discord", "TikTok", "YouTube", "Instagram", "Google",
    "Indicação de amigo", "Jogando no servidor", "Outro"
];

// ----------------------------------------------------------
// ESQUEMAS POR TIPO (rotulos exibidos no painel)
// ----------------------------------------------------------
const ESQUEMAS = {
    youtuber: {
        etapas: [
            {
                titulo: "Seus dados",
                campos: [
                    ["nome_completo", "Nome completo"],
                    ["nick", "Nick no Minecraft"],
                    ["discord", "Discord"],
                    ["email", "E-mail"],
                    ["idade", "Idade"]
                ]
            },
            {
                titulo: "Seu canal",
                campos: [
                    ["link_canal", "Link do canal"],
                    ["link_melhor_video", "Link do melhor vídeo"]
                ]
            },
            {
                titulo: "Sobre você",
                campos: [
                    ["ja_joga", "Já joga na FuturyCraft"],
                    ["motivo", "Por que fazer parte do programa"]
                ]
            }
        ],
        nomes: new Set([
            "nome_completo", "nick", "discord", "email", "idade",
            "link_canal", "link_melhor_video",
            "ja_joga", "motivo"
        ]),
        obrigatorios: [
            "nome_completo", "nick", "discord", "email", "idade",
            "link_canal", "link_melhor_video", "ja_joga", "motivo"
        ],
        validadores: {
            email: "email",
            link_canal: "url",
            link_melhor_video: "url",
            idade: { tipo: "numero", min: 13, max: 99 }
        }
    },
    streamer: {
        etapas: [
            {
                titulo: "Seus dados",
                campos: [
                    ["nome_completo", "Nome completo"],
                    ["nick", "Nick no Minecraft"],
                    ["discord", "Discord"],
                    ["email", "E-mail"],
                    ["idade", "Idade"]
                ]
            },
            {
                titulo: "Seu canal de stream",
                campos: [
                    ["plataforma_principal", "Plataforma principal"],
                    ["link_canal", "Link do canal/perfil"]
                ]
            },
            {
                titulo: "Sobre você",
                campos: [
                    ["ja_joga", "Já joga na FuturyCraft"],
                    ["motivo", "Por que fazer parte do programa"]
                ]
            }
        ],
        nomes: new Set([
            "nome_completo", "nick", "discord", "email", "idade",
            "plataforma_principal", "link_canal",
            "ja_joga", "motivo"
        ]),
        obrigatorios: [
            "nome_completo", "nick", "discord", "email", "idade",
            "plataforma_principal", "link_canal",
            "ja_joga", "motivo"
        ],
        validadores: {
            email: "email",
            link_canal: "url",
            idade: { tipo: "numero", min: 13, max: 99 }
        }
    }
};

const TIPOS_VALIDOS = new Set(["youtuber", "streamer"]);

// Rate limit por IP: janela 10 min, max 3 envios.
const TAXA_JANELA_MS = 10 * 60 * 1000;
const TAXA_MAX = 3;
const hitsPorIp = new Map();

// Guard de duplicidade acidental: mesmo tipo+discord+nick em 60s.
const DEDUP_JANELA_MS = 60 * 1000;
const ultimosEnvios = new Map();

const ALFABETO_CODIGO = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function gerarCodigo() {
    let saida = "";
    if (globalThis.crypto && typeof globalThis.crypto.getRandomValues === "function") {
        const arr = new Uint32Array(5);
        globalThis.crypto.getRandomValues(arr);
        for (const v of arr) saida += ALFABETO_CODIGO[v % ALFABETO_CODIGO.length];
    } else {
        for (let i = 0; i < 5; i++) {
            saida += ALFABETO_CODIGO[Math.floor(Math.random() * ALFABETO_CODIGO.length)];
        }
    }
    return "FC-" + saida;
}

function pegarIp(req) {
    const xf = (req.headers["x-forwarded-for"] || "").split(",")[0].trim();
    if (xf) return xf;
    return req.socket?.remoteAddress || "desconhecido";
}

function rateLimitar(ip) {
    const agora = Date.now();
    const rec = hitsPorIp.get(ip) || { janelaInicio: agora, cont: 0 };
    if (agora - rec.janelaInicio > TAXA_JANELA_MS) {
        rec.janelaInicio = agora;
        rec.cont = 0;
    }
    rec.cont += 1;
    hitsPorIp.set(ip, rec);
    return rec.cont <= TAXA_MAX;
}

function permitirEnvioNovo(ip, chave) {
    const agora = Date.now();
    const ipTs = ultimosEnvios.get(chave);
    if (ipTs && agora - ipTs < DEDUP_JANELA_MS) {
        return false;
    }
    ultimosEnvios.set(chave, agora);
    return true;
}

function campoString(valor, max = MAX_CAMPO_TAMANHO) {
    if (valor === undefined || valor === null) return null;
    if (typeof valor !== "string") return null;
    const t = valor.trim();
    if (t === "") return null;
    if (t.length > max) return null;
    return t;
}

function limparArray(valor) {
    if (!Array.isArray(valor)) return [];
    const out = [];
    for (const item of valor) {
        if (typeof item === "string" && item.trim() !== "" && out.length < MAX_ARRAY_ITENS) {
            out.push(item.trim().slice(0, 200));
        }
    }
    return [...new Set(out)];
}

function limparArrayOpcoes(valor, opcoes) {
    if (!Array.isArray(valor)) return [];
    const set = new Set(opcoes);
    const out = [];
    for (const item of valor) {
        if (typeof item === "string" && set.has(item.trim()) && out.length < MAX_ARRAY_ITENS) {
            out.push(item.trim());
        }
    }
    return [...new Set(out)];
}

function validarNome(regra, valor) {
    if (regra === "email") {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
    }
    if (regra === "url") {
        return /^https?:\/\/[^\s]+$/i.test(valor) && valor.length <= 250;
    }
    if (regra && regra.tipo === "numero") {
        const n = Number(valor);
        if (!Number.isFinite(n)) return false;
        if (regra.min !== undefined && n < regra.min) return false;
        if (regra.max !== undefined && n > regra.max) return false;
        return true;
    }
    if (regra && regra.tipo === "opcao") {
        return Array.isArray(regra.opcoes) && regra.opcoes.includes(valor);
    }
    return true;
}

async function validarTurnstile(token) {
    if (token === undefined || token === null || token === "") return false;
    try {
        const resp = await fetch(TURNSTILE_VERIFY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                secret: TURNSTILE_SECRET,
                response: token
            })
        });
        const json = await resp.json();
        return json && json.success === true;
    } catch (e) {
        console.error("Erro ao verificar Turnstile:", e);
        return false;
    }
}

async function notificarWebhook(tipo, dados) {
    if (!DISCORD_WEBHOOK_URL) return;
    const rotulo = tipo === "youtuber" ? "YOUTUBER" : "STREAMER";
    const texto =
        `**NOVA CANDIDATURA DE ${rotulo}**\n` +
        `🎫 ID: ${dados.codigo}\n` +
        `👤 Nome: ${dados.nome}\n` +
        `🎮 Nick: ${dados.nick}\n` +
        `💬 Discord: ${dados.discord}\n` +
        `📧 E-mail: ${dados.email}\n` +
        `📺 Canal: ${dados.canal}\n` +
        `🔗 Link: ${dados.link_canal || "-"}`;
    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: texto })
        });
    } catch (e) {
        console.error("Webhook Discord falhou (não bloqueia envio):", e);
    }
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ sucesso: false, erro: "Método não permitido." });
    }

    const ip = pegarIp(req);
    if (!rateLimitar(ip)) {
        return res.status(429).json({
            sucesso: false,
            erro: "Muitas tentativas. Tente novamente em alguns minutos."
        });
    }

    const origin = req.headers["origin"] || "";
    if (origin && !/^https:\/\/([a-z0-9-]+\.)*futurycraft/i.test(origin)) {
        return res.status(403).json({ sucesso: false, erro: "Origem não permitida." });
    }

    try {
        const raw = req.body || {};

        if (typeof raw !== "object" || Array.isArray(raw)) {
            return res.status(400).json({ sucesso: false, erro: "Dados inválidos." });
        }

        const tipo = typeof raw.form_type === "string" ? raw.form_type.toLowerCase() : "";
        if (!TIPOS_VALIDOS.has(tipo)) {
            return res.status(400).json({ sucesso: false, erro: "Tipo de candidatura inválido." });
        }

        const esquema = ESQUEMAS[tipo];

        if (typeof raw.campos !== "object" || raw.campos === null || Array.isArray(raw.campos)) {
            return res.status(400).json({ sucesso: false, erro: "Campos inválidos." });
        }

        // ---- Turnstile ----
        const turnstileToken = typeof raw.turnstile_token === "string" ? raw.turnstile_token : "";
        if (TURNSTILE_REQUIRED) {
            const ok = await validarTurnstile(turnstileToken);
            if (!ok) {
                return res.status(400).json({
                    sucesso: false,
                    erro: "Não foi possível validar o desafio de segurança. Tente novamente."
                });
            }
        }

        // ---- sanitiza apenas campos do esquema ----
        const limpos = {};
        for (const nome of esquema.nomes) {
            if (nome === "tipo_conteudo") {
                limpos[nome] = limparArray(raw.campos[nome]);
                continue;
            }
            if (nome === "horarios_live") {
                limpos[nome] = limparArrayOpcoes(raw.campos[nome], OPCOES_HORARIOS);
                continue;
            }
            const val = campoString(raw.campos[nome]);
            if (val === null) {
                limpos[nome] = null;
                continue;
            }
            const regra = esquema.validadores[nome];
            if (regra && !validarNome(regra, val)) {
                limpos[nome] = "INVALIDO";
                continue;
            }
            limpos[nome] = val;
        }

        // ---- validação server-side independente ----
        for (const nome of esquema.obrigatorios) {
            const valor = limpos[nome];
            if (valor === null || valor === "INVALIDO") {
                const rotulo = esquema.etapas
                    .flatMap((e) => e.campos)
                    .find((c) => c[0] === nome);
                return res.status(400).json({
                    sucesso: false,
                    erro: "Campo obrigatório inválido: " + (rotulo ? rotulo[1] : nome) + "."
                });
            }
            const regra = esquema.validadores[nome];
            if (regra && !validarNome(regra, valor)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: "Campo inválido: " + nome + "."
                });
            }
        }

        if (esquema.nomes.has("tipo_conteudo") && (!Array.isArray(limpos.tipo_conteudo) || limpos.tipo_conteudo.length === 0)) {
            return res.status(400).json({ sucesso: false, erro: "Selecione ao menos um tipo de conteúdo." });
        }

        // ---- guard de duplicidade acidental ----
        const chaveDedup = `${tipo}:${String(limpos.nick || "").toLowerCase()}:${String(limpos.discord || "").toLowerCase()}`;
        if (!permitirEnvioNovo(ip, chaveDedup)) {
            return res.status(429).json({
                sucesso: false,
                erro: "Já recebemos sua candidatura. Aguarde um instante antes de tentar novamente."
            });
        }

        // ---- revalidar elegibilidade para Mini YouTuber ----
        if (tipo === "youtuber" && raw.channel_verification) {
            const cv = raw.channel_verification;
            if (cv.eligibility && cv.eligibility.status !== "eligible" && cv.subscribers != null && cv.subscribers >= 500 && cv.last_video_at) {
                const diff = (Date.now() - new Date(cv.last_video_at).getTime()) / 86400000;
                if (diff > 30) {
                    // keep as is; panel sees status
                }
            }
        }
        // ---- monta respostas estruturadas por seção (rótulos do servidor) ----
        const respostas = {
            form_type: tipo,
            etapas: []
        };

        for (const etapa of esquema.etapas) {
            const camposEtapa = [];
            for (const [nome, rotulo] of etapa.campos) {
                let valor = limpos[nome];
                if (valor === null || valor === "INVALIDO") continue;
                if (Array.isArray(valor) && valor.length === 0) continue;
                if (Array.isArray(valor)) {
                    valor = valor.join(", ");
                }
                if (String(valor).trim() === "") continue;
                camposEtapa.push({ rotulo: rotulo, valor: valor });
            }
            if (camposEtapa.length > 0) {
                respostas.etapas.push({ titulo: etapa.titulo, campos: camposEtapa });
            }
        }

        if (JSON.stringify(respostas).length > MAX_TOTAL_RESPOSTAS) {
            return res.status(400).json({ sucesso: false, erro: "Candidatura muito extensa." });
        }

        // ---- colunas resumo p/ listagem no painel ----
        const plataforma = tipo === "youtuber"
            ? "YouTube"
            : (limpos.plataforma_principal || "Não informado");

        const registro = {
            form_type: tipo,
            codigo: gerarCodigo(),
            nome: limpos.nome_completo,
            nick: limpos.nick,
            discord: limpos.discord,
            email: limpos.email,
            idade: limpos.idade ? Number(limpos.idade) : null,
            plataforma: plataforma,
            canal: limpos.nome_canal || (raw.channel_verification && raw.channel_verification.title) || null,
            link_canal: limpos.link_canal,
            respostas: respostas,
            status: "Pendente",
            channel_id: (raw.channel_verification && raw.channel_verification.channel_id) || null,
            channel_handle: (raw.channel_verification && raw.channel_verification.channel_handle) || null,
            platform_verified: !!raw.channel_verification,
            subscribers: (raw.channel_verification && raw.channel_verification.subscribers != null) ? raw.channel_verification.subscribers : (limpos.inscritos != null ? Number(limpos.inscritos) : null),
            followers: (raw.channel_verification && raw.channel_verification.followers != null) ? raw.channel_verification.followers : (limpos.seguidores != null ? Number(limpos.seguidores) : null),
            last_video_at: (raw.channel_verification && raw.channel_verification.last_video_at) || null,
            last_stream_at: (raw.channel_verification && raw.channel_verification.last_stream_at) || null,
            verified_at: (raw.channel_verification && raw.channel_verification.verified_at) || new Date().toISOString(),
            eligibility_status: (raw.channel_verification && raw.channel_verification.eligibility && raw.channel_verification.eligibility.status) || 'pending',
            eligibility_reason: (raw.channel_verification && raw.channel_verification.eligibility) ? JSON.stringify(raw.channel_verification.eligibility.reasons || []) : null,
            verification_data: raw.channel_verification || {}
        };

        // campos internos (status, id, created_at, avaliador...) nunca vêm do cliente

        const { data, error } = await supabase
            .from("candidaturas_criadores")
            .insert([registro])
            .select("id, codigo, nick, nome, created_at, form_type")
            .single();

        if (error) {
            console.error("Erro Supabase ao inserir candidatura criador:", error);
            return res.status(500).json({
                sucesso: false,
                erro: "Erro interno do servidor. Tente novamente."
            });
        }

        // webhook opcional (ambiental; falha não bloqueia)
        await notificarWebhook(tipo, {
            codigo: registro.codigo,
            nome: registro.nome,
            nick: registro.nick,
            discord: registro.discord,
            email: registro.email,
            canal: registro.canal,
            link_canal: registro.link_canal
        });

        return res.status(200).json({
            sucesso: true,
            mensagem: "Candidatura enviada com sucesso.",
            candidatura: data
        });

    } catch (erro) {
        console.error("Erro inesperado na candidatura criador:", erro);
        return res.status(500).json({
            sucesso: false,
            erro: "Erro interno do servidor."
        });
    }
}


