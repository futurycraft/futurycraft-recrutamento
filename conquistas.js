// ==========================================
// FUTURYCRAFT - SISTEMA DE CONQUISTAS
// OTIMIZADO
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
"Erro staff:",
error
);

return;

}




staffAtual=data;




document.getElementById(
"nick-staff"
).innerHTML=data.nick;



document.getElementById(
"cargo-staff"
).innerHTML=data.cargo;






// MOSTRA IMEDIATAMENTE

await carregarConquistas(
data.nick
);




// VERIFICA EM SEGUNDO PLANO

verificarConquistasAutomaticas(
data.nick
)
.then(()=>{


carregarConquistas(
data.nick
);


});





}catch(error){


console.error(
"Erro perfil:",
error
);


}



}







// ==========================================
// CARREGAR LISTA
// ==========================================


async function buscarListaConquistas(){


if(conquistasCache)
return conquistasCache;




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

console.error(error);

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



if(!area)
return;




try{



const lista =
await buscarListaConquistas();





const {data:minhas}=

await supabaseClient

.from("conquistas_staff")

.select(
"conquista"
)

.eq(
"nick",
nick
);





area.innerHTML=`


<div class="categoria-conquistas">

<h2>🌱 Iniciante</h2>

<div id="categoria-inicio"></div>

</div>



<div class="categoria-conquistas">

<h2>🚀 Experiência</h2>

<div id="categoria-experiencia"></div>

</div>



<div class="categoria-conquistas">

<h2>🏆 Veterano</h2>

<div id="categoria-veterano"></div>

</div>



<div class="categoria-conquistas">

<h2>💎 Elite</h2>

<div id="categoria-elite"></div>

</div>


`;







lista.forEach(conquista=>{



let destino;



switch(conquista.categoria){


case "Inicio":

destino=
document.getElementById(
"categoria-inicio"
);

break;



case "Dedicacao":

destino=
document.getElementById(
"categoria-experiencia"
);

break;



case "Carreira":

destino=
document.getElementById(
"categoria-veterano"
);

break;



default:

destino=
document.getElementById(
"categoria-elite"
);


}





if(!destino)
return;





const possui =

minhas?.some(

item=>

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
possui ?
"desbloqueada":
"bloqueada"
}">

${
possui ?
"✅ Desbloqueada":
"🔒 Bloqueada"
}

</div>



</div>


`;



});




}catch(error){


console.error(
"Erro conquistas:",
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




// Busca tempo online


const {data:tempo,error}=

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





if(error){

console.error(
"Erro tempo:",
error
);

}






let horas = 0;



if(tempo){

horas =
Number(
tempo.tempo_online
) / 3600;

}




console.log(
"Horas online:",
horas
);







// ==========================================
// CONQUISTAS DE HORAS
// ==========================================



const conquistasHoras = [


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







for(
const conquista of conquistasHoras
){


if(
horas >= conquista.limite
){


await liberarConquista(
nick,
conquista
);


}


}









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
// FUTURO:
// AQUI VAMOS COLOCAR
// DIAS NA EQUIPE
// ==========================================





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



const {data:existe}=

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






if(existe){

return;

}







const {error}=

await supabaseClient

.from("conquistas_staff")

.insert({

nick:nick,

conquista:conquista.nome,

descricao:conquista.descricao,

icone:conquista.icone,

data_conquista:
new Date()

});








if(error){


console.error(

"Erro liberar conquista:",

error

);


}
else{


console.log(

"Conquista desbloqueada:",

conquista.nome

);


}




}catch(error){


console.error(

"Erro liberar:",
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
