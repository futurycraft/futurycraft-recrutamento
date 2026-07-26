const roles = {


ajudante:{


name:"Ajudante",

level:"Nível 1",

image:"./assets/staff/ajudante.png",


description:
"Primeiro passo dentro da equipe FuturyCraft. O Ajudante auxilia jogadores e aprende todos os procedimentos da equipe.",


responsibilities:[

"Auxiliar jogadores com dúvidas",

"Conhecer as regras do servidor",

"Reportar problemas encontrados",

"Acompanhar a equipe"

],


requirements:[

"Ter boa comunicação",

"Conhecer o servidor",

"Ser ativo na comunidade"

]


},





moderador:{


name:"Moderador",

level:"Nível 3",

image:"./assets/staff/moderador.png",


description:
"Responsável por manter a organização do servidor e garantir uma boa experiência para todos os jogadores.",


responsibilities:[

"Aplicar punições",

"Monitorar jogadores",

"Resolver conflitos",

"Ajudar a equipe"

],


requirements:[

"Experiência como suporte",

"Conhecimento das regras",

"Boa postura"

]


}


};






function openRole(role){


let data = roles[role];


document.getElementById("modalImage").src=data.image;

document.getElementById("modalTitle").innerHTML=data.name;

document.getElementById("modalLevel").innerHTML=data.level;


document.getElementById("modalDescription").innerHTML=data.description;



document.getElementById("modalResponsibilities").innerHTML=
data.responsibilities.map(x=>`
<li>✔ ${x}</li>
`).join("");



document.getElementById("modalRequirements").innerHTML=
data.requirements.map(x=>`
<li>✔ ${x}</li>
`).join("");



document.getElementById("roleModal").classList.add("active");


}




function closeRole(){

document.getElementById("roleModal").classList.remove("active");

}
