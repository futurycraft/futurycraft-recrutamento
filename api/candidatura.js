import { createClient } from "@supabase/supabase-js";

// ==========================================================
// FUTURYCRAFT - CANDIDATURA (seguro)
// ==========================================================
// - Allow-list explícita: NUNCA insere o body inteiro.
//   Colunas internas (status, id, created_at, etc.) são
//   ignoradas por construção.
// - Validação server-side mínima (idade >= 13, limites).
// - Turnstile (Cloudflare) validado no servidor. O checkbox
//   do frontend NÃO é prova de CAPTCHA.
// - Rate limit defensivo por IP (nota: em serverless Vercel
//   esse mapa é por instância; p/ escala real use KV/Upstash).
// - Erros genéricos; detalhes só em console (nenhum
//   error.message do Supabase vazado).
// ==========================================================

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_REQUIRED = !!process.env.TURNSTILE_SECRET_KEY;

// Permissão estrita dos campos que o formulário envia.
const CAMPOS_PERMITIDOS = [
    "nome_completo", "nick", "discord", "idade", "data_nascimento",
    "genero", "tipo_conta", "plataforma", "acesso_conta",
    "tempo_servidor", "modo_interesse", "horario_jogo", "dias_jogo",
    "sobre_voce", "bom_ajudante", "destaque", "jogador_toxico",
    "suspeita_hack", "amigo_regra", "punicao_injusta", "novo_jogador",
    "experiencia_staff", "servidor_anterior", "cargo_anterior",
    "tempo_staff", "motivo_saida",
    "avaliacao_servidor", "avaliacao_equipe", "avaliacao_organizacao",
    "avaliacao_eventos", "avaliacao_atualizacoes", "melhorias"
];

const CAMPOS_OBRIGATORIOS = ["nome_completo", "nick", "discord"];
const MAX_CAMPO_TAMANHO = 2000;

// Limite simples por IP: janela de 10 min, max 3 envios.
const TAXA_JANELA_MS = 10 * 60 * 1000;
const TAXA_MAX = 3;
const hitsPorIp = new Map();

function pegarIp(req) {
    // Vercel expõe x-forwarded-for. Pode conter lista; usamos o primeiro.
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
    if (rec.cont > TAXA_MAX) {
        // expira sozinho depois
        hitsPorIp.set(ip, rec);
        return false;
    }
    hitsPorIp.set(ip, rec);
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

function limparDiasJogo(valor) {
    if (!Array.isArray(valor)) return [];
    const out = [];
    for (const d of valor) {
        if (typeof d === "string" && d.trim() !== "" && out.length < 30) {
            out.push(d.trim().slice(0, 50));
        }
    }
    return out;
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

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ sucesso: false, erro: "Método não permitido." });
    }

    // ---- rate limit ----
    const ip = pegarIp(req);
    if (!rateLimitar(ip)) {
        return res.status(429).json({
            sucesso: false,
            erro: "Muitas tentativas. Tente novamente em alguns minutos."
        });
    }

    // ---- origem (defensivo; não é a única camada) ----
    const origin = req.headers["origin"] || "";
    if (origin && !/^https:\/\/([a-z0-9-]+\.)*futurycraft/i.test(origin)) {
        return res.status(403).json({ sucesso: false, erro: "Origem não permitida." });
    }

    try {
        const raw = req.body || {};

        if (typeof raw !== "object" || Array.isArray(raw)) {
            return res.status(400).json({ sucesso: false, erro: "Dados inválidos." });
        }

        // ---- Turnstile: não confia no checkbox do cliente ----
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

        // ---- validação mínima server-side ----
        if (!campoString(raw.nome_completo)) {
            return res.status(400).json({ sucesso: false, erro: "Nome completo é obrigatório." });
        }
        if (!campoString(raw.nick)) {
            return res.status(400).json({ sucesso: false, erro: "Nick é obrigatório." });
        }
        if (!campoString(raw.discord)) {
            return res.status(400).json({ sucesso: false, erro: "Discord é obrigatório." });
        }

        const idade = parseInt(raw.idade, 10);
        if (!Number.isNaN(idade) && idade < 13) {
            return res.status(400).json({
                sucesso: false,
                erro: "A idade mínima para candidatura é 13 anos."
            });
        }

        // ---- allow-list: monta objeto novo com campos permitidos ----
        const dados = {};
        for (const campo of CAMPOS_PERMITIDOS) {
            if (campo === "dias_jogo") {
                dados.dias_jogo = limparDiasJogo(raw.dias_jogo);
                continue;
            }
            const val = raw[campo];
            if (val === undefined || val === null) {
                dados[campo] = null;
                continue;
            }
            if (typeof val !== "string") continue;
            dados[campo] = val.slice(0, MAX_CAMPO_TAMANHO).trim();
        }

        // campos internos jamais inseridos: status, id, aprovado,
        // cargo, usuario_id, created_at, avaliador, data_analise...
        dados.status = "Pendente"; // valor controlado no servidor, nunca do cliente

        const { data, error } = await supabase
            .from("candidatos")
            .insert([dados])
            .select("id, nick, nome_completo, created_at")
            .single();

        if (error) {
            console.error("Erro Supabase ao inserir candidatura:", error);
            return res.status(500).json({
                sucesso: false,
                erro: "Erro interno do servidor. Tente novamente."
            });
        }

        return res.status(200).json({
            sucesso: true,
            mensagem: "Candidatura enviada com sucesso.",
            candidatura: data
        });

    } catch (erro) {
        console.error("Erro inesperado na candidatura:", erro);
        return res.status(500).json({
            sucesso: false,
            erro: "Erro interno do servidor."
        });
    }
}