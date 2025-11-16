// app-modules.js
console.log("Módulos cargados correctamente ✅");

// Obtener elementos base
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

// Controlador de secciones
function loadSection(section) {
  switch (section) {
    case "panel":
      content.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Panel Principal</h2>
        <p>Bienvenido <b>${currentUser.username}</b></p>
        <p>Rol: <b>${currentUser.role.toUpperCase()}</b></p>
      `;
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
        content.innerHTML = `<p class="text-red-600 font-bold">Acceso denegado</p>`;
      } else {
        renderUsuarios();
      }
      break;

    default:
      content.innerHTML = `<p>Selecciona una sección del menú.</p>`;
  }
}

//
// ======================
//  MÓDULO ACTAS
// ======================
//
function renderActas() {
  content.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">Actas</h2>

    <div class="space-y-3">
      <input id="actaTitulo" class="border p-2 rounded w-full" placeholder="Título del acta">
      <textarea id="actaTexto" class="border p-2 rounded w-full" rows="4" placeholder="Descripción del acta"></textarea>
      <button id="guardarActa" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Guardar Acta
      </button>
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
    actas.push({
      titulo,
      texto,
      autor: currentUser.username,
      fecha: new Date().toLocaleString()
    });

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

//
// ======================
//  MÓDULO COMUNICADOS
// ======================
//
function renderComunicados() {
  content.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">Comunicados</h2>

    <div class="space-y-3">
      <input id="comTitulo" class="border p-2 rounded w-full" placeholder="Título del comunicado">
      <textarea id="comTexto" class="border p-2 rounded w-full" rows="4" placeholder="Contenido del comunicado"></textarea>
      <button id="guardarComunicado" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Publicar
      </button>
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
    comunicados.push({
      titulo,
      texto,
      autor: currentUser.username,
      fecha: new Date().toLocaleString()
    });

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
}

//
// ======================
//  MÓDULO CONTROL DE TIEMPO
// ======================
//
function renderControlTiempo() {
  content.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">Control de Tiempo</h2>

    <div class="space-y-3">
      <input id="actividad" class="border p-2 rounded w-full" placeholder="Actividad">
      <button id="entradaBtn" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Entrada</button>
      <button id="salidaBtn" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Salida</button>
    </div>

    <div id="listaTiempos" class="mt-6"></div>
  `;

  const lista = document.getElementById("listaTiempos");

  function refrescar() {
    const tiempos = JSON.parse(localStorage.getItem("tiempos") || "[]");

    lista.innerHTML = tiempos.map(t => `
      <div class="bg-white shadow p-3 rounded mb-2">
        <b>${t.tipo}</b> - ${t.actividad}<br>
        <span class="text-sm text-gray-500">${t.fecha} | ${t.hora}</span>
      </div>
    `).join("");
  }

  refrescar();

  document.getElementById("entradaBtn").addEventListener("click", () => registrar("Entrada"));
  document.getElementById("salidaBtn").addEventListener("click", () => registrar("Salida"));

  function registrar(tipo) {
    const actividad = document.getElementById("actividad").value.trim();
    if (!actividad) return alert("Ingresa una actividad.");

    const ahora = new Date();
    const tiempos = JSON.parse(localStorage.getItem("tiempos") || "[]");

    tiempos.push({
      actividad,
      tipo,
      fecha: ahora.toLocaleDateString(),
      hora: ahora.toLocaleTimeString()
    });

    localStorage.setItem("tiempos", JSON.stringify(tiempos));
    refrescar();
  }
}

//
// ======================
//  MÓDULO USUARIOS (ADMIN)
// ======================
//
function renderUsuarios() {
  content.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">Usuarios</h2>

    <div class="space-y-3 bg-white p-4 shadow rounded">
      <input id="nuevoUser" class="border p-2 rounded w-full" placeholder="Nuevo usuario">
      <input id="nuevoPass" class="border p-2 rounded w-full" placeholder="Contraseña">
      <select id="nuevoRol" class="border p-2 rounded w-full">
        <option value="basico">Básico</option>
        <option value="medio">Medio</option>
        <option value="alto">Alto</option>
        <option value="admin">Admin</option>
      </select>
      <button id="agregarUser" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Agregar Usuario
      </button>
    </div>

    <div id="listaUsuarios" class="mt-6"></div>
  `;

  const lista = document.getElementById("listaUsuarios");

  function refrescarUsuarios() {
    const users = JSON.parse(localStorage.getItem("usuarios") || "[]");

    lista.innerHTML = users.map((u, i) => `
      <div class="bg-white shadow p-3 rounded mb-2 flex justify-between">
        <div>
          <b>${u.username}</b> — ${u.role}
        </div>
        <button data-i="${i}" class="eliminar bg-red-600 text-white px-2 py-1 text-sm rounded">Eliminar</button>
      </div>
    `).join("");

    document.querySelectorAll(".eliminar").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = btn.getAttribute("data-i");
        users.splice(index, 1);
        localStorage.setItem("usuarios", JSON.stringify(users));
        refrescarUsuarios();
      });
    });
  }

  refrescarUsuarios();

  document.getElementById("agregarUser").addEventListener("click", () => {
    const username = document.getElementById("nuevoUser").value.trim();
    const pass = document.getElementById("nuevoPass").value.trim();
    const rol = document.getElementById("nuevoRol").value;

    if (!username || !pass) return alert("Llena todos los campos.");

    const users = JSON.parse(localStorage.getItem("usuarios") || "[]");
    users.push({ username, password: pass, role: rol });

    localStorage.setItem("usuarios", JSON.stringify(users));
    refrescarUsuarios();
  });
}
