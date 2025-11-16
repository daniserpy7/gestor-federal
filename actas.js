// =====================
// MÓDULO: ACTAS
// =====================

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("listaActas")) return;

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "index.html";
    return;
  }

  const btn = document.getElementById("guardarActa");
  const titulo = document.getElementById("tituloActa");
  const texto = document.getElementById("textoActa");
  const lista = document.getElementById("listaActas");

  cargarActas();

  btn.addEventListener("click", () => {
    if (titulo.value.trim() === "" || texto.value.trim() === "") {
      alert("Completa todos los campos");
      return;
    }

    const actas = JSON.parse(localStorage.getItem("actas")) || [];

    actas.push({
      titulo: titulo.value,
      texto: texto.value,
      fecha: new Date().toLocaleString(),
      autor: currentUser.usuario
    });

    localStorage.setItem("actas", JSON.stringify(actas));

    titulo.value = "";
    texto.value = "";

    cargarActas();
  });

  function cargarActas() {
    const actas = JSON.parse(localStorage.getItem("actas")) || [];
    lista.innerHTML = "";

    if (actas.length === 0) {
      lista.innerHTML = "<p class='empty'>No hay actas registradas.</p>";
      return;
    }

    actas
      .slice()
      .reverse()
      .forEach(a => {
        const item = document.createElement("div");
        item.className = "item";

        item.innerHTML = `
          <h4>${a.titulo}</h4>
          <p>${a.texto}</p>
          <small>Registrado por ${a.autor} el ${a.fecha}</small>
        `;

        lista.appendChild(item);
      });
  }
});
