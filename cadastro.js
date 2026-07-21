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




if(
!nick ||
!email ||
!senha
){

alert("Preencha todos os campos");

return;

}





// Criar usuário no Supabase Auth

const {data,error}=await supabaseClient.auth.signUp({

email:email,

password:senha

});




if(error){

alert(error.message);

return;

}





const usuario = data.user;




// Salvar dados do staff

const {error:erroStaff}=await supabaseClient

.from("usuarios_staff")

.insert({

usuario_id:usuario.id,

email:email,

nick:nick,

nome:nome,

data_nascimento:nascimento

});





if(erroStaff){

console.log(erroStaff);

alert("Erro ao salvar dados");

return;

}



alert(
"Cadastro realizado! Aguarde aprovação."
);



window.location.href="login.html";


}
