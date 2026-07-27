/* ===========================================
   FUTURYCRAFT - RECRUTAMENTO
   RECRUTAMENTO.JS
=========================================== */


document.addEventListener("DOMContentLoaded", () => {



const startButton = document.getElementById(
"start-button"
);


const primeiraEtapa = document.getElementById(
"primeira-etapa"
);


const segundaEtapa = document.getElementById(
"segunda-etapa"
);





if(!startButton) return;





startButton.addEventListener(
"click",
()=>{



// esconder primeira tela

primeiraEtapa.classList.add(
"fade-out"
);





setTimeout(()=>{



primeiraEtapa.style.display="none";



segundaEtapa.classList.remove(
"hidden-step"
);



segundaEtapa.classList.add(
"fade-in"
);



},400);




});




});
