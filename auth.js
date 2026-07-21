const SUPABASE_URL = "https://jssscxlnzytmwzbabvhu.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzc3NjeGxuenl0bXd6YmFidmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NzE2NzcsImV4cCI6MjEwMDA0NzY3N30.Ku_HJdFQYyEmLmjkynye90l0bpM0MbbFVJPZDMCEOXQ";


window.supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


async function pegarCargo(){

    const { data: { user } } = await supabaseClient.auth.getUser();


    if(!user){

        return null;

    }


    const { data, error } = await supabaseClient

        .from("usuarios_staff")

        .select("cargo")

        .eq("email", user.email)

        .single();



    if(error){

        console.log("Erro ao buscar cargo:", error);

        return null;

    }


    return data.cargo;

}
