// ==========================================================
// FUTURYCRAFT - ELEGIBILIDADE PARA PROMOCAO
// Compartilhado entre api/desbloqueio.js (gateway) e
// api/candidatura.js (envio final). Regra: para se candidatar
// a Moderador o staff precisa estar ATIVO como Ajudante ha 30
// dias; para Admin, ativo como Moderador ha 30 dias. A leitura
// de usuarios_staff e cargo_historico usa a service role (o
// cliente/anon nao tem acesso).
// ==========================================================

const EXIGENCIA_DIAS = 30;

const CARGO_POR_VAGA = {
    Moderador: "ajudante",
    Admin: "moderador"
};

const ROTULO_CARGO = {
    Moderador: "Ajudante",
    Admin: "Moderador"
};

function limparNick(valor) {
    if (valor === undefined || valor === null) return "";
    if (typeof valor !== "string") return "";
    const t = valor.replace(/[%_\\"']/g, "").trim().replace(/\s+/g, " ");
    if (t.length < 3 || t.length > 24) return "";
    return t;
}

export async function verificarEligibilidade(supabase, nick, vaga) {
    const cargoNecessario = CARGO_POR_VAGA[vaga];

    if (!cargoNecessario) {
        return {
            liberado: true,
            dias: 0,
            exigido: EXIGENCIA_DIAS,
            motivo: "entrada",
            cargo: null
        };
    }

    const limpo = limparNick(nick);

    if (!limpo) {
        return {
            liberado: false,
            dias: 0,
            exigido: EXIGENCIA_DIAS,
            motivo: "nick_invalido",
            cargo: ROTULO_CARGO[vaga]
        };
    }

    const { data, error } = await supabase
        .from("usuarios_staff")
        .select("usuario_id, nick, cargo, status, entrou_staff")
        .ilike("nick", "%" + limpo.toLowerCase() + "%")
        .limit(50);

    if (error || !data || !data.length) {
        return {
            liberado: false,
            dias: 0,
            exigido: EXIGENCIA_DIAS,
            motivo: "staff_nao_encontrado",
            cargo: ROTULO_CARGO[vaga]
        };
    }

    const alvo = data.find((r) =>
        r.nick && String(r.nick).toLowerCase() === limpo.toLowerCase()
    );

    if (!alvo) {
        return {
            liberado: false,
            dias: 0,
            exigido: EXIGENCIA_DIAS,
            motivo: "staff_nao_encontrado",
            cargo: ROTULO_CARGO[vaga]
        };
    }

    const cargoAtual = alvo.cargo
        ? String(alvo.cargo).toLowerCase()
        : "";
    const ativo = alvo.status !== "inativo";

    if (cargoAtual !== cargoNecessario || !ativo) {
        return {
            liberado: false,
            dias: 0,
            exigido: EXIGENCIA_DIAS,
            motivo: "cargo_incorreto",
            cargo: ROTULO_CARGO[vaga]
        };
    }

    let dias = 0;
    const UM_DIA = 86400000;

    if (alvo.usuario_id) {
        const { data: intervalos, error: errIntervalos } = await supabase
            .from("cargo_historico")
            .select("inicio, fim")
            .eq("staff_id", alvo.usuario_id)
            .eq("cargo", cargoNecessario);

        if (!errIntervalos && intervalos && intervalos.length) {
            const agora = Date.now();
            for (const intervalo of intervalos) {
                const inicio = new Date(intervalo.inicio).getTime();
                const fim = intervalo.fim
                    ? new Date(intervalo.fim).getTime()
                    : agora;
                dias += Math.max(0, Math.floor((fim - inicio) / UM_DIA));
            }
        }
    }

    if (dias === 0 && alvo.entrou_staff) {
        dias = Math.max(
            0,
            Math.floor((Date.now() - new Date(alvo.entrou_staff).getTime()) / UM_DIA)
        );
    }

    return {
        liberado: dias >= EXIGENCIA_DIAS,
        dias: dias,
        exigido: EXIGENCIA_DIAS,
        motivo: "ok",
        cargo: ROTULO_CARGO[vaga]
    };
}