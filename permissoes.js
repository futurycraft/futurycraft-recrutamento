async function pegarCargo(){

const {data:{user}} =
await supabaseClient.auth.getUser();


if(!user){
return null;
}


const {data,error}=await supabaseClient
.from("cargos_staff")
.select("cargo")
.eq("usuario_id",user.id)
.single();


if(error){

console.log(error);

return null;

}


return data.cargo;

}


const cargosAnalise = [
"fundador",
"diretor",
"gerente",
"admin"
];


const cargosExclusao = [
"fundador",
"diretor"
];


function podeAnalisar(cargo){

return cargosAnalise.includes(cargo);

}



function podeExcluir(cargo){

return cargosExclusao.includes(cargo);

}
