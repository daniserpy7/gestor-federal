// app-modules.js
console.log("Módulos cargados correctamente ✅");

const content = document.getElementById("content");
const links = document.querySelectorAll("[data-section]");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
console.log("Usuario actual:", currentUser);

// Manejo de navegación
links.forEach(link => {
  link.addEventListener("click", () => {
    const section = link.getAttribute("data-section");
    loadSection(section);
  });
});

function loadSection(section) {
  switch (section) {
    case "panel":
      content.innerHTML = `<h2 class="text-2xl font-bold mb-4">Panel Principal</h2>
      <p>Bienvenido ${currentUser.username}, rol: ${currentUser.role}</p>`;
      break;
    case "actas":
      renderActas();
      break;
    case "comunicados":
      renderComunicados();
      break;
    case "control":
      renderControlTiempo();
      break;
    case "usuarios":
      if (currentUser.role !== "admin") {
        content.innerHTML = `<p class="text-red-500 font-semibold">Acceso restringido solo a administradores.</p>`;
      } else {
        renderUsuarios();
      }
      break;
    default:
      content.innerHTML = `<p>Selecciona una sección del menú.</p>`;
  }
}

// ---------- Módulo ACTAS ----------
function renderActas() {
  content.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">Actas</h2>
    <div class="space-y-3">
      <input id="actaTitulo" class="border p-2 rounded w-full" placeholder="Título del acta">
      <textarea id="actaTexto" class="border p-2 rounded w-full" rows="4" placeholder="Descripción del acta"></textarea>
      <button id="guardarActa" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Guardar Acta</button>
    </div>
    <div id="listaActas" class="mt-6"></div>
  `;

  const btn = document.getElementById("guardarActa");
  const lista = document.getElementById("listaActas");

  btn.addEventListener("click", () => {
    const titulo = document.getElementById("actaTitulo").value;
    const texto = document.getElementById("actaTexto").value;

    if (!titulo || !texto) return alert("Completa todos los campos.");

    const actas = JSON.parse(localStorage.getItem("actas") || "[]");
    actas.push({ titulo, texto, autor: currentUser.username, fecha: new Date().toLocaleString() });
    localStorage.setItem("actas", JSON.stringify(actas));

    renderActas();
  });

  const actasGuardadas = JSON.parse(localStorage.getItem("actas") || "[]");
  lista.innerHTML = actasGuardadas.map(a => `
    <div class="bg-white shadow p-3 rounded mb-2">
      <h3 class="font-semibold">${a.titulo}</h3>
      <p>${a.texto}</p>
      <span class="text-sm text-gray-500">${a.autor} - ${a.fecha}</span>
    </div>
  `).join("");
}

// ---------- Módulo COMUNICADOS ----------
function renderComunicados() {
  content.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">Comunicados</h2>
    <div class="space-y-3">
      <input id="comTitulo" class="border p-2 rounded w-full" placeholder="Título del comunicado">
      <textarea id="comTexto" class="border p-2 rounded w-full" rows="4" placeholder="Contenido del comunicado"></textarea>
      <button id="guardarComunicado" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Publicar</button>
    </div>
    <div id="listaComunicados" class="mt-6"></div>
  `;

  const btn = document.getElementById("guardarComunicado");
  const lista = document.getElementById("listaComunicados");

  btn.addEventListener("click", () => {
    const titulo = document.getElementById("comTitulo").value;
    const texto = document.getElementById("comTexto").value;

    if (!titulo || !texto) return alert("Completa todos los campos.");

    const comunicados = JSON.parse(localStorage.getItem("comunicados") || "[]");
    comunicados.push({ titulo, texto, autor: currentUser.username, fecha: new Date().toLocaleString() });
    localStorage.setItem("comunicados", JSON.stringify(comunicados));

    renderComunicados();
  });

  const comunicadosGuardados = JSON.parse(localStorage.getItem("comunicados") || "[]");
  lista.innerHTML = comunicadosGuardados.map(c => `
    <div class="bg-white shadow p-3 rounded mb-2">
      <h3 class="font-semibold">${c.titulo}</h3>
      <p>${c.texto}</p>
      <span class="text-sm text-gray-500">${c.autor} - ${c.fecha}</span>
    </div>
  `).join("");
