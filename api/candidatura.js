import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {

    if (req.method !== "POST") {

        return res.status(405).json({
            sucesso: false,
            erro: "Método não permitido."
        });

    }

    try {

        const dados = req.body;

        /* ==========================================
           VALIDAÇÕES BÁSICAS
        ========================================== */

        if (!dados.nome_completo) {

            return res.status(400).json({
                sucesso: false,
                erro: "Nome completo é obrigatório."
            });

        }

        if (!dados.nick) {

            return res.status(400).json({
                sucesso: false,
                erro: "Nick é obrigatório."
            });

        }

        if (!dados.discord) {

            return res.status(400).json({
                sucesso: false,
                erro: "Discord é obrigatório."
            });

        }

        /* ==========================================
           INSERIR NO SUPABASE
        ========================================== */

        const { data, error } = await supabase

            .from("candidatos")

            .insert([dados])

            .select()

            .single();

        if (error) {

            console.error(error);

            return res.status(500).json({
                sucesso: false,
                erro: error.message
            });

        }

        return res.status(200).json({

            sucesso: true,

            mensagem: "Candidatura enviada com sucesso.",

            candidatura: data

        });

    }

    catch (erro) {

        console.error(erro);

        return res.status(500).json({

            sucesso: false,

            erro: "Erro interno do servidor."

        });

    }

}
