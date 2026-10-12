/* ==========================================================
   FUTURYCRAFT
   GATEWAY DE CANDIDATURA (candidatura.html)
   Seleção de vaga (Ajudante/Moderador/Admin) + servidor
   (Skyblock/Rankup/Survival). Grava a escolha no storage do
   servidor e inicia o fluxo correspondente.
========================================================== */

(function(){

    const MODOS = {
        skyblock: {
            rotulo: "Skyblock",
            chave: "futury_candidatura",
            href: "candidatos.html"
        },
        rankup: {
            rotulo: "Rankup",
            chave: "futury_candidatura",
            href: "candidatos.html"
        },
        survival: {
            rotulo: "Survival",
            chave: "futury_candidatura",
            href: "candidatos.html"
        }
    };

    let vaga = null;
    let modo = null;

    const cardsVaga = document.querySelectorAll(".vaga-card");
    const cardsModo = document.querySelectorAll(".modo-card");
    const cta = document.getElementById("cta-iniciar");
    const hint = document.getElementById("cta-hint");


    function atualizarCta(){
        if (vaga && modo) {
            cta.disabled = false;
            cta.classList.add("pronto");
        }
    }


    cardsVaga.forEach(card => {
        card.addEventListener("click", () => {
            cardsVaga.forEach(x => x.classList.remove("selecionado"));
            card.classList.add("selecionado");
            vaga = card.dataset.vaga;
            atualizarCta();
        });
    });


    cardsModo.forEach(card => {
        card.addEventListener("click", () => {
            if (!vaga) {
                hint.textContent = "Primeiro escolha a vaga acima.";
                hint.classList.add("visivel");
                return;
            }
            cardsModo.forEach(x => x.classList.remove("selecionado"));
            card.classList.add("selecionado");
            modo = card.dataset.modo;
            hint.classList.remove("visivel");
            atualizarCta();
        });
    });


    cta.addEventListener("click", () => {
        if (!vaga || !modo)
            return;

        const alvo = MODOS[modo];

        localStorage.setItem(
            alvo.chave,
            JSON.stringify({
                vaga: vaga,
                modo_interesse: alvo.rotulo
            })
        );

        window.location.href = "./" + alvo.href;
    });

})();