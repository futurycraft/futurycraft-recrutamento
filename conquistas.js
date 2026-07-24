// ==========================================
// FUTURYCRAFT - SISTEMA DE CONQUISTAS
// ==========================================


let staffAtual = null;


// ==========================================
// CARREGAR PERFIL
// ==========================================

async function carregarPerfil(){


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

        console.error(error);

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




    await carregarConquistas(
        data.nick
    );

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
// INICIAR
// ==========================================


document.addEventListener(
"DOMContentLoaded",
()=>{


carregarPerfil();


});
