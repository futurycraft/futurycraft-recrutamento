/* ==========================================
   FUTURYCRAFT
   CANDIDATOS.JS
========================================== */

"use strict";

/* ==========================================
   SUPABASE
========================================== */

const db = window.supabaseClient;

/* ==========================================
   ELEMENTOS
========================================== */

const form = document.getElementById("form-candidatos");

const pagina1 = document.getElementById("pagina1");
const pagina2 = document.getElementById("pagina2");

const etapas = document.querySelectorAll(".etapa");

const botaoEnviar = document.querySelector(".botao");

/* ==========================================
   CAMPOS
========================================== */

const nome = document.getElementById("nome_completo");
const nick = document.getElementById("nick");
const discord = document.getElementById("discord");

const idade = document.getElementById("idade");
const idadeTexto = document.getElementById("valorIdade");

const nascimento = document.getElementById("data_nascimento");

const genero = document.getElementById("genero");

const tempo = document.getElementById("tempo");
const tempoTexto = document.getElementById("valorTempo");

const disponibilidade = document.getElementById("disponibilidade");
const motivo = document.getElementById("motivo");
const ajuda = document.getElementById("ajuda");
const hack = document.getElementById("hack");

/* ==========================================
   ESTADO
========================================== */

let enviando = false;

/* ==========================================
   IDADE
========================================== */

function mostrarIdade(valor){

    idadeTexto.textContent = valor;

}

/* ==========================================
   TEMPO
========================================== */

function mostrarTempo(valor){

    valor = Number(valor);

    let texto;

    if(valor < 12){

        texto = valor + (valor === 1 ? " mês" : " meses");

    }else{

        const anos = Math.floor(valor / 12);

        const meses = valor % 12;

        if(meses === 0){

            texto = anos + (anos === 1 ? " ano" : " anos");

        }else{

            texto =
                anos +
                (anos === 1 ? " ano " : " anos ") +
                meses +
                " meses";

        }

    }

    tempoTexto.textContent = texto;

}

/* ==========================================
   GÊNERO
========================================== */

function selecionarSexo(botao, valor){

    document
        .querySelectorAll(".sexo-btn")
        .forEach(btn => {

            btn.classList.remove("selecionado");

        });

    botao.classList.add("selecionado");

    genero.value = valor;

}

/* ==========================================
   SCROLL
========================================== */

function voltarTopo(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

/* ==========================================
   ETAPAS
========================================== */

function atualizarEtapas(indice){

    etapas.forEach((etapa, i)=>{

        etapa.classList.remove("ativa");

        if(i === indice){

            etapa.classList.add("ativa");

        }

    });

}

/* ==========================================
   MOSTRAR SEGUNDA ETAPA
========================================== */

function mostrarPagina2(){

    if(!validarPrimeiraPagina()){

        return;

    }

    pagina1.style.display = "none";

    pagina2.style.display = "block";

    atualizarEtapas(1);

    voltarTopo();

}

/* ==========================================
   VOLTAR
========================================== */

function voltarPagina1(){

    pagina2.style.display = "none";

    pagina1.style.display = "block";

    atualizarEtapas(0);

    voltarTopo();

}

/* ==========================================
   EVENTOS
========================================== */

idade.addEventListener("input", ()=>{

    mostrarIdade(idade.value);

});

tempo.addEventListener("input", ()=>{

    mostrarTempo(tempo.value);

});

/* ==========================================
   INICIALIZAÇÃO
========================================== */

mostrarIdade(idade.value);

mostrarTempo(tempo.value);

/* ==========================================
   EXPORTA PARA O HTML
========================================== */

window.mostrarPagina2 = mostrarPagina2;

window.voltarPagina1 = voltarPagina1;

window.mostrarIdade = mostrarIdade;

window.mostrarTempo = mostrarTempo;

window.selecionarSexo = selecionarSexo;

/* ==========================================
   VALIDAÇÕES
========================================== */

function validarTexto(campo, minimo, mensagem){

    const valor = campo.value.trim();

    if(valor.length < minimo){

        alert(mensagem);

        campo.focus();

        return false;

    }

    return true;

}

function validarPrimeiraPagina(){

    if(!validarTexto(
        nome,
        5,
        "Informe seu nome completo."
    )){

        return false;

    }

    if(!validarTexto(
        nick,
        3,
        "Informe um nick válido."
    )){

        return false;

    }

    if(nick.value.trim().length > 16){

        alert("O nick pode possuir no máximo 16 caracteres.");

        nick.focus();

        return false;

    }

    if(!validarTexto(
        discord,
        3,
        "Informe seu usuário do Discord."
    )){

        return false;

    }

    if(Number(idade.value) < 14){

        alert("É necessário ter pelo menos 14 anos para participar do recrutamento.");

        idade.focus();

        return false;

    }

    if(nascimento.value === ""){

        alert("Informe sua data de nascimento.");

        nascimento.focus();

        return false;

    }

    if(genero.value === ""){

        alert("Selecione como prefere ser identificado.");

        return false;

    }

    return true;

}

/* ==========================================
   SEGUNDA ETAPA
========================================== */

function validarSegundaPagina(){

    if(!validarTexto(

        disponibilidade,

        10,

        "Descreva melhor sua disponibilidade."

    )){

        return false;

    }

    if(!validarTexto(

        motivo,

        40,

        "Explique melhor o motivo da candidatura."

    )){

        return false;

    }

    if(!validarTexto(

        ajuda,

        40,

        "Explique melhor como pretende ajudar o servidor."

    )){

        return false;

    }

    if(!validarTexto(

        hack,

        40,

        "Explique como agiria diante de um jogador utilizando hack."

    )){

        return false;

    }

    return true;

}

/* ==========================================
   CONTADOR DE CARACTERES
========================================== */

function criarContador(textarea){

    const contador = document.createElement("small");

    contador.className = "contador-caracteres";

    contador.style.display = "block";

    contador.style.marginTop = "8px";

    contador.style.opacity = ".7";

    contador.textContent = "0 caracteres";

    textarea.parentNode.appendChild(contador);

    textarea.addEventListener("input",()=>{

        contador.textContent =
            textarea.value.length +
            " caracteres";

    });

}

criarContador(disponibilidade);

criarContador(motivo);

criarContador(ajuda);

criarContador(hack);

/* ==========================================
   ENTER
========================================== */

document.addEventListener("keydown",(event)=>{

    if(event.key !== "Enter"){

        return;

    }

    if(event.target.tagName === "TEXTAREA"){

        return;

    }

    event.preventDefault();

});

/* ==========================================
   EVITA ESPAÇOS DUPLOS
========================================== */

[nome,nick,discord].forEach(campo=>{

    campo.addEventListener("blur",()=>{

        campo.value = campo.value
            .replace(/\s+/g," ")
            .trim();

    });

});

/* ==========================================
   NICK
========================================== */

nick.addEventListener("input",()=>{

    nick.value = nick.value
        .replace(/[^a-zA-Z0-9_]/g,"");

});

/* ==========================================
   NOME
========================================== */

nome.addEventListener("input",()=>{

    nome.value = nome.value
        .replace(/\s{2,}/g," ");

});

/* ==========================================
   ENVIAR FORMULÁRIO
========================================== */

form.addEventListener("submit", async function(event){

    event.preventDefault();

    if(enviando){

        return;

    }

    if(!validarPrimeiraPagina()){

        voltarPagina1();

        return;

    }

    if(!validarSegundaPagina()){

        return;

    }

    enviando = true;

    botaoEnviar.disabled = true;

    const textoOriginal = botaoEnviar.innerHTML;

    botaoEnviar.innerHTML = "ENVIANDO...";

    try{

        const { error } = await db
        .from("candidatos")
        .insert([

            {

                nome_completo: nome.value.trim(),

                nick: nick.value.trim(),

                discord: discord.value.trim(),

                idade: Number(idade.value),

                data_nascimento: nascimento.value,

                genero: genero.value,

                tempo: tempoTexto.textContent,

                disponibilidade: disponibilidade.value.trim(),

                motivo: motivo.value.trim(),

                ajuda: ajuda.value.trim(),

                hack: hack.value.trim(),

                status: "Pendente",

                avaliador: null,

                observacao: null,

                data_analise: null

            }

        ]);

        if(error){

            throw error;

        }

        alert(
            "Sua candidatura foi enviada com sucesso!\n\nBoa sorte no recrutamento da FuturyCraft!"
        );

        limparFormulario();

    }

    catch(error){

        console.error(error);

        alert(

            "Ocorreu um erro ao enviar sua candidatura.\n\nTente novamente em alguns instantes."

        );

    }

    finally{

        enviando = false;

        botaoEnviar.disabled = false;

        botaoEnviar.innerHTML = textoOriginal;

    }

});

/* ==========================================
   BOTÃO ENVIAR
========================================== */

botaoEnviar.addEventListener("mouseenter",()=>{

    if(!botaoEnviar.disabled){

        botaoEnviar.style.transform = "translateY(-2px)";

    }

});

botaoEnviar.addEventListener("mouseleave",()=>{

    botaoEnviar.style.transform = "";

});

/* ==========================================
   PROTEÇÃO CONTRA DUPLO CLIQUE
========================================== */

botaoEnviar.addEventListener("click",(event)=>{

    if(enviando){

        event.preventDefault();

    }

});

/* ==========================================
   LIMPAR FORMULÁRIO
========================================== */

function limparFormulario(){

    form.reset();

    genero.value = "";

    document
        .querySelectorAll(".sexo-btn")
        .forEach(botao=>{

            botao.classList.remove("selecionado");

        });

    idade.value = 15;

    tempo.value = 1;

    mostrarIdade(15);

    mostrarTempo(1);

    pagina2.style.display = "none";

    pagina1.style.display = "block";

    atualizarEtapas(0);

    document
        .querySelectorAll(".contador-caracteres")
        .forEach(contador=>{

            contador.textContent = "0 caracteres";

        });

    voltarTopo();

}

/* ==========================================
   IMPEDIR COLAR TEXTOS GIGANTES
========================================== */

[
    disponibilidade,
    motivo,
    ajuda,
    hack
].forEach(campo=>{

    campo.maxLength = 1000;

});

/* ==========================================
   AUTO CAPITALIZAÇÃO
========================================== */

nome.addEventListener("blur",()=>{

    nome.value = nome.value
        .toLowerCase()
        .replace(/\b\w/g,letra=>letra.toUpperCase());

});

/* ==========================================
   ANIMAÇÃO DOS CAMPOS
========================================== */

document
.querySelectorAll("input, textarea")
.forEach((campo,index)=>{

    campo.style.opacity = "0";

    campo.style.transform = "translateY(15px)";

    setTimeout(()=>{

        campo.style.transition = ".35s";

        campo.style.opacity = "1";

        campo.style.transform = "translateY(0)";

    },index * 40);

});

/* ==========================================
   VALIDAÇÃO DE DATA
========================================== */

nascimento.max = new Date().toISOString().split("T")[0];

/* ==========================================
   MENSAGEM DE BOAS VINDAS
========================================== */

console.log("%cFuturyCraft Staff",
"color:#00d9ff;font-size:18px;font-weight:bold;");

console.log(
"Formulário carregado com sucesso."
);

/* ==========================================
   VERIFICAÇÃO DO SUPABASE
========================================== */

if(!supabase){

    console.error(

        "Supabase não encontrado.\nVerifique se o arquivo supabase.js está sendo carregado antes do candidatos.js."

    );

}

/* ==========================================
   INICIALIZAÇÃO
========================================== */

document.addEventListener("DOMContentLoaded",()=>{

    mostrarIdade(idade.value);

    mostrarTempo(tempo.value);

    atualizarEtapas(0);

    pagina1.style.display = "block";

    pagina2.style.display = "none";

});

/* ==========================================
   FIM DO ARQUIVO
========================================== */
