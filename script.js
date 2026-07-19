// ==========================================
// FUTURYCRAFT - SISTEMA DE CANDIDATURA STAFF
// Conexão Supabase
// ==========================================

const supabaseClient = window.supabase.createClient(
    "https://jssscxlnzytmwzbabvhu.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzc3NjeGxuenl0bXd6YmFidmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NzE2NzcsImV4cCI6MjEwMDA0NzY3N30.Ku_HJdFQYyEmLmjkynye90l0bpM0MbbFVJPZDMCEOXQ"
);


// ==========================================
// ENVIO DO FORMULÁRIO
// ==========================================

const formulario = document.querySelector("#form-candidatura");

if (formulario) {

    formulario.addEventListener("submit", async (event) => {

        event.preventDefault();


        const nome = document.querySelector("#nome").value;
        const discord = document.querySelector("#discord").value;
        const idade = document.querySelector("#idade").value;
        const cargo = document.querySelector("#cargo").value;
        const experiencia = document.querySelector("#experiencia").value;
        const motivo = document.querySelector("#motivo").value;


        const botao = formulario.querySelector("button");

        botao.disabled = true;
        botao.innerHTML = "Enviando...";


        const { data, error } = await supabaseClient
            .from("candidaturas")
            .insert([
                {
                    nome: nome,
                    discord: discord,
                    idade: idade,
                    cargo: cargo,
                    experiencia: experiencia,
                    motivo: motivo
                }
            ]);


        if (error) {

            console.error("Erro Supabase:", error);

            alert(
                "Ocorreu um erro ao enviar sua candidatura.\n\nTente novamente."
            );

            botao.disabled = false;
            botao.innerHTML = "Enviar candidatura";

            return;
        }


        alert(
            "✅ Candidatura enviada com sucesso!\n\nA equipe FuturyCraft irá analisar sua inscrição."
        );


        formulario.reset();


        botao.disabled = false;
        botao.innerHTML = "Enviar candidatura";

    });

}
