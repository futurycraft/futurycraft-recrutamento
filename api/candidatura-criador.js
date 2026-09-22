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
                    ["nome_canal", "Nome do canal"],
                    ["link_canal", "Link do canal"],
                    ["link_melhor_video", "Link do melhor vídeo"],
                    ["inscritos", "Inscritos"],
                    ["visualizacoes_mensais", "Visualizações por mês"],
                    ["media_visualizacoes_10", "Média de visualizações (últimos 10 vídeos)"],
                    ["media_visualizacoes_shorts", "Média de visualizações (Shorts)"],
                    ["maior_visualizacoes", "Maior número de views de um vídeo"],
                    ["publico_principal", "Público principal"],
                    ["frequencia_publicacao", "Frequência de publicação"],
                    ["tempo_criando_conteudo", "Tempo criando conteúdo"]
                ]
            },
            {
                titulo: "Seu conteúdo",
                campos: [
                    ["tipo_conteudo", "Tipos de conteúdo"],
                    ["produz_minecraft", "Produz conteúdo de Minecraft"],
                    ["link_conteudo_minecraft", "Link de conteúdo de Minecraft"],
                    ["video1", "Vídeo recente 1 (link)"],
                    ["video2", "Vídeo recente 2 (link)"],
                    ["video3", "Vídeo recente 3 (link)"],
                    ["sobre_canal", "Sobre o canal e o conteúdo"]
                ]
            },
            {
                titulo: "FuturyCraft",
                campos: [
                    ["ja_joga", "Já joga na FuturyCraft"],
                    ["modalidade", "Modalidade preferida"],
                    ["motivo", "Por que fazer parte do programa"],
                    ["divulgacao", "Como pretende divulgar a FuturyCraft"],
                    ["eventos_interesse", "Interesse em eventos"],
                    ["parceria_outro_servidor", "Tem parceria com outro servidor"],
                    ["qual_parceria", "Qual servidor"],
                    ["contrato_exclusividade", "Tem contrato ou exclusividade atualmente"],
                    ["explique_contrato", "Explique o contrato/exclusividade"],
                    ["como_conheceu", "Como conheceu a FuturyCraft"]
                ]
            },
            {
                titulo: "Redes sociais",
                campos: [
                    ["instagram", "Instagram"],
                    ["tiktok", "TikTok"],
                    ["twitter", "X/Twitter"],
                    ["outra_rede", "Outra rede social"]
                ]
            }
        ],
        nomes: new Set([
            "nome_completo", "nick", "discord", "email", "idade",
            "nome_canal", "link_canal", "link_melhor_video", "inscritos",
            "visualizacoes_mensais", "media_visualizacoes_10", "media_visualizacoes_shorts",
            "maior_visualizacoes", "publico_principal", "frequencia_publicacao",
            "tempo_criando_conteudo", "tipo_conteudo", "produz_minecraft",
            "link_conteudo_minecraft", "video1", "video2", "video3", "sobre_canal",
            "ja_joga", "modalidade", "motivo", "divulgacao", "eventos_interesse",
            "parceria_outro_servidor", "qual_parceria", "contrato_exclusividade",
            "explique_contrato", "como_conheceu",
            "instagram", "tiktok", "twitter", "outra_rede"
        ]),
        obrigatorios: [
            "nome_completo", "nick", "discord", "email", "idade",
            "nome_canal", "link_canal", "link_melhor_video", "inscritos",
            "frequencia_publicacao", "video1", "ja_joga", "motivo", "divulgacao"
        ],
        validadores: {
            email: "email",
            link_canal: "url",
            link_melhor_video: "url",
            link_conteudo_minecraft: "url",
            video1: "url",
            video2: "url",
            video3: "url",
            idade: { tipo: "numero", min: 13, max: 99 },
            inscritos: { tipo: "numero", min: 0 },
            visualizacoes_mensais: { tipo: "numero", min: 0 },
            media_visualizacoes_10: { tipo: "numero", min: 0 },
            media_visualizacoes_shorts: { tipo: "numero", min: 0 },
            maior_visualizacoes: { tipo: "numero", min: 0 },
            publico_principal: { tipo: "opcao", opcoes: OPCOES_PUBLICO },
            parceria_outro_servidor: { tipo: "opcao", opcoes: OPCOES_SIM_NAO },
            contrato_exclusividade: { tipo: "opcao", opcoes: OPCOES_SIM_NAO },
            como_conheceu: { tipo: "opcao", opcoes: OPCOES_COMO_CONHECEU }
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
                    ["nome_canal", "Nome do canal/perfil"],
                    ["plataforma_principal", "Plataforma principal"],
                    ["link_canal", "Link do canal/perfil"],
                    ["seguidores", "Seguidores"],
                    ["espectadores_simultaneos", "Média de espectadores simultâneos"],
                    ["media_espectadores_10", "Média de espectadores (últimas 10 lives)"],
                    ["maior_espectadores_simultaneos", "Maior pico de espectadores simultâneos"],
                    ["media_lives_mes", "Média de lives por mês"],
                    ["horarios_live", "Horários preferidos para live"],
                    ["visualizacoes_por_live", "Média de visualizações por live"],
                    ["frequencia_lives", "Frequência de lives"],
                    ["duracao_lives", "Duração média das lives"]
                ]
            },
            {
                titulo: "Seu conteúdo",
                campos: [
                    ["tipo_conteudo", "Tipos de conteúdo"],
                    ["transmite_minecraft", "Transmite Minecraft"],
                    ["link_live", "Link de live/gravação"],
                    ["live1", "Live recente 1 (link)"],
                    ["live2", "Live recente 2 (link)"],
                    ["live3", "Live recente 3 (link)"],
                    ["sobre_lives", "Sobre as lives"]
                ]
            },
            {
                titulo: "FuturyCraft",
                campos: [
                    ["ja_joga", "Já joga na FuturyCraft"],
                    ["modalidade", "Modalidade preferida"],
                    ["motivo", "Por que fazer parte do programa"],
                    ["frequencia_futury", "Frequência pretendida de lives"],
                    ["eventos_oficiais", "Interesse em eventos oficiais"],
                    ["parceria_outro_servidor", "Tem parceria com outro servidor"],
                    ["qual_parceria", "Qual servidor"],
                    ["contrato_exclusividade", "Tem contrato ou exclusividade atualmente"],
                    ["explique_contrato", "Explique o contrato/exclusividade"],
                    ["como_conheceu", "Como conheceu a FuturyCraft"]
                ]
            },
            {
                titulo: "Redes sociais",
                campos: [
                    ["instagram", "Instagram"],
                    ["tiktok", "TikTok"],
                    ["youtube", "YouTube"],
                    ["twitter", "X/Twitter"],
                    ["outra_rede", "Outra rede social"]
                ]
            }
        ],
        nomes: new Set([
            "nome_completo", "nick", "discord", "email", "idade",
            "nome_canal", "plataforma_principal", "link_canal", "seguidores",
            "espectadores_simultaneos", "media_espectadores_10",
            "maior_espectadores_simultaneos", "media_lives_mes", "horarios_live",
            "visualizacoes_por_live", "frequencia_lives",
            "duracao_lives", "tipo_conteudo", "transmite_minecraft", "link_live",
            "live1", "live2", "live3", "sobre_lives", "ja_joga", "modalidade",
            "motivo", "frequencia_futury", "eventos_oficiais",
            "parceria_outro_servidor", "qual_parceria", "contrato_exclusividade",
            "explique_contrato", "como_conheceu",
            "instagram", "tiktok", "youtube", "twitter", "outra_rede"
        ]),
        obrigatorios: [
            "nome_completo", "nick", "discord", "email", "idade",
            "nome_canal", "plataforma_principal", "link_canal", "seguidores",
            "frequencia_lives", "live1", "ja_joga", "motivo"
        ],
        validadores: {
            email: "email",
            link_canal: "url",
            link_live: "url",
            live1: "url",
            live2: "url",
            live3: "url",
            idade: { tipo: "numero", min: 13, max: 99 },
            seguidores: { tipo: "numero", min: 0 },
            espectadores_simultaneos: { tipo: "numero", min: 0 },
            media_espectadores_10: { tipo: "numero", min: 0 },
            maior_espectadores_simultaneos: { tipo: "numero", min: 0 },
            media_lives_mes: { tipo: "numero", min: 0 },
            visualizacoes_por_live: { tipo: "numero", min: 0 },
            parceria_outro_servidor: { tipo: "opcao", opcoes: OPCOES_SIM_NAO },
            contrato_exclusividade: { tipo: "opcao", opcoes: OPCOES_SIM_NAO },
            como_conheceu: { tipo: "opcao", opcoes: OPCOES_COMO_CONHECEU }
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

        if (limpos.tipo_conteudo.length === 0) {
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
            canal: limpos.nome_canal,
            link_canal: limpos.link_canal,
            respostas: respostas,
            status: "Pendente"
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