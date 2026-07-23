/* ==========================================
   FUTURYCRAFT - LOGIN STAFF
========================================== */


*{

    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:'Montserrat',sans-serif;

}



body{


    min-height:100vh;


    display:flex;

    justify-content:center;

    align-items:center;


    background:

    linear-gradient(
        135deg,
        #080910,
        #11152b
    );


    color:white;


    overflow:hidden;


}







/* ==========================================
   FUNDO FUTURISTA
========================================== */


.background{


    position:absolute;

    width:100%;

    height:100%;


    background:


    radial-gradient(
        circle at 20% 20%,
        rgba(0,234,255,.18),
        transparent 35%
    ),


    radial-gradient(
        circle at 80% 80%,
        rgba(88,101,255,.20),
        transparent 35%
    );


    filter:blur(10px);


}








/* ==========================================
   CONTAINER
========================================== */


.login-container{


    position:relative;

    z-index:2;


    width:100%;


    display:flex;

    justify-content:center;


    padding:20px;


}








/* ==========================================
   CARD
========================================== */


.login-card{


    width:420px;


    padding:45px;


    background:


    rgba(18,18,28,.82);



    border:

    1px solid rgba(255,255,255,.08);



    border-radius:25px;



    backdrop-filter:blur(20px);



    box-shadow:


    0 25px 70px rgba(0,0,0,.55);



    animation:

    aparecer .6s ease;


}







@keyframes aparecer{


    from{


        opacity:0;

        transform:translateY(30px);


    }


    to{


        opacity:1;

        transform:translateY(0);


    }


}









/* ==========================================
   LOGO
========================================== */


.logo{


    text-align:center;

    margin-bottom:35px;


}




.logo h1{


    font-size:38px;


    font-weight:800;


    letter-spacing:4px;



    background:


    linear-gradient(
        90deg,
        #00eaff,
        #6670ff
    );


    -webkit-background-clip:text;


    color:transparent;



}




.logo span{


    display:block;


    margin-top:8px;


    font-size:13px;


    color:#999;


    letter-spacing:3px;


}









/* ==========================================
   TITULO
========================================== */


.login-title{


    text-align:center;


    margin-bottom:30px;


}




.login-title h2{


    font-size:22px;


    margin-bottom:8px;


}




.login-title p{


    color:#999;


    font-size:14px;


}









/* ==========================================
   INPUTS
========================================== */


.input-group{


    margin-bottom:20px;


}




.input-group label{


    display:block;


    margin-bottom:8px;


    font-size:14px;


    color:#cfcfcf;


}




.input-group input{


    width:100%;


    height:50px;


    padding:0 18px;


    background:#0c0d14;



    border:

    1px solid rgba(255,255,255,.1);



    border-radius:14px;



    outline:none;



    color:white;



    font-size:15px;



    transition:.3s;


}






.input-group input::placeholder{


    color:#666;


}






.input-group input:focus{


    border-color:#00eaff;


    box-shadow:


    0 0 20px rgba(0,234,255,.25);


}









/* ==========================================
   BOTÃO LOGIN
========================================== */


.btn-login{


    width:100%;


    height:52px;


    margin-top:10px;



    border:none;


    border-radius:15px;



    cursor:pointer;



    color:white;


    font-weight:700;


    font-size:15px;



    background:


    linear-gradient(
        135deg,
        #00cfff,
        #5865ff
    );



    box-shadow:


    0 10px 30px rgba(88,101,255,.35);



    transition:.3s;


}




.btn-login:hover{


    transform:translateY(-3px);



    box-shadow:


    0 15px 45px rgba(0,234,255,.45);


}







.btn-login:active{


    transform:scale(.97);


}









/* ==========================================
   MENSAGEM
========================================== */


#mensagem{


    margin-top:20px;


    text-align:center;


    font-size:14px;


    color:#ff6b6b;


}









/* ==========================================
   CADASTRO
========================================== */


.register{


    margin-top:30px;


    text-align:center;


    display:flex;


    flex-direction:column;


    gap:12px;


}



.register span{


    color:#888;


    font-size:13px;


}




.btn-register{


    border:none;


    background:none;


    color:#00eaff;


    cursor:pointer;


    font-weight:600;


    font-size:14px;


    transition:.3s;


}




.btn-register:hover{


    color:white;


}









/* ==========================================
   MOBILE
========================================== */


@media(max-width:480px){


    .login-card{


        width:100%;


        padding:35px 25px;


    }




    .logo h1{


        font-size:30px;


    }



}
