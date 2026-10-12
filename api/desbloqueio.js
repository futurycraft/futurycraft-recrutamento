import { createClient } from "@supabase/supabase-js";
import { verificarEligibilidade } from "./_eligibilidade.js";

// ==========================================================
// FUTURYCRAFT - DESBLOQUEIO DE VAGA (gateway candidatura.html)
// Verifica se o nick do staff ja tem 30 dias no cargo anterior
// para liberar as vagas de Moderador (exige Ajudante) e Admin
// (exige Moderador). Usa a service role: o cliente/anon nao
// tem acesso direto a usuarios_staff nem a cargo_historico.
// ==========================================================

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TAXA_JANELA_MS = 10 * 60 * 1000;
const TAXA_MAX = 10;
const hitsPorIp = new Map();

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

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ sucesso: false, erro: "Método não permitido." });
    }

    const ip = pegarIp(req);
    if (!rateLimitar(ip)) {
        return res.status(429).json({
            sucesso: false,
            erro: "Muitas tentativas. Aguarde alguns minutos."
        });
    }

    const origin = req.headers["origin"] || "";
    if (origin && !/^https:\/\/([a-z0-9-]+\.)*futurycraft/i.test(origin)) {
        return res.status(403).json({ sucesso: false, erro: "Origem não permitida." });
    }

    let raw = req.body || {};
    if (typeof raw === "string") {
        try {
            raw = JSON.parse(raw);
        } catch (e) {
            return res.status(400).json({ sucesso: false, erro: "Dados inválidos." });
        }
    }

    if (typeof raw !== "object" || Array.isArray(raw)) {
        return res.status(400).json({ sucesso: false, erro: "Dados inválidos." });
    }

    const vaga = raw.vaga;
    const nick = typeof raw.nick === "string" ? raw.nick : "";

    if (vaga !== "Moderador" && vaga !== "Admin") {
        return res.status(200).json({
            sucesso: true,
            vaga: vaga || "Ajudante",
            liberado: true,
            dias: 0,
            exigido: 30,
            motivo: "entrada"
        });
    }

    try {
        const resultado = await verificarEligibilidade(supabase, nick, vaga);

        return res.status(200).json({
            sucesso: true,
            vaga: vaga,
            nick: typeof nick === "string" ? nick.trim() : "",
            liberado: resultado.liberado,
            dias: resultado.dias,
            exigido: resultado.exigido,
            motivo: resultado.motivo,
            cargo: resultado.cargo
        });
    } catch (erro) {
        console.error("Erro ao verificar elegibilidade:", erro);
        return res.status(500).json({
            sucesso: false,
            erro: "Erro interno do servidor. Tente novamente."
        });
    }
}