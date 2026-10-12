/* ==========================================================
   FUTURYCRAFT
   CANDIDATURA STAFF
   ETAPA 3 - PERFIL (render dinamico por vaga x minigame)
   As perguntas vêm de js/questionario.js:
   QUESTIONARIO[modo][vaga]. Respostas salvas em `respostas`
   (lista {pergunta, resposta}) e, quando o id corresponder a
   uma coluna legada, também na coluna individual.
========================================================== */


function detectarModo(){
    const caminho = (
        location.pathname
    ).toLowerCase();

    if (caminho.includes("rankup"))
        return "Rankup";

    if (caminho.includes("survival"))
        return "Survival";

    return "Skyblock";
}


function chaveStorage(modo){
    if (modo === "Rankup")
        return "futury_candidatura_rankup";

    if (modo === "Survival")
        return "futury_candidatura_survival";

    return "futury_candidatura";
}


const MODO = detectarModo();
const STORAGE = chaveStorage(MODO);

const COLUNAS_LEGADAS = [
    "sobre_vc",
    "bom_ajudante",
    "destaque",
    "jogador_toxico",
    "suspeita_hack",
    "amigo_regra",
    "punicao_injusta",
    "novo_jogador"
];


/* ==========================================================
ESTADO DA VAGA
========================================================== */


function vagaAtual(){
    const dados = JSON.parse(
        localStorage.getItem(STORAGE)
    ) || {};

    const vaga = dados.vaga || "Ajudante";
    const key = String(vaga).toLowerCase();

    const set =
        window.QUESTIONARIO &&
        window.QUESTIONARIO[MODO] &&
        window.QUESTIONARIO[MODO][key]
            ? window.QUESTIONARIO[MODO][key]
            : window.QUESTIONARIO[MODO].ajudante;

    return { vaga, set };
}


function contextualizarPagina(data){
    const etapa = document.getElementById("step-etapa");

    if (etapa) {
        etapa.textContent =
            data.vaga +
            " • " +
            MODO +
            " • Etapa 3 de 5";
    }

    document.title =
        "Recrutamento " +
        data.vaga +
        " " +
        MODO +
        " • Perfil | FuturyCraft";
}


/* ==========================================================
RENDER DAS PERGUNTAS
========================================================== */


function campoHtml(q, legado){
    return `
<div class="campo">

<label>
${q.texto}
</label>


<textarea

id="${q.id}"

maxlength="${q.max}"

placeholder="${q.dica}"

required>

${legado || ""}

</textarea>


</div>
`;
}


function situacaoHtml(q, legado){
    return `
<div class="pergunta-card">

<label>
${q.texto}
</label>


<textarea

id="${q.id}"

maxlength="${q.max}"

placeholder="${q.dica}"

required>

${legado || ""}

</textarea>


</div>
`;
}


function renderPerguntas(data){
    const blocoSobre = document.getElementById("bloco-sobre");
    const blocoSituacoes = document.getElementById("bloco-situacoes");

    if (!blocoSobre || !blocoSituacoes) {
        return;
    }

    const sobre = data.set.filter(p => p.secao === "sobre");
    const situacoes = data.set.filter(p => p.secao === "situacoes");

    blocoSobre.innerHTML = `

<div class="secao-card">

<div class="secao-header">

<span>
👤
</span>

<h2>
Sobre você
</h2>

</div>


${sobre.map(p => campoHtml(
    p,
    data.dados[p.id] || ""
)).join("")}


</div>
`;

    blocoSituacoes.innerHTML = `

<div class="secao-card">

<div class="secao-header">

<span>
🛡️
</span>

<h2>
Situações de Staff
</h2>

</div>


${situacoes.map(p => situacaoHtml(
    p,
    data.dados[p.id] || ""
)).join("")}


</div>
`;
}


/* ==========================================================
ELEMENTOS ESTATICOS (experiência anterior)
========================================================== */


document.addEventListener("DOMContentLoaded", () => {

    const dadosArquivo = JSON.parse(
        localStorage.getItem(STORAGE)
    ) || {};

    const contexto = vagaAtual();

    contextualizarPagina(contexto);

    renderPerguntas({
        set: contexto.set,
        dados: dadosArquivo
    });

    const form = document.getElementById("form-perfil");

    const experienciaRadios = document.querySelectorAll(
        'input[name="experiencia_staff"]'
    );

    const experienciaBox = document.getElementById(
        "experiencia-box"
    );


    /* ---------- salvar ao digitar ---------- */

    function salvarDados(){
        const dados = JSON.parse(
            localStorage.getItem(STORAGE)
        ) || {};

        contexto.set.forEach(p => {
            const campo = document.getElementById(p.id);
            if (campo) {
                dados[p.id] = campo.value;
            }
        });

        const camposExperiencia = {
            servidor_anterior: document.getElementById("servidor_anterior"),
            cargo_anterior: document.getElementById("cargo_anterior"),
            tempo_staff: document.getElementById("tempo_staff"),
            motivo_saida: document.getElementById("motivo_saida")
        };

        Object.keys(camposExperiencia).forEach(chave => {
            if (camposExperiencia[chave]) {
                dados[chave] = camposExperiencia[chave].value;
            }
        });

        const experiencia = document.querySelector(
            'input[name="experiencia_staff"]:checked'
        );

        dados.experiencia_staff = experiencia
            ? experiencia.value
            : "";

        dados.vaga = contexto.vaga;
        dados.modo_interesse = MODO;

        dados.respostas = [];
        contexto.set.forEach(p => {
            const campo = document.getElementById(p.id);
            dados.respostas.push({
                pergunta: p.texto,
                resposta: campo
                    ? campo.value
                    : ""
            });
        });

        localStorage.setItem(
            STORAGE,
            JSON.stringify(dados)
        );
    }


    /* ---------- controlar box de experiência ---------- */

    function controlarExperiencia(){
        const selecionado = document.querySelector(
            'input[name="experiencia_staff"]:checked'
        );

        if (!experienciaBox)
            return;

        if (selecionado && selecionado.value === "Sim") {
            experienciaBox.classList.remove("escondido");
            experienciaBox.classList.add("mostrar");
        } else {
            experienciaBox.classList.add("escondido");
            experienciaBox.classList.remove("mostrar");
        }
    }


    /* ---------- carregar experiência do storage ---------- */

    function carregarExperiencia(){
        const dados = dadosArquivo;

        [
            "servidor_anterior",
            "cargo_anterior",
            "tempo_staff",
            "motivo_saida"
        ].forEach(chave => {
            const campo = document.getElementById(chave);
            if (campo && dados[chave]) {
                campo.value = dados[chave];
            }
        });

        if (dados.experiencia_staff) {
            const radio = document.querySelector(
                'input[name="experiencia_staff"][value="' + dados.experiencia_staff + '"]'
            );
            if (radio) {
                radio.checked = true;
            }
        }

        controlarExperiencia();
    }


    /* ---------- validação ---------- */

    function validarFormulario(){
        for (const p of contexto.set) {
            const campo = document.getElementById(p.id);
            if (!campo || campo.value.trim().length < 10) {
                alert(
                    "Responda todas as perguntas com mais detalhes."
                );
                if (campo) campo.focus();
                return false;
            }
        }

        const experiencia = document.querySelector(
            'input[name="experiencia_staff"]:checked'
        );

        if (!experiencia) {
            alert("Informe se já fez parte de uma equipe.");
            return false;
        }

        if (experiencia.value === "Sim") {
            const camposExperiencia = [
                document.getElementById("servidor_anterior"),
                document.getElementById("cargo_anterior"),
                document.getElementById("tempo_staff"),
                document.getElementById("motivo_saida")
            ];

            for (const campo of camposExperiencia) {
                if (!campo || campo.value.trim() === "") {
                    alert(
                        "Preencha todas as informações da experiência anterior."
                    );
                    if (campo) campo.focus();
                    return false;
                }
            }
        }

        return true;
    }


    /* ---------- submit ---------- */

    function enviarFormulario(event){
        event.preventDefault();

        if (!validarFormulario())
            return;

        salvarDados();

        const destino =
            MODO === "Rankup"
                ? "candidatura-rankup-feedback.html"
                : MODO === "Survival"
                    ? "candidatura-survival-feedback.html"
                    : "candidatura-feedback.html";

        window.location.href = destino;
    }


    /* ---------- eventos ---------- */

    contexto.set.forEach(p => {
        const campo = document.getElementById(p.id);
        if (!campo)
            return;

        campo.addEventListener("input", salvarDados);
        campo.addEventListener("change", salvarDados);
    });

    experienciaRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            controlarExperiencia();
        });
        radio.addEventListener("change", salvarDados);
    });

    [
        "servidor_anterior",
        "cargo_anterior",
        "tempo_staff",
        "motivo_saida"
    ].forEach(chave => {
        const campo = document.getElementById(chave);
        if (campo) {
            campo.addEventListener("input", salvarDados);
            campo.addEventListener("change", salvarDados);
        }
    });

    if (form) {
        form.addEventListener("submit", enviarFormulario);
    }

    carregarExperiencia();
});