// ======================================================
// FUTURYCRAFT
// Painel Administrativo
// ======================================================

let candidatos = [];

let filtroAtual = "Pendente";

// ======================================================
// ELEMENTOS
// ======================================================

const lista = document.getElementById("lista-candidatos");

const titulo = document.getElementById("titulo-lista");

const descricao = document.getElementById("descricao-lista");

// ======================================================
// CARREGAR
// ======================================================

async function carregarCandidatos() {

    lista.innerHTML = `
        <div class="loading">
            Carregando candidatos...
        </div>
    `;

    const { data, error } = await supabaseClient
        .from("candidatos")
        .select("*")
        .order("id", { ascending: false });

    if (error) {

        console.error(error);

        lista.innerHTML = `
            <div class="loading">
                Erro ao carregar candidatos.
            </div>
        `;

        return;

    }

    candidatos = data || [];

    atualizarDashboard();

    atualizarMenu();

    mostrarCandidatos();

}

// ==========================================
// DASHBOARD
// ==========================================

function abrirDashboard() {

    window.location.href = "dashboard.html";

}

function atualizarDashboard() {

    let pendentes = 0;
    let aprovados = 0;
    let recusados = 0;

    let hoje = 0;
    let semana = 0;
    let atrasados = 0;

    const agora = new Date();

    candidatos.forEach(c => {

        const status = (c.status || "Pendente")
            .toLowerCase()
            .trim();

        if (status == "pendente")
            pendentes++;

        if (status == "aprovado")
            aprovados++;

        if (status == "recusado")
            recusados++;

        if (c.created_at) {

            const data = new Date(c.created_at);

            const dias =
                (agora - data) / 86400000;

            if (dias <= 1)
                hoje++;

            if (dias <= 7)
                semana++;

            if (dias > 7)
                atrasados++;

        }

    });

    document.getElementById("pendentes").textContent = pendentes;

    document.getElementById("aprovados").textContent = aprovados;

    document.getElementById("recusados").textContent = recusados;

    if (document.getElementById("hoje"))
        document.getElementById("hoje").textContent = hoje;

    if (document.getElementById("semana"))
        document.getElementById("semana").textContent = semana;

    if (document.getElementById("atrasados"))
        document.getElementById("atrasados").textContent = atrasados;

}

// ======================================================
// MENU
// ======================================================

function atualizarMenu() {

    document
        .querySelectorAll(".menu-btn")
        .forEach(btn => btn.classList.remove("ativo"));

    document.querySelectorAll(".menu-btn").forEach(btn => {

        if (btn.textContent.toLowerCase().includes(filtroAtual.toLowerCase()))
            btn.classList.add("ativo");

    });

}

// ======================================================
// FILTRAR
// ======================================================

function filtrar(status) {

    filtroAtual = status;

    atualizarMenu();

    atualizarTitulo();

    mostrarCandidatos();

}

// ======================================================
// TITULO
// ======================================================

function atualizarTitulo() {

    switch (filtroAtual) {

        case "Pendente":

            titulo.innerHTML =
                "Candidaturas Pendentes";

            descricao.innerHTML =
                "Analise os candidatos que aguardam avaliação.";

            break;

        case "Aprovado":

            titulo.innerHTML =
                "Candidatos Aprovados";

            descricao.innerHTML =
                "Lista completa dos candidatos aprovados.";

            break;

        case "Recusado":

            titulo.innerHTML =
                "Candidatos Reprovados";

            descricao.innerHTML =
                "Lista de candidaturas recusadas.";

            break;

        default:

            titulo.innerHTML =
                "Todas as Candidaturas";

            descricao.innerHTML =
                "Visualize todas as candidaturas cadastradas.";

    }

}

// ======================================================
// TEMPO
// ======================================================

function tempoDecorrido(data) {

    if (!data)
        return "Agora";

    const agora = new Date();

    const envio = new Date(data);

    const segundos =
        Math.floor((agora - envio) / 1000);

    const minutos =
        Math.floor(segundos / 60);

    const horas =
        Math.floor(minutos / 60);

    const dias =
        Math.floor(horas / 24);

    if (dias > 0)
        return dias + " dia(s)";

    if (horas > 0)
        return horas + " hora(s)";

    if (minutos > 0)
        return minutos + " minuto(s)";

    return "Agora";

}

// ======================================================
// RESUMO DO MOTIVO
// ======================================================

function resumo(texto) {

    if (!texto)
        return "Nenhuma descrição.";

    if (texto.length <= 110)
        return texto;

    return texto.substring(0, 110) + "...";

}

// ======================================================
// LISTAR CANDIDATOS
// ======================================================

function mostrarCandidatos() {

    lista.innerHTML = "";

    let listaFiltrada = candidatos;

    if (filtroAtual !== "Todos") {

        listaFiltrada = candidatos.filter(c => {

            return (c.status || "Pendente")
                .toLowerCase()
                .trim() === filtroAtual.toLowerCase();

        });

    }

    if (listaFiltrada.length === 0) {

        lista.innerHTML = `
            <div class="loading">
                Nenhuma candidatura encontrada.
            </div>
        `;

        return;

    }

    listaFiltrada.forEach(candidato => {

        const status = candidato.status || "Pendente";

        const avatar =
            `https://mc-heads.net/avatar/${candidato.nick}/100`;

        lista.innerHTML += criarCard(candidato, status, avatar);

    });

}

// ======================================================
// CARD
// ======================================================

function criarCard(candidato, status, avatar) {

    const tempoServidor =
        candidato.tempo || "Não informado";

    const disponibilidade =
        candidato.disponibilidade || "Não informada";

    const idade =
        candidato.idade || "-";

    const discord =
        candidato.discord || "-";

    const nick =
        candidato.nick || "-";

    const nome =
        candidato.nome_completo || nick;

    const enviado =
        tempoDecorrido(candidato.created_at);

    const motivo =
        resumo(candidato.motivo);

    return `

<div class="candidato-card">

    <div class="card-header">

        <img
        class="avatar"
        src="${avatar}"
        loading="lazy">

        <div class="dados">

            <h3>${nick}</h3>

            <small>${nome}</small>

        </div>

        <span class="status status-${status}">
            ${status}
        </span>

    </div>

    <div class="card-info">

        <p>

            🎂 Idade

            <span>${idade}</span>

        </p>

        <p>

            💬 Discord

            <span>${discord}</span>

        </p>

        <p>

            ⭐ Tempo servidor

            <span>${tempoServidor}</span>

        </p>

        <p>

            ⏰ Disponibilidade

            <span>${disponibilidade}</span>

        </p>

        <p>

            📅 Enviado

            <span>${enviado}</span>

        </p>

    </div>

    <div class="preview-motivo">

        ${motivo}

    </div>

    <div class="card-footer">

        <div class="card-data">

            ID #${candidato.id}

        </div>

        <button
        onclick="verCandidato(${candidato.id})">

            Ver candidatura →

        </button>

    </div>

</div>

`;

}

// ======================================================
// PESQUISA FUTURA
// ======================================================

function pesquisar(texto) {

    texto = texto.toLowerCase();

    lista.innerHTML = "";

    candidatos

    .filter(c => {

        return (

            (c.nick || "")
            .toLowerCase()
            .includes(texto)

            ||

            (c.nome_completo || "")
            .toLowerCase()
            .includes(texto)

            ||

            (c.discord || "")
            .toLowerCase()
            .includes(texto)

        );

    })

    .forEach(candidato => {

        const avatar =
        `https://mc-heads.net/avatar/${candidato.nick}/100`;

        lista.innerHTML += criarCard(

            candidato,

            candidato.status || "Pendente",

            avatar

        );

    });

}

// ======================================================
// ABRIR CANDIDATO
// ======================================================

function verCandidato(id) {

    window.location.href =
        "candidato.html?id=" + id;

}

// ======================================================
// GERENCIAMENTO STAFF
// ======================================================

function abrirStaff() {

    window.location.href =
        "gerenciar-staff.html";

}

// ======================================================
// USUÁRIO
// ======================================================

function abrirUsuario() {

    window.location.href =
        "usuario.html";

}

// ======================================================
// LOGOUT
// ======================================================

async function logout() {

    try {

        await supabaseClient.auth.signOut();

    } catch (e) {

        console.error(e);

    }

    localStorage.clear();

    sessionStorage.clear();

    window.location.replace("login.html");

}

// ======================================================
// ATUALIZAR MENU
// ======================================================

document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("menu-btn"))
        return;

    document.querySelectorAll(".menu-btn").forEach(botao => {

        botao.classList.remove("ativo");

    });

    e.target.classList.add("ativo");

});

// ======================================================
// RECARREGAR
// ======================================================

async function atualizarPainel() {

    await carregarCandidatos();

}

// ======================================================
// AUTO REFRESH
// ======================================================

// Atualiza automaticamente a cada 60 segundos.
// Se não quiser, basta remover este bloco.

setInterval(() => {

    atualizarPainel();

}, 60000);

// ======================================================
// INICIALIZAÇÃO
// ======================================================

window.addEventListener("load", async () => {

    filtroAtual = "Pendente";

    atualizarTitulo();

    atualizarMenu();

    await carregarCandidatos();

});

function abrirStaff(){

    window.location.href = "gerenciar-staff.html";

}

// ======================================================
// FUTURO
// ======================================================

// Aqui poderão ser adicionadas funções como:
//
// • Pesquisa por nick
// • Ordenação
// • Favoritos
// • Candidaturas urgentes
// • Notificações
// • Atualização em tempo real
// • Estatísticas avançadas

// ======================================================
// FIM
// ======================================================
