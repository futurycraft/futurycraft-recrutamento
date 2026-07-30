/* ==========================================================
   FUTURYCRAFT
   CANDIDATURA STAFF
   ETAPA 5 - TERMO
========================================================== */

const STORAGE = "futury_candidatura";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("form-termo");
    const aceite = document.getElementById("aceite");

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        if (!aceite.checked) {

            alert("Você precisa aceitar o Termo de Voluntariado.");

            return;

        }

        const dados = JSON.parse(
            localStorage.getItem(STORAGE)
        );

        if (!dados) {

            alert("Nenhuma candidatura foi encontrada.");

            window.location.href = "candidatura.html";

            return;

        }

        try {

            const candidatura = {

                /* ==================================================
                   ETAPA 1
                ================================================== */

                nome_completo: dados.nome || dados.nome_completo || null,

                nick: dados.nick || null,

                discord: dados.discord || null,

                idade: dados.idade || null,

                data_nascimento: dados.data || dados.data_nascimento || null,

                genero: dados.genero || null,


                /* ==================================================
                   ETAPA 2
                ================================================== */

                tipo_conta: dados.tipo_conta || null,

                plataforma: dados.plataforma || null,

                acesso_conta: dados.acesso_conta || null,

                tempo_servidor: dados.tempo_servidor || null,

                modo_interesse: dados.modo_interesse || null,

                horario_jogo: dados.horario_jogo || null,

                dias_jogo: dados.dias_jogo || [],


                /* ==================================================
                   ETAPA 3
                ================================================== */

                sobre_voce: dados.sobre_voce || null,

                bom_ajudante: dados.bom_ajudante || null,

                destaque: dados.destaque || null,

                jogador_toxico: dados.jogador_toxico || null,

                suspeita_hack: dados.suspeita_hack || null,

                amigo_regra: dados.amigo_regra || null,

                punicao_injusta: dados.punicao_injusta || null,

                novo_jogador: dados.novo_jogador || null,

                experiencia_staff: dados.experiencia_staff || null,

                servidor_anterior: dados.servidor_anterior || null,

                cargo_anterior: dados.cargo_anterior || null,

                tempo_staff: dados.tempo_staff || null,

                motivo_saida: dados.motivo_saida || null,


                /* ==================================================
                   ETAPA 4
                ================================================== */

                avaliacao_servidor: dados.avaliacao_servidor || null,

                avaliacao_equipe: dados.avaliacao_equipe || null,

                avaliacao_organizacao: dados.avaliacao_organizacao || null,

                avaliacao_eventos: dados.avaliacao_eventos || null,

                avaliacao_atualizacoes: dados.avaliacao_atualizacoes || null,

                melhorias: dados.melhorias || null

            };


            /*
             * Se sua variável for "supabase",
             * troque "supabaseClient" por "supabase".
             */

            const { error } = await supabaseClient

                .from("candidatos")

                .insert(candidatura);


            if (error) {

                console.error(error);

                alert(
                    "Erro ao enviar candidatura.\n\n" +
                    error.message
                );

                return;

            }


            localStorage.removeItem(STORAGE);

            alert(
                "Sua candidatura foi enviada com sucesso!"
            );

            window.location.href =
                "candidatura-sucesso.html";

        }

        catch (erro) {

            console.error(erro);

            alert(
                "Ocorreu um erro inesperado."
            );

        }

    });

});
