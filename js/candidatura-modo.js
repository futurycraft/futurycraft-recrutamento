/* ==========================================================
   FUTURYCRAFT
   CANDIDATURA - MODO ATUAL E ETAPA
   Fluxo unico que atende os 3 modos (Skyblock/Rankup/Survival).
   A escolha e feita no gateway (candidatura.html) e guardada em
   modo_interesse no storage futury_candidatura. Este arquivo
   centraliza a leitura do modo e o cabecalho de etapa das
   paginas da candidatura.
========================================================== */

(function(){

    const STORAGE = "futury_candidatura";

    const MODOS = ["Skyblock", "Rankup", "Survival"];


    function modoAtual(){
        try {
            const dados = JSON.parse(
                localStorage.getItem(STORAGE) || "null"
            );

            const modo = dados && dados.modo_interesse;

            if (MODOS.indexOf(modo) !== -1) {
                return modo;
            }
        } catch (ignorar) {}

        return "Skyblock";
    }


    function preencherEtapa(numero, titulo){
        const passo = document.getElementById("step-etapa");

        if (passo) {
            passo.textContent =
                modoAtual() + " • Etapa " + numero + " de 5";
        }

        const cabecalho = document.getElementById("titulo-etapa");

        if (cabecalho && titulo) {
            cabecalho.textContent = titulo;
        }

        const modo = modoAtual().toLowerCase();

        document.documentElement.setAttribute("data-modo", modo);

        if (document.body) {
            document.body.setAttribute("data-modo", modo);
        }

        document.title =
            "Recrutamento " + modoAtual() + " • FuturyCraft";
    }


    window.FurtyCandidatura = {
        STORAGE: STORAGE,
        modoAtual: modoAtual,
        preencherEtapa: preencherEtapa
    };

})();