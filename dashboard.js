```javascript
// ==========================================
// FUTURYCRAFT DASHBOARD STAFF
// ==========================================

const SUPABASE_URL = "https://jssscxlnzytmwzbabvhu.supabase.co";
const SUPABASE_KEY = "SUA_CHAVE_AQUI";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// ==========================================
// VERIFICAR LOGIN
// ==========================================

async function verificarLogin() {

    const { data } = await supabaseClient.auth.getSession();

    if (!data.session) {
        window.location.href = "login.html";
    }

}

// ==========================================
// CARREGAR ESTATÍSTICAS
// ==========================================

async function carregarEstatisticas() {

    try {

        const { data, error } = await supabaseClient
            .from("candidatos")
            .select("*");

        if (error) {
            console.error(error);
            return;
        }

        const total = data.length;

        const pendentes = data.filter(
            c => c.status === "pendente"
        ).length;

        const aprovados = data.filter(
            c => c.status === "aprovado"
        ).length;

        const recusados = data.filter(
            c => c.status === "recusado"
        ).length;

        const analise = data.filter(
            c => c.status === "analise"
        ).length;

        document.getElementById("total").textContent = total;

        document.getElementById("pendentes").textContent = pendentes;

        document.getElementById("aprovados").textContent = aprovados;

        document.getElementById("recusados").textContent = recusados;

        document.getElementById("analise").textContent = analise;

        let taxa = 0;

        if (total > 0) {
            taxa = Math.round((aprovados / total) * 100);
        }

        document.getElementById("taxa").textContent = taxa + "%";

    } catch(err) {

        console.error(err);

    }

}

// ==========================================
// ATIVIDADES RECENTES
// ==========================================

async function carregarAtividades() {

    const container = document.getElementById("atividade");

    try {

        const { data, error } = await supabaseClient
            .from("candidatos")
            .select("*")
            .order("data_analise", {
                ascending: false
            })
            .limit(8);

        if (error) {
            console.error(error);
            return;
        }

        if (!data.length) {

            container.innerHTML = `
                <div class="activity-item">
                    Nenhuma atividade encontrada.
                </div>
            `;

            return;

        }

        container.innerHTML = "";

        data.forEach(candidato => {

            let status = candidato.status || "pendente";

            let avaliador =
                candidato.avaliador || "Sistema";

            let dataAnalise = candidato.data_analise
                ? new Date(
                    candidato.data_analise
                  ).toLocaleDateString("pt-BR")
                : "-";

            container.innerHTML += `
                <div class="activity-item">
                    <strong>${candidato.nick}</strong><br>
                    Status: ${status}<br>
                    Avaliador: ${avaliador}<br>
                    Data: ${dataAnalise}
                </div>
            `;

        });

    } catch(err) {

        console.error(err);

    }

}

// ==========================================
// LOGOUT
// ==========================================

async function logout() {

    await supabaseClient.auth.signOut();

    window.location.href = "login.html";

}

// ==========================================
// INICIAR
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {

    await verificarLogin();

    await carregarEstatisticas();

    await carregarAtividades();

});
```
