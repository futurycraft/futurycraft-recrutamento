const SUPABASE_URL = "https://jssscxlnzytmwzbabvhu.supabase.co";

const SUPABASE_KEY = "SUA_KEY_AQUI";


const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);



async function verificarAcesso(){


    const { data } = await supabaseClient.auth.getSession();


    if(!data.session){

        window.location.href = "login.html";

        return;

    }


}


verificarAcesso();
