// ==========================================
// FUTURYCRAFT - SISTEMA DE CONQUISTAS
// VERSÃO ORGANIZADA
// ==========================================


let staffAtual = null;

let conquistasCache = null;



// ==========================================
// CARREGAR PERFIL
// ==========================================


async function carregarPerfil(){


try{


const {data:user} =

await supabaseClient.auth.getUser();



if(!user.user){


window.location.href="login.html";

return;


}




const email =

user.user.email;





const {data,error}=

await supabaseClient

.from("usuarios_staff")

.select(
"nick,cargo"
)

.eq(
"email",
email
)

.maybeSingle();






if(error || !data){


console.error(
"Erro buscando staff:",
error
);


return;


}






staffAtual = data;





document.getElementById(
"nick-staff"
).innerHTML =

data.nick;





document.getElementById(
"cargo-staff"
).innerHTML =

data.cargo;







console.log(
"Staff carregado:",
data.nick
);






// LIBERA NOVAS CONQUISTAS

await verificarConquistasAutomaticas(
data.nick
);






// MOSTRA NA TELA

await carregarConquistas(
data.nick
);





}catch(error){


console.error(
"Erro carregar perfil:",
error
);


}


}


// ==========================================
// BUSCAR LISTA DE CONQUISTAS
// ==========================================


async function buscarListaConquistas(){


if(conquistasCache){

return conquistasCache;

}




const {data,error}=

await supabaseClient

.from("conquistas_lista")

.select(
"id,nome,descricao,icone,categoria,ordem"
)

.order(
"ordem",
{
ascending:true
}
);





if(error){


console.error(
"Erro lista conquistas:",
error
);


return [];

}





conquistasCache=data;


return data;


}






// ==========================================
// MOSTRAR CONQUISTAS
// ==========================================


async function carregarConquistas(nick){


const area =

document.getElementById(
"lista-conquistas"
);




if(!area){

return;

}






try{



const lista =

await buscarListaConquistas();





const {data:minhas,error}=

await supabaseClient

.from("conquistas_staff")

.select(
"conquista"
)

.eq(
"nick",
nick
);





if(error){

console.error(error);

}







// ===============================
// CONTADOR
// ===============================


const total = lista.length;


const desbloqueadas =

minhas ? minhas.length : 0;




const porcentagem =

total > 0

?

Math.floor(
(desbloqueadas / total) * 100
)

:

0;






const contador =

document.getElementById(
"contador-conquistas"
);



const texto =

document.getElementById(
"texto-conquistas"
);



const barra =

document.getElementById(
"progresso-barra"
);





if(contador){

contador.innerHTML =
porcentagem+"%";

}



if(texto){

texto.innerHTML =

desbloqueadas+
" / "+
total+
" conquistas";

}



if(barra){

barra.style.width =
porcentagem+"%";

}






// ===============================
// LIMPAR TELA
// ===============================


area.innerHTML="";






const categorias={


Inicio:"🌱 Iniciante",

Dedicacao:"🚀 Experiência",

Carreira:"🏆 Veterano",

Elite:"💎 Elite"


};







Object.entries(categorias)

.forEach(([id,nome])=>{



area.innerHTML += `


<div class="categoria-conquistas">


<h2>

${nome}

</h2>



<div id="${id}"></div>


</div>


`;



});









// ===============================
// CRIAR CARDS
// ===============================


lista.forEach(conquista=>{


const destino =

document.getElementById(
conquista.categoria
);





if(!destino){

return;

}






const possui =

minhas?.some(

(item)=>

item.conquista === conquista.nome

);






destino.innerHTML += `


<div class="achievement-card">



<h3>

${conquista.icone}

${conquista.nome}

</h3>




<p>

${conquista.descricao}

</p>





<div class="${
possui
?
"desbloqueada"
:
"bloqueada"
}">


${
possui
?
"✅ Desbloqueada"
:
"🔒 Bloqueada"
}


</div>



</div>


`;





});





}catch(error){


console.error(
"Erro mostrar conquistas:",
error
);


}



}


// ==========================================
// VERIFICAR CONQUISTAS AUTOMÁTICAS
// ==========================================


async function verificarConquistasAutomaticas(nick){


try{


console.log(
"Verificando conquistas:",
nick
);






// ==========================================
// TEMPO ONLINE
// ==========================================


const {data:tempo}=

await supabaseClient

.from("skyblock_tempo")

.select(
"tempo_online"
)

.eq(
"nick",
nick
)

.maybeSingle();





let horas = 0;



if(tempo){


horas =

Number(
tempo.tempo_online
)

/

3600;


}






console.log(
"Horas:",
horas
);









// ==========================================
// PRIMEIRA CONQUISTA
// ==========================================


await liberarConquista(

nick,

{

nome:"Primeiros Passos",

descricao:"Entrou para a equipe Staff FuturyCraft",

icone:"🌱"

}

);








// ==========================================
// CONQUISTAS POR HORAS
// ==========================================


const conquistasHoras=[


{
limite:25,
nome:"Presença Constante",
descricao:"Alcançou 25 horas online no servidor",
icone:"⏱"
},


{
limite:50,
nome:"Dedicação",
descricao:"Alcançou 50 horas online no servidor",
icone:"🔥"
},


{
limite:100,
nome:"Guardião do Servidor",
descricao:"Alcançou 100 horas online no servidor",
icone:"🛡️"
},


{
limite:250,
nome:"Presença Marcante",
descricao:"Alcançou 250 horas online",
icone:"🌌"
},


{
limite:500,
nome:"Mestre da Comunidade",
descricao:"Alcançou 500 horas online",
icone:"🌟"
}



];






for(const conquista of conquistasHoras){



if(horas >= conquista.limite){



await liberarConquista(

nick,

conquista

);



}



}









// ==========================================
// TEMPO NA STAFF
// ==========================================



const {data:staff}=

await supabaseClient

.from("usuarios_staff")

.select(
"data_entrada"
)

.eq(
"nick",
nick
)

.maybeSingle();






let dias = 0;





if(staff?.data_entrada){


const entrada =

new Date(
staff.data_entrada
);



const hoje =

new Date();




dias =

Math.floor(

(

hoje - entrada

)

/

(1000*60*60*24)

);



}







console.log(
"Dias staff:",
dias
);









const conquistasTempo=[


{
dias:1,
nome:"Primeiro Dia de Staff",
descricao:"Completou 1 dia como membro da equipe Staff",
icone:"📅"
},


{
dias:7,
nome:"Primeira Semana",
descricao:"Permaneceu 7 dias na equipe Staff",
icone:"⭐"
},


{
dias:15,
nome:"Duas Semanas de Staff",
descricao:"Completou 15 dias na equipe Staff FuturyCraft",
icone:"📅"
},


{
dias:30,
nome:"Primeiro Mês",
descricao:"Completou 1 mês na equipe Staff FuturyCraft",
icone:"📅"
},


{
dias:90,
nome:"Veterano da Equipe",
descricao:"Completou 3 meses na equipe Staff",
icone:"🏆"
},


{
dias:180,
nome:"Lenda FuturyCraft",
descricao:"Completou 6 meses na equipe Staff",
icone:"👑"
},


{
dias:365,
nome:"Elite FuturyCraft",
descricao:"Completou 1 ano na equipe",
icone:"💎"
},


{
dias:730,
nome:"Veterano Galáctico",
descricao:"Completou 2 anos na equipe",
icone:"🌠"
}


];






for(const conquista of conquistasTempo){



if(dias >= conquista.dias){



await liberarConquista(

nick,

{

nome:conquista.nome,

descricao:conquista.descricao,

icone:conquista.icone

}

);



}



}





}catch(error){


console.error(

"Erro verificar conquistas:",

error

);


}



}

// ==========================================
// LIBERAR CONQUISTA
// ==========================================


async function liberarConquista(
nick,
conquista
){


try{



const {data:existe,error:erroBusca}=

await supabaseClient

.from("conquistas_staff")

.select(
"id"
)

.eq(
"nick",
nick
)

.eq(
"conquista",
conquista.nome
)

.maybeSingle();






if(erroBusca){

console.error(
"Erro verificar conquista:",
erroBusca
);

}





// JÁ POSSUI

if(existe){

return;

}







const {error}=

await supabaseClient

.from("conquistas_staff")

.insert({


nick:nick,


conquista:
conquista.nome,


descricao:
conquista.descricao,


icone:
conquista.icone,


data_conquista:
new Date()


});







if(error){


console.error(

"Erro salvar conquista:",

error

);


}
else{


console.log(

"🏆 Conquista desbloqueada:",

conquista.nome

);


}




}catch(error){


console.error(

"Erro liberar conquista:",

error

);


}



}







// ==========================================
// INICIAR
// ==========================================


document.addEventListener(
"DOMContentLoaded",
async ()=>{


await carregarPerfil();


});
