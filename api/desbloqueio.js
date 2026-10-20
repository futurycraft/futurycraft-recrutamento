import { createClient } from "@supabase/supabase-js";
import { verificarEligibilidade, verificarTempoJogado } from "./_eligibilidade.js";

// ==========================================================
// FUTURYCRAFT - VERIFICACAO DE NICK (gateway candidatura.html)
// 1) Tempo de jogo: puxa do FuturySync (skyblock_tempo /
//    lobby_tempo / rankup_tempo) e exige 30 dias (720h).
// 2) Promocao: Moderador exige 30 dias como Ajudante; Admin
//    exige 30 dias como Moderador.
// Usa a service role: o cliente/anon nao tem acesso direto a
// essas tabelas.
// ==========================================================

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const VAGAS = ["Ajudante", "Moderador", "Admin"];

const TAXA_JANELA_MS = 10 * 60 * 1000;
const TAXA_MAX = 12;
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

    const vaga = VAGAS.includes(raw.vaga) ? raw.vaga : "Ajudante";
    const nick = typeof raw.nick === "string" ? raw.nick.trim() : "";

    if (!nick) {
        return res.status(400).json({
            sucesso: false,
            erro: "Informe seu nick do servidor."
        });
    }

    try {
        const tempo = await verificarTempoJogado(supabase, nick);

        if (!tempo.sucesso) {
            return res.status(200).json({
                sucesso: true,
                vaga: vaga,
                nick: nick,
                liberado: false,
                tempo_liberado: false,
                motivo: tempo.motivo,
                horas_jogadas: 0,
                dias_jogados: 0,
                exigido_horas: tempo.exigido_horas,
                exigido_dias: tempo.exigido_dias
            });
        }

        const base = {
            sucesso: true,
            vaga: vaga,
            nick: nick,
            horas_jogadas: tempo.horas,
            dias_jogados: tempo.dias,
            segundos_jogados: tempo.segundos,
            exigido_horas: tempo.exigido_horas,
            exigido_dias: tempo.exigido_dias,
            tempo_liberado: tempo.liberado
        };

        if (!tempo.liberado) {
            return res.status(200).json(Object.assign({}, base, {
                liberado: false,
                motivo: tempo.motivo
            }));
        }

        if (vaga === "Ajudante") {
            return res.status(200).json(Object.assign({}, base, {
                liberado: true,
                motivo: "ok",
                cargo: null,
                dias_cargo: 0,
                exigido_cargo_dias: 0
            }));
        }

        const elig = await verificarEligibilidade(supabase, nick, vaga);

        return res.status(200).json(Object.assign({}, base, {
            liberado: !!elig.liberado,
            motivo: elig.motivo,
            cargo: elig.cargo,
            dias_cargo: elig.dias,
            exigido_cargo_dias: elig.exigido
        }));
    } catch (erro) {
        console.error("Erro ao verificar elegibilidade:", erro);
        return res.status(500).json({
            sucesso: false,
            erro: "Erro interno do servidor. Tente novamente."
        });
    }
}
