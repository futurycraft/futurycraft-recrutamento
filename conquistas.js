// ==========================================
// FUTURYCRAFT - SISTEMA DE CONQUISTAS
// ==========================================


let staffAtual = null;


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




        const {data,error} =
        await supabaseClient

        .from("usuarios_staff")

        .select("*")

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
            "Carregando conquistas de:",
            data.nick
        );





        // PRIMEIRO VERIFICA CONQUISTAS NOVAS

        await verificarConquistasAutomaticas(
            data.nick
        );





        // DEPOIS MOSTRA NA TELA

        await carregarConquistas(
            data.nick
        );



    }
    catch(error){


        console.error(
            "Erro carregar perfil:",
            error
        );


    }


}



// ==========================================
// CARREGAR CONQUISTAS
// ==========================================


async function carregarConquistas(nick){


const area =
document.getElementById(
"lista-conquistas"
);



if(!area)
return;



try{


const {data:lista,error:erroLista}=

await supabaseClient

.from("conquistas_lista")

.select("*")

.order(
"ordem",
{
ascending:true
}
);





if(erroLista){

console.error(
erroLista
);

return;

}






const {data:minhas,error:erroMinhas}=

await supabaseClient

.from("conquistas_staff")

.select("*")

.eq(
"nick",
nick
);





if(erroMinhas){

console.error(
erroMinhas
);

}






// CRIA AS CATEGORIAS

area.innerHTML = `


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



// ORDENAR CONQUISTAS POR CARREIRA

const ordemCategorias = {

"Inicio":1,

"Dedicacao":2,

"Carreira":3,

"Elite":4

};


lista.sort((a,b)=>{


return (

ordemCategorias[a.categoria] -
ordemCategorias[b.categoria]

);


});



lista.forEach(conquista=>{



let destino;





// DEFINE A CATEGORIA

if(conquista.categoria === "Inicio"){


destino =
document.getElementById(
"categoria-inicio"
);


}


else if(conquista.categoria === "Dedicacao"){


destino =
document.getElementById(
"categoria-experiencia"
);


}


else if(conquista.categoria === "Carreira"){


destino =
document.getElementById(
"categoria-veterano"
);


}


else{


destino =
document.getElementById(
"categoria-elite"
);


}





if(!destino)
return;







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




${
possui

?

`

<div class="desbloqueada">

✅ Desbloqueada

</div>

`

:

`

<div class="bloqueada">

🔒 Bloqueada

</div>

`

}



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

const {data:tempo}=

await supabaseClient

.from("skyblock_tempo")

.select("tempo_online")

.eq(
"nick",
nick
)

.maybeSingle();




let horas = 0;



if(tempo){

horas =
Number(tempo.tempo_online) / 3600;

}



console.log(
"Horas online:",
horas
);






// ==========================================
// INICIO
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
// EXPERIÊNCIA
// ==========================================


// 25 HORAS

if(horas >= 25){

await liberarConquista(
nick,
{
nome:"Presença Constante",
descricao:"Alcançou 25 horas online no servidor",
icone:"⏱"
}
);

}




// 50 HORAS

if(horas >= 50){

await liberarConquista(
nick,
{
nome:"Dedicação",
descricao:"Alcançou 50 horas online no servidor",
icone:"🔥"
}
);

}





// 100 HORAS

if(horas >= 100){

await liberarConquista(
nick,
{
nome:"Guardião do Servidor",
descricao:"Alcançou 100 horas online no servidor",
icone:"🛡️"
}
);

}





// ==========================================
// VETERANO
// ==========================================


// 250 HORAS

if(horas >= 250){

await liberarConquista(
nick,
{
nome:"Presença Marcante",
descricao:"Alcançou 250 horas online no servidor",
icone:"🌌"
}
);

}





// 500 HORAS

if(horas >= 500){

await liberarConquista(
nick,
{
nome:"Mestre da Comunidade",
descricao:"Alcançou 500 horas online no servidor",
icone:"🌟"
}
);

}





}catch(error){


console.error(
"Erro conquistas automáticas:",
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


    // verifica se já possui

    const {data:existe}=

    await supabaseClient

    .from("conquistas_staff")

    .select("*")

    .eq(
        "nick",
        nick
    )

    .eq(
        "conquista",
        conquista.nome
    )

    .maybeSingle();




    if(existe)
        return;





    const {error}=

    await supabaseClient

    .from("conquistas_staff")

    .insert({

        nick:nick,

        conquista:conquista.nome,

        descricao:conquista.descricao,

        icone:conquista.icone

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


}



// ==========================================
// INICIAR
// ==========================================


document.addEventListener(
"DOMContentLoaded",
async ()=>{


await carregarPerfil();


});
