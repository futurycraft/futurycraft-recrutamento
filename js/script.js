/* ===========================================
   FUTURYCRAFT - RECRUTAMENTO STAFF
   SCRIPT.JS
=========================================== */


/* ===========================================
   DADOS DOS CARGOS
=========================================== */


const roles = {


ajudante:{


name:"Ajudante",


level:"Nível 1",


image:"./assets/staff/ajudante.png",


description:

"Primeiro cargo da equipe. Responsável por auxiliar jogadores, responder dúvidas e ajudar na organização inicial da comunidade.",


permissions:[

"Atendimento aos jogadores",

"Auxílio em dúvidas básicas",

"Reportar problemas para superiores",

"Ajudar novos membros"

]


},




moderador:{


name:"Moderador",


level:"Nível 2",


image:"./assets/staff/moderador.png",


description:

"Responsável por manter a organização da comunidade e garantir que as regras sejam cumpridas.",


permissions:[

"Moderação do chat",

"Aplicação de punições",

"Análise de denúncias",

"Organização da comunidade"

]


},




admin:{


name:"Administrador",


level:"Nível 3",


image:"./assets/staff/admin.png",


description:

"Atua na administração operacional do servidor, ajudando no controle dos sistemas e da equipe.",


permissions:[

"Gerenciamento de sistemas",

"Suporte avançado",

"Auxílio aos cargos superiores",

"Organização interna"

]


},




gerente:{


name:"Gerente",


level:"Nível 4",


image:"./assets/staff/gerente.png",


description:

"Coordena equipes e acompanha o desempenho dos membros da Staff.",


permissions:[

"Gerenciamento de equipes",

"Avaliação de membros",

"Planejamento de melhorias",

"Organização de projetos"

]


},




diretor:{


name:"Diretor",


level:"Nível 5",


image:"./assets/staff/diretor.png",


description:

"Maior nível da hierarquia operacional. Responsável pela liderança e decisões importantes do projeto.",


permissions:[

"Liderança da equipe",

"Decisões administrativas",

"Planejamento do servidor",

"Gestão geral do projeto"

]


}


};




/* ===========================================
   ABRIR CARGO
=========================================== */


function openRole(role){



const data = roles[role];


if(!data){

console.error(
"Cargo não encontrado:",
role
);

return;

}




// CARD PRINCIPAL


const image = document.getElementById(
"roleImage"
);


const title = document.getElementById(
"roleTitle"
);


const level = document.getElementById(
"roleLevel"
);


const description = document.getElementById(
"roleDescription"
);


const list = document.getElementById(
"roleList"
);




if(image)
image.src = data.image;



if(title)
title.innerText = data.name;



if(level)
level.innerText = data.level;



if(description)
description.innerText = data.description;




if(list){


list.innerHTML="";


data.permissions.forEach(item=>{


const li=document.createElement(
"li"
);


li.innerText=item;


list.appendChild(li);


});


}




// MODAL


const modal =
document.getElementById(
"roleModal"
);



const modalImage =
document.getElementById(
"modalRoleImage"
);



const modalTitle =
document.getElementById(
"modalRoleTitle"
);



const modalLevel =
document.getElementById(
"modalRoleLevel"
);



const modalText =
document.getElementById(
"modalRoleText"
);



const modalList =
document.getElementById(
"modalRoleList"
);



if(modalImage)
modalImage.src=data.image;



if(modalTitle)
modalTitle.innerText=data.name;



if(modalLevel)
modalLevel.innerText=data.level;



if(modalText)
modalText.innerText=data.description;



if(modalList){


modalList.innerHTML="";


data.permissions.forEach(item=>{


const li=document.createElement(
"li"
);


li.innerText=item;


modalList.appendChild(li);


});


}



if(modal){

modal.classList.add(
"active"
);

}



}

/* ===========================================
   FECHAR MODAL
=========================================== */


function closeRole(){


const modal = document.getElementById(
"roleModal"
);



if(modal){

modal.classList.remove(
"active"
);

}


}





/* ===========================================
   FECHAR COM TECLA ESC
=========================================== */


document.addEventListener(
"keydown",
(event)=>{


if(event.key === "Escape"){


closeRole();


}


});







/* ===========================================
   ANIMAÇÃO DOS ELEMENTOS
=========================================== */


document.addEventListener(
"DOMContentLoaded",
()=>{



const elements = document.querySelectorAll(
".staff-role, .requirement-card, .benefit-card, .timeline-item, .hero-stat"
);



elements.forEach(
(element,index)=>{


element.style.opacity="0";


element.style.transform=
"translateY(30px)";



setTimeout(()=>{


element.style.transition=
"all .6s ease";


element.style.opacity="1";


element.style.transform=
"translateY(0)";



},index * 100);



});



});







/* ===========================================
   EFEITO PARALLAX SUAVE
=========================================== */


document.addEventListener(
"mousemove",
(event)=>{



const image =
document.querySelector(
".ImagemPrincipal"
);



if(!image)
return;



const x =
(event.clientX /
window.innerWidth - .5)
* 10;



const y =
(event.clientY /
window.innerHeight - .5)
* 10;




image.style.transform =
`
translate(${x}px, ${y}px)
`;



});







/* ===========================================
   SCROLL SUAVE NOS BOTÕES
=========================================== */


const scrollButtons =
document.querySelectorAll(
"[data-scroll]"
);



scrollButtons.forEach(
(button)=>{


button.addEventListener(
"click",
()=>{


const target =
document.querySelector(
button.dataset.scroll
);



if(target){


target.scrollIntoView({

behavior:"smooth"

});


}



});


});







/* ===========================================
   FALLBACK DE IMAGENS
=========================================== */


document.querySelectorAll(
"img"
)
.forEach(
(img)=>{


img.addEventListener(
"error",
()=>{


console.warn(
"Imagem não encontrada:",
img.src
);



img.style.opacity=".3";



});



});







/* ===========================================
   ANO AUTOMÁTICO FOOTER
=========================================== */


const year =
document.querySelector(
"#currentYear"
);



if(year){


year.innerText =
new Date()
.getFullYear();


}

