async function cadastrarStaff(){


const nick =
document.getElementById("nick").value;


const nome =
document.getElementById("nome").value;


const email =
document.getElementById("email").value;


const nascimento =
document.getElementById("nascimento").value;


const senha =
document.getElementById("senha").value;



if(!nick || !email || !senha){

alert("Preencha todos os campos");

return;

}




const {data,error}=await window.supabaseClient.auth.signUp({

email:email,

password:senha

});




if(error){

alert(error.message);

return;

}




const usuario = data.user;



const {error:erroBanco}=await supabaseClient

.from("usuarios_staff")

.insert({

usuario_id:usuario.id,

email:email,

nick:nick,

nome:nome,

data_nascimento:nascimento

});




if(erroBanco){

console.log(erroBanco);

alert("Conta criada, mas erro ao salvar informações");

return;

}




alert("Cadastro realizado com sucesso!");

window.location.href="login.html";


}
