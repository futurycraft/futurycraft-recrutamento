async function carregarUsuario(){


const {data:{user}} =
await supabaseClient.auth.getUser();



if(!user){

window.location.href="login.html";

return;

}



document.getElementById("emailAtual").value =
user.email;



}



async function alterarEmail(){


const email =
document.getElementById("novoEmail").value;



if(!email){

alert("Digite um email");

return;

}




const {error}=await supabaseClient.auth.updateUser({

email:email

});



if(error){

alert(error.message);

return;

}



alert(
"Email atualizado. Verifique a confirmação enviada."
);



}






async function alterarSenha(){



const senha =
document.getElementById("novaSenha").value;



if(senha.length < 6){

alert("Senha precisa ter pelo menos 6 caracteres");

return;

}



const {error}=await supabaseClient.auth.updateUser({

password:senha

});



if(error){

alert(error.message);

return;

}



alert("Senha alterada com sucesso");



}







async function salvarNick(){



const nick =
document.getElementById("nick").value;



const {data:{user}} =
await supabaseClient.auth.getUser();




await supabaseClient

.from("usuarios_staff")

.update({

nome:nick

})

.eq("usuario_id",user.id);



alert("Nick salvo");



}







carregarUsuario();
