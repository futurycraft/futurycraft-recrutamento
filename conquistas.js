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





        // CARREGAR CONQUISTAS NA TELA

        await carregarConquistas(
            data.nick
        );





        // VERIFICAR SE GANHOU NOVAS CONQUISTAS

        await verificarConquistasAutomaticas(
            data.nick
        );





        // ATUALIZA A LISTA NOVAMENTE
        // PARA MOSTRAR AS NOVAS CONQUISTAS

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
1
);






// 50 HORAS

if(horas >= 50){

await liberarConquista(
nick,
2
);

}





// 100 HORAS

if(horas >= 100){

await liberarConquista(
nick,
3
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
conquista_id
){



const {data:existe}=

await supabaseClient

.from("conquistas_staff")

.select("*")

.eq(
"nick",
nick
)

.eq(
"conquista_id",
conquista_id
)

.maybeSingle();





if(existe)
return;







const {error}=

await supabaseClient

.from("conquistas_staff")

.insert({

nick:nick,

conquista_id:conquista_id

});





if(error){

console.error(
"Erro liberar conquista:",
error
);

}
else{

console.log(
"Conquista liberada:",
conquista_id
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
