// ==========================================
// FUTURYCRAFT - CONQUISTAS STAFF
// ==========================================


async function carregarPerfil(){


const {data:user}=
await supabaseClient.auth.getUser();



if(!user.user){

window.location.href="login.html";

return;

}



const email =
user.user.email;




const {data}=
await supabaseClient

.from("usuarios_staff")

.select("*")

.eq(
"email",
email
)

.maybeSingle();



if(!data)
return;



document.getElementById(
"nick-staff"
).innerHTML =
data.nick;



document.getElementById(
"cargo-staff"
).innerHTML =
data.cargo;



}





document.addEventListener(
"DOMContentLoaded",
()=>{


carregarPerfil();


});
