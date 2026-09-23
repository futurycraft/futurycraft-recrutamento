/* ==========================================================
   FUTURYCRAFT - CAMADA FUTURISTA DO PORTAL
   Complementa portal-futurista.css. Somente apresentação:
   entrada do hero, stagger de reveal, parallax leve no hero,
   glow de cursor nos cards, navbar e barra de progresso.
   Respeita prefers-reduced-motion e dispositivos de toque.
========================================================== */
(function () {
    var reduce = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) return;

    var fine = window.matchMedia &&
        window.matchMedia("(pointer: fine)").matches;
    var wide = window.innerWidth >= 980;

    var doc = document.documentElement;

    /* ---------- ENTRADA DO HERO ---------- */
    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            doc.classList.add("fc-enter");
        });
    });

    /* ---------- STAGGER DE REVEAL (por item) ---------- */
    window.addEventListener("DOMContentLoaded", stagger);
    if (document.readyState !== "loading") stagger();

    function stagger() {
        var groups = [
            ".roles-grid",
            ".values-grid",
            ".reasons-grid",
            ".prog-grid",
            ".steps-timeline"
        ];

        groups.forEach(function (sel) {
            document.querySelectorAll(sel).forEach(function (wrap) {
                if (wrap.classList.contains("reveal")) return;

                var idx = 1;
                Array.prototype.forEach.call(wrap.children, function (child) {
                    if (!child.classList.contains("reveal")) return;

                    child.style.setProperty("--fc-i", String(idx));
                    idx++;

                    /* limpa o delay após a entrada para liberar os hovers */
                    child.addEventListener("transitionend", function clean(e) {
                        if (e.target !== child) return;
                        child.removeEventListener("transitionend", clean);
                        child.style.removeProperty("--fc-i");
                    });
                });
            });
        });
    }

    /* ---------- PARALLAX LEVE NO HERO (mouse, somente desktop) ---------- */
    if (fine && wide) {
        var hero = document.querySelector(".hero-staff, .creators-hero");
        if (hero) {
            doc.classList.add("fc-parallax");
            var glow = hero.querySelector(".hero-glow");
            var grid = hero.querySelector(".hero-grid");
            var inner = hero.querySelector(".hero-staff-inner, .creators-hero");
            var raf = null;

            hero.addEventListener("pointermove", function (e) {
                if (raf) return;
                raf = requestAnimationFrame(function () {
                    raf = null;
                    var x = (e.clientX / window.innerWidth - 0.5);
                    var y = (e.clientY / window.innerHeight - 0.5);
                    if (glow) glow.style.transform = "translate3d(" + (x * -18) + "px," + (y * -12) + "px,0)";
                    if (grid) grid.style.transform = "translate3d(" + (x * 12) + "px," + (y * 8) + "px,0)";
                    if (inner && inner !== hero) inner.style.transform = "translate3d(" + (x * 6) + "px," + (y * 4) + "px,0)";
                });
            });

            hero.addEventListener("pointerleave", function () {
                if (glow) glow.style.transform = "translate3d(0,0,0)";
                if (grid) grid.style.transform = "translate3d(0,0,0)";
                if (inner && inner !== hero) inner.style.transform = "translate3d(0,0,0)";
            });
        }
    }

    /* ---------- GLOW DE CURSOR NOS CARDS ---------- */
    if (fine) {
        var glowTargets = document.querySelectorAll(".role-tile, .value-panel, .reason-card, .prog-card");
        glowTargets.forEach(function (card) {
            card.addEventListener("pointermove", function (e) {
                var r = card.getBoundingClientRect();
                card.style.setProperty("--fc-mx", ((e.clientX - r.left) / r.width * 100).toFixed(2) + "%");
                card.style.setProperty("--fc-my", ((e.clientY - r.top) / r.height * 100).toFixed(2) + "%");
            });
        });
    }

    /* ---------- NAVBAR + BARRA DE PROGRESSO ---------- */
    var nav = document.querySelector(".site-nav");
    var bar = document.createElement("div");
    bar.className = "fc-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);

    var ticking = false;

    function onScroll() {
        ticking = false;
        var y = window.scrollY || document.documentElement.scrollTop || 0;
        var h = document.documentElement.scrollHeight - window.innerHeight;

        if (nav) nav.classList.toggle("fc-scrolled", y > 30);

        bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }

    window.addEventListener("scroll", function () {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(onScroll);
        }
    }, { passive: true });

    onScroll();
})();