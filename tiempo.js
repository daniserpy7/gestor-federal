// =====================
// MÓDULO: CONTROL DE TIEMPO
// =====================

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("historialTiempo")) return;

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "index.html";
    return;
  }

  const actividad = document.getElementById("actividad");
  const entradaBtn = document.getElementById("entradaBtn");
  const salidaBtn = document.getElementById("salidaBtn");
  const tabla = document.getElementById("historialTiempo");

  cargarTabla();

  entradaBtn.addEventListener("click", () => registrar("Entrada"));
  salidaBtn.addEventListener("click", () => registrar("Salida"));

  function registrar(tipo) {
    if (actividad.value.trim() === "") {
      alert("Ingresa una actividad.");
      return;
    }

    const registros = JSON.parse(localStorage.getItem("tiempos")) || [];

    registros.push({
      usuario: currentUser.usuario,
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
      actividad: actividad.value,
      tipo: tipo
    });

    localStorage.setItem("tiempos", JSON.stringify(registros));

    actividad.value = "";
    cargarTabla();
  }

  function cargarTabla() {
    const registros = JSON.parse(localStorage.getItem("tiempos")) || [];
    const visibles =
      currentUser.rol === "admin" || currentUser.rol === "alto"
        ? registros
        : registros.filter(r => r.usuario === currentUser.usuario);

    tabla.innerHTML = "";

    if (visibles.length === 0) {
      tabla.innerHTML = "<tr><td colspan='4' class='empty'>No hay registros aún.</td></tr>";
      return;
    }

    visibles
      .slice()
      .reverse()
      .forEach(r => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${r.fecha}</td>
          <td>${r.hora}</td>
          <td>${r.actividad}</td>
          <td>${r.tipo}</td>
        `;
        tabla.appendChild(row);
      });
  }
});
