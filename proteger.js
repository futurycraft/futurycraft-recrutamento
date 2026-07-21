supabaseClient.auth.getSession().then(({data})=>{

    if(!data.session){

        window.location.href="login.html";

    }

});
