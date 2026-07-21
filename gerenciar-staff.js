async function iniciarPagina(){


const cargo = await pegarCargo();



if(
cargo !== "fundador" &&
cargo !== "diretor"
){


alert("Você não possui permissão");


window.location.href="admin.html";


return;


}



carregarStaff();


}





async function carregarStaff(){


const {data,error}=await supabaseClient
.from("cargos_staff")
.select("*");



if(error){

console.log(error);

return;

}



let html="";



data.forEach(staff=>{


html += `

<div class="staff-card">


<p>
<b>Cargo:</b> ${staff.cargo}
</p>


<p>
ID:
${staff.usuario_id}
</p>



<button onclick="removerStaff('${staff.id}')">

Remover

</button>



</div>


`;


});



document.getElementById("listaStaff")
.innerHTML=html;


}







async function adicionarStaff(){



let email =
document.getElementById("emailStaff").value;



let cargo =
document.getElementById("cargoStaff").value;



if(!email){

alert("Digite um email");

return;

}





const {data:user,error}=await supabaseClient
.auth.admin
.getUserByEmail(email);



if(error){

alert("Usuário não encontrado");

return;

}





await supabaseClient
.from("cargos_staff")
.insert({

usuario_id:user.user.id,

cargo:cargo

});



alert("Staff adicionado");


carregarStaff();


}








async function removerStaff(id){


if(!confirm("Remover este membro?")){

return;

}



await supabaseClient
.from("cargos_staff")
.delete()
.eq("id",id);



alert("Removido");


carregarStaff();


}






iniciarPagina();
