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
<b>Email:</b>
${staff.email ?? "Sem email"}
</p>



<p>
<b>Cargo:</b>
${staff.cargo}
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



const email =
document.getElementById("emailStaff").value;



const cargo =
document.getElementById("cargoStaff").value;



if(!email){


alert("Digite um email");


return;


}






/*
=================================
BUSCAR USUARIO CADASTRADO
=================================
*/


const {data:user,error}=await supabaseClient

.from("usuarios_staff")

.select("*")

.eq("email",email)

.single();





if(error || !user){


alert(
"Este usuário ainda não entrou no painel"
);


return;


}






/*
=================================
CRIAR CARGO
=================================
*/


const {error:erroCargo}=await supabaseClient

.from("cargos_staff")

.insert({


usuario_id:user.usuario_id,


email:user.email,


cargo:cargo


});




if(erroCargo){


console.log(erroCargo);


alert("Erro ao adicionar cargo");


return;


}




alert("Staff adicionado com sucesso");



carregarStaff();



}









async function removerStaff(id){



const cargoAtual = await pegarCargo();



if(cargoAtual !== "fundador"){


alert(
"Somente o Fundador pode remover cargos"
);


return;


}






if(!confirm("Remover este membro?")){


return;


}





const {error}=await supabaseClient

.from("cargos_staff")

.delete()

.eq("id",id);





if(error){


console.log(error);


alert("Erro ao remover");


return;


}




alert("Membro removido");



carregarStaff();



}







iniciarPagina();
