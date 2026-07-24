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
"id",
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






area.innerHTML="";





lista.forEach(conquista=>{



const possui =

minhas?.some(

(item)=>

item.conquista_id === conquista.id

);





area.innerHTML += `


<div class="achievement-card">


<h3>

${conquista.icone}

${conquista.nome}

</h3>




<p>

${conquista.descricao}

</p>




${possui ?


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


// Busca perfil

const {data:staff}=

await supabaseClient

.from("usuarios_staff")

.select("*")

.eq(
"nick",
nick
)

.maybeSingle();



if(!staff)
return;






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






// PRIMEIROS PASSOS

await liberarConquista(
nick,
{
nome:"Primeiros Passos",
descricao:"Entrou para a equipe Staff FuturyCraft",
icone:"🌱"
}
);






// 50 HORAS

if(horas >= 50){

await liberarConquista(
nick,
{
nome:"50 Horas Online",
descricao:"Alcançou 50 horas jogadas no servidor",
icone:"⏱"
}
);

}





// 100 HORAS

if(horas >= 100){

await liberarConquista(
nick,
{
nome:"100 Horas Online",
descricao:"Alcançou 100 horas jogadas no servidor",
icone:"⭐"
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
()=>{


carregarPerfil();


});
