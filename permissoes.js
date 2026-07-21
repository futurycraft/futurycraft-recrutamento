async function pegarCargo(){


const {data:{user}} = await supabaseClient.auth.getUser();



if(!user){

return null;

}



const {data,error}=await supabaseClient

.from("cargos_staff")

.select("cargo")

.eq("usuario_id",user.id)

.maybeSingle();



if(error){

console.log(error);

return null;

}



if(!data){

console.log("Usuário sem cargo");

return null;

}



return data.cargo;



}
