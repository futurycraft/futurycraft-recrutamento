/* ==========================================================
   FUTURYCRAFT - MENU SUPERIOR COMPARTILHADO
   Define a classe .ativo na página atual + menu mobile.
   Marcar a página atual no HTML com data-nav="youtuber".
========================================================== */
document.addEventListener("DOMContentLoaded", function () {

    var toggle = document.querySelector(".site-nav-toggle");

    if (toggle) {
        toggle.addEventListener("click", function () {
            var links = document.querySelector(".site-nav-links");
            if (!links) return;
            var aberto = links.classList.toggle("aberto");
            toggle.setAttribute("aria-expanded", aberto ? "true" : "false");
        });
    }

    var atual = document.body.getAttribute("data-nav");

    if (atual) {
        document.querySelectorAll(".site-nav-links a").forEach(function (a) {
            if (a.getAttribute("data-nav-item") === atual) {
                a.classList.add("ativo");
            }
        });
    }
});