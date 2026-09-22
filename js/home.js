/* ==========================================================
   FUTURYCRAFT - HOME (REDESIGN)
   Reveal suave no scroll (visual apenas).
   Não altera nenhuma lógica de candidatura/envio.
   Respeita prefers-reduced-motion.
========================================================== */
(function () {
    var reduce = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !("IntersectionObserver" in window)) return;

    document.documentElement.classList.add("js-reveal");

    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

    els.forEach(function (el) {
        io.observe(el);
    });
})();