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

// Tempo de jogo exigido para QUALQUER candidatura.
// 30 dias x 24h = 720h. O FuturySync grava o tempo acumulado em
// segundos em skyblock_tempo / lobby_tempo / rankup_tempo.
const EXIGENCIA_TEMPO_HORAS = 720;
const EXIGENCIA_TEMPO_SEGUNDOS = EXIGENCIA_TEMPO_HORAS * 3600;
const EXIGENCIA_TEMPO_DIAS = 30;

const TABELAS_TEMPO = [
    { nome: "skyblock_tempo", temServidor: true },
    { nome: "lobby_tempo", temServidor: false },
    { nome: "rankup_tempo", temServidor: false }
];

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

function limparNickTempo(valor) {
    if (typeof valor !== "string") return "";
    // Mantem "_" (comum em nicks). Remove apenas curingas que
    // poderiam ampliar a busca; o confronto exato e feito em JS.
    const t = valor.replace(/[%\\"]/g, "").trim().replace(/\s+/g, " ");
    if (t.length < 3 || t.length > 24) return "";
    return t;
}

function respostaTempo(motivo, segundos, encontrado) {
    const horas = Math.floor(Math.max(0, segundos) / 3600);
    const dias = Math.floor(Math.max(0, segundos) / 86400);

    return {
        sucesso: true,
        motivo: motivo,
        encontrado: encontrado,
        segundos: Math.max(0, segundos),
        horas: horas,
        dias: dias,
        exigido_horas: EXIGENCIA_TEMPO_HORAS,
        exigido_dias: EXIGENCIA_TEMPO_DIAS,
        liberado: segundos >= EXIGENCIA_TEMPO_SEGUNDOS
    };
}

export async function verificarTempoJogado(supabase, nick) {
    const limpo = limparNickTempo(nick);

    if (!limpo) {
        return Object.assign(respostaTempo("nick_invalido", 0, false), {
            sucesso: false
        });
    }

    const alvo = limpo.toLowerCase();
    let segundos = 0;
    let encontrado = false;

    for (const tabela of TABELAS_TEMPO) {
        const colunas = tabela.temServidor
            ? "nick,tempo_online,servidor"
            : "nick,tempo_online";

        const { data, error } = await supabase
            .from(tabela.nome)
            .select(colunas)
            .ilike("nick", limpo);

        if (error) {
            console.error("Erro ao ler " + tabela.nome + ":", error);
            return Object.assign(respostaTempo("tempo_indisponivel", 0, false), {
                sucesso: false
            });
        }

        for (const linha of data || []) {
            if (!linha) continue;
            if (String(linha.nick || "").toLowerCase() !== alvo) continue;

            // Rankup tem tabela propria; as linhas "Rankup" de
            // skyblock_tempo sao antigas e contariam em dobro.
            if (
                tabela.nome === "skyblock_tempo" &&
                String(linha.servidor || "").toLowerCase() === "rankup"
            ) {
                continue;
            }

            encontrado = true;

            const valor = Number(linha.tempo_online);
            if (Number.isFinite(valor) && valor > 0) {
                segundos += valor;
            }
        }
    }

    if (!encontrado) {
        return respostaTempo("nick_nao_encontrado", 0, false);
    }

    return respostaTempo(
        segundos >= EXIGENCIA_TEMPO_SEGUNDOS ? "ok" : "tempo_insuficiente",
        segundos,
        true
    );
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