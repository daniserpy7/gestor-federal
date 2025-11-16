document.addEventListener("DOMContentLoaded", () => {

    const btnDashboard = document.getElementById("btnDashboard");
    const btnActas = document.getElementById("btnActas");
    const btnComunicados = document.getElementById("btnComunicados");
    const btnAjustes = document.getElementById("btnAjustes");

    const pageDashboard = document.getElementById("pageDashboard");
    const pageActas = document.getElementById("pageActas");
    const pageComunicados = document.getElementById("pageComunicados");
    const pageAjustes = document.getElementById("pageAjustes");

    const pages = [pageDashboard, pageActas, pageComunicados, pageAjustes];

    function mostrarPagina(pagina) {
        pages.forEach(p => p.style.display = "none");
        pagina.style.display = "block";
    }

    btnDashboard.addEventListener("click", () => mostrarPagina(pageDashboard));
    btnActas.addEventListener("click", () => mostrarPagina(pageActas));
    btnComunicados.addEventListener("click", () => mostrarPagina(pageComunicados));
    btnAjustes.addEventListener("click", () => mostrarPagina(pageAjustes));

    mostrarPagina(pageDashboard);
});
