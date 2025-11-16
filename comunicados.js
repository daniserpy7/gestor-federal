// =====================
// MÓDULO: COMUNICADOS
// =====================

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("listaComunicados")) return;

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "index.html";
    return;
  }

  const btn = document.getElementById("guardarCom");
  const titulo = document.getElementById("tituloCom");
  const texto = document.getElementById("textoCom");
  const lista = document.getElementById("listaComunicados");

  cargarComunicados();

  btn.addEventListener("click", () => {
    if (titulo.value.trim() === "" || texto.value.trim() === "") {
      alert("Completa todos los campos");
      return;
    }

    const comunicados = JSON.parse(localStorage.getItem("comunicados")) || [];

    comunicados.push({
      titulo: titulo.value,
      texto: texto.value,
      fecha: new Date().toLocaleString(),
      autor: currentUser.usuario
    });

    localStorage.setItem("comunicados", JSON.stringify(comunicados));

    titulo.value = "";
    texto.value = "";

    cargarComunicados();
  });

  function cargarComunicados() {
    const comunicados = JSON.parse(localStorage.getItem("comunicados")) || [];
    lista.innerHTML = "";

    if (comunicados.length === 0) {
      lista.innerHTML = "<p class='empty'>No hay comunicados.</p>";
      return;
    }

    comunicados
      .slice()
      .reverse()
      .forEach(c => {
        const item = document.createElement("div");
        item.className = "item";

        item.innerHTML = `
          <h4>${c.titulo}</h4>
          <p>${c.texto}</p>
          <small>Publicado por ${c.autor} el ${c.fecha}</small>
        `;

        lista.appendChild(item);
      });
  }
});
