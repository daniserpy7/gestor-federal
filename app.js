document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const logoutBtn = document.getElementById("logoutBtn");
  const navBtns = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".view-section");
  const body = document.body;

  // Si no hay usuario logueado
  if (!currentUser) {
    window.location.href = "index.html";
    return;
  }

  console.log("Usuario actual:", currentUser);

  // Tema por rol
  if (["admin", "alto"].includes(currentUser.rol)) {
    body.classList.add("theme-admin");
  } else {
    body.classList.add("theme-basic");
  }

  // Mostrar info usuario
  document.getElementById("user-name").textContent = currentUser.usuario;
  document.getElementById("user-role").textContent = currentUser.rol;
  document.getElementById("user-avatar").textContent = currentUser.usuario.charAt(0).toUpperCase();

  // Mostrar/ocultar admin
  if (currentUser.rol !== "admin") {
    document.querySelectorAll(".admin-only").forEach(el => el.classList.add("hidden"));
  }

  // Logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  });

  // Navegación
  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      sections.forEach(sec => sec.classList.add("hidden"));
      document.getElementById(`view-${view}`).classList.remove("hidden");
      document.getElementById("view-title").textContent = btn.textContent;
      lucide.createIcons();

      if (view === "tiempo") renderControlTiempo();
      if (view === "usuarios") renderUsuarios();
      if (view === "actas") renderActas();
      if (view === "comunicados") renderComunicados();
    });
  });

  // === CONTROL DE TIEMPO ===
  function renderControlTiempo() {
    const container = document.getElementById("tiempo-content");
    container.innerHTML = "";
    const registros = JSON.parse(localStorage.getItem("tiempos")) || [];
    const misRegistros = registros.filter(r => r.usuario === currentUser.usuario);

    const form = document.createElement("div");
    form.className = "bg-white shadow rounded p-4 mb-6";
    form.innerHTML = `
      <h3 class="text-lg font-semibold mb-3">Registrar actividad</h3>
      <label class="block mb-2 text-sm">Actividad</label>
      <input type="text" id="actividad" class="border w-full p-2 rounded mb-3" placeholder="Ejemplo: Revisión de informes">
      <div class="flex space-x-2">
        <button id="entradaBtn" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Entrada</button>
        <button id="salidaBtn" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Salida</button>
      </div>
    `;
    container.appendChild(form);

    const tabla = document.createElement("div");
    tabla.className = "bg-white shadow rounded p-4";
    tabla.innerHTML = `
      <h3 class="text-lg font-semibold mb-3">Historial</h3>
      <table class="w-full text-sm text-left">
        <thead>
          <tr class="border-b"><th>Fecha</th><th>Hora</th><th>Actividad</th><th>Tipo</th></tr>
        </thead>
        <tbody id="historial-tiempo"></tbody>
      </table>
    `;
    container.appendChild(tabla);

    const tbody = document.getElementById("historial-tiempo");
    function actualizarTabla() {
      tbody.innerHTML = "";
      const registrosActuales = (currentUser.rol === "admin" || currentUser.rol === "alto") ? registros : misRegistros;
      registrosActuales.slice().reverse().forEach(r => {
        const tr = document.createElement("tr");
        tr.className = "border-b";
        tr.innerHTML = `<td>${r.fecha}</td><td>${r.hora}</td><td>${r.actividad}</td><td>${r.tipo}</td>`;
        tbody.appendChild(tr);
      });
    }
    actualizarTabla();

    document.getElementById("entradaBtn").addEventListener("click", () => registrarTiempo("Entrada"));
    document.getElementById("salidaBtn").addEventListener("click", () => registrarTiempo("Salida"));

    function registrarTiempo(tipo) {
      const actividad = document.getElementById("actividad").value.trim();
      if (!actividad) return alert("Por favor ingresa una actividad.");
      const ahora = new Date();
      registros.push({ usuario: currentUser.usuario, fecha: ahora.toLocaleDateString(), hora: ahora.toLocaleTimeString(), actividad, tipo });
      localStorage.setItem("tiempos", JSON.stringify(registros));
      actualizarTabla();
      document.getElementById("actividad").value = "";
    }
  }

  // === USUARIOS ===
  function renderUsuarios() {
    const container = document.getElementById("usuarios-content");
    container.innerHTML = "";
    if (currentUser.rol !== "admin") {
      container.innerHTML = "<p class='text-gray-600'>No tienes permisos para ver esta sección.</p>";
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [
      { usuario: "admin", contraseña: "1234", rol: "admin" },
      { usuario: "alto1", contraseña: "1234", rol: "alto" },
      { usuario: "medio1", contraseña: "1234", rol: "medio" },
      { usuario: "basico1", contraseña: "1234", rol: "básico" }
    ];

    const form = document.createElement("div");
    form.className = "bg-white shadow rounded p-4 mb-6";
    form.innerHTML = `
      <h3 class="text-lg font-semibold mb-3">Agregar nuevo usuario</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <input type="text" id="nuevoUsuario" placeholder="Usuario" class="border p-2 rounded">
        <input type="password" id="nuevoPass" placeholder="Contraseña" class="border p-2 rounded">
        <select id="nuevoRol" class="border p-2 rounded">
          <option value="básico">Básico</option>
          <option value="medio">Medio</option>
          <option value="alto">Alto</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button id="agregarUsuario" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Agregar</button>
    `;
    container.appendChild(form);

    const tabla = document.createElement("div");
    tabla.className = "bg-white shadow rounded p-4";
    tabla.innerHTML = `
      <h3 class="text-lg font-semibold mb-3">Usuarios registrados</h3>
      <table class="w-full text-sm text-left">
        <thead><tr class="border-b"><th>Usuario</th><th>Rol</th><th>Acciones</th></tr></thead>
        <tbody id="tablaUsuarios"></tbody>
      </table>
    `;
    container.appendChild(tabla);

    const tbody = document.getElementById("tablaUsuarios");
    function actualizarUsuarios() {
      tbody.innerHTML = "";
      usuarios.forEach((u, i) => {
        const tr = document.createElement("tr");
        tr.className = "border-b";
        tr.innerHTML = `<td>${u.usuario}</td><td>${u.rol}</td>
        <td>${u.usuario !== "admin" ? `<button data-index="${i}" class="borrar bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs">Eliminar</button>` : ""}</td>`;
        tbody.appendChild(tr);
      });
      document.querySelectorAll(".borrar").forEach(btn => btn.addEventListener("click", e => {
        usuarios.splice(e.target.dataset.index, 1);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        actualizarUsuarios();
      }));
    }
    actualizarUsuarios();

    document.getElementById("agregarUsuario").addEventListener("click", () => {
      const nuevoUsuario = document.getElementById("nuevoUsuario").value.trim();
      const nuevoPass = document.getElementById("nuevoPass").value.trim();
      const nuevoRol = document.getElementById("nuevoRol").value;
      if (!nuevoUsuario || !nuevoPass) return alert("Completa todos los campos.");
      if (usuarios.some(u => u.usuario === nuevoUsuario)) return alert("Ese usuario ya existe.");
      usuarios.push({ usuario: nuevoUsuario, contraseña: nuevoPass, rol: nuevoRol });
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      actualizarUsuarios();
      document.getElementById("nuevoUsuario").value = "";
      document.getElementById("nuevoPass").value = "";
    });
  }

  // === ACTAS ===
  function renderActas() {
    const c = document.getElementById("actas-content");
    c.innerHTML = "";
    const actas = JSON.parse(localStorage.getItem("actas")) || [];

    if (["admin", "alto"].includes(currentUser.rol)) {
      c.innerHTML += `
      <div class="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 class="font-semibold mb-2">Subir nueva acta</h3>
        <input id="actaTitulo" type="text" placeholder="Título" class="border p-2 rounded w-full mb-2">
        <textarea id="actaContenido" placeholder="Contenido" class="border p-2 rounded w-full mb-3"></textarea>
        <button id="agregarActa" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Guardar</button>
      </div>`;
      document.getElementById("agregarActa").addEventListener("click", () => {
        const titulo = document.getElementById("actaTitulo").value.trim();
        const contenido = document.getElementById("actaContenido").value.trim();
        if (!titulo || !contenido) return alert("Completa todos los campos.");
        actas.push({ id: Date.now(), titulo, contenido, fecha: new Date().toLocaleString(), autor: currentUser.usuario });
        localStorage.setItem("actas", JSON.stringify(actas));
        renderActas();
      });
    }

    if (actas.length === 0) {
      c.innerHTML += `<p class="text-gray-500 text-sm">No hay actas registradas.</p>`;
      return;
    }

    actas.slice().reverse().forEach(a => {
      const card = document.createElement("div");
      card.className = "border rounded-lg p-4 mb-3 shadow-sm bg-white";
      card.innerHTML = `<div class="flex justify-between mb-2">
      <h4 class="font-semibold text-blue-800">${a.titulo}</h4><span class="text-xs text-gray-500">${a.fecha}</span></div>
      <p class="text-gray-700 mb-3">${a.contenido}</p>
      <div class="flex justify-between text-sm text-gray-500"><span>Autor: ${a.autor}</span>
      ${["admin", "alto"].includes(currentUser.rol) ? `<button data-id="${a.id}" class="borrar-acta text-red-600 hover:text-red-800">Eliminar</button>` : ""}</div>`;
      c.appendChild(card);
    });

    document.querySelectorAll(".borrar-acta").forEach(btn => btn.addEventListener("click", e => {
      const nuevas = actas.filter(a => a.id != e.target.dataset.id);
      localStorage.setItem("actas", JSON.stringify(nuevas));
      renderActas();
    }));
  }

  // === COMUNICADOS ===
  function renderComunicados() {
    const c = document.getElementById("comunicados-content");
    c.innerHTML = "";
    const comunicados = JSON.parse(localStorage.getItem("comunicados")) || [];

    if (["admin", "alto"].includes(currentUser.rol)) {
      c.innerHTML += `
      <div class="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 class="font-semibold mb-2">Nuevo comunicado</h3>
        <input id="comunicadoTitulo" type="text" placeholder="Título" class="border p-2 rounded w-full mb-2">
        <textarea id="comunicadoTexto" placeholder="Mensaje" class="border p-2 rounded w-full mb-3"></textarea>
        <button id="agregarComunicado" class="bg-blue-600
 // === Módulo ACTAS ===
  function renderActas() {
    const container = document.getElementById("actas-content");
    container.innerHTML = "";

    const actas = JSON.parse(localStorage.getItem("actas")) || [];

    // Solo admin y alto pueden agregar
    if (["admin", "alto"].includes(currentUser.rol)) {
      const form = document.createElement("div");
      form.className = "bg-gray-50 p-4 rounded-lg mb-6";
      form.innerHTML = `
        <h3 class="font-semibold mb-2">Subir nueva acta</h3>
        <input id="actaTitulo" type="text" placeholder="Título del acta" class="border p-2 rounded w-full mb-2">
        <textarea id="actaContenido" placeholder="Contenido del acta" class="border p-2 rounded w-full mb-3"></textarea>
        <button id="agregarActa" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Guardar</button>
      `;
      container.appendChild(form);

      document.getElementById("agregarActa").addEventListener("click", () => {
        const titulo = document.getElementById("actaTitulo").value.trim();
        const contenido = document.getElementById("actaContenido").value.trim();
        if (!titulo || !contenido) return alert("Completa todos los campos.");

        actas.push({
          id: Date.now(),
          titulo,
          contenido,
          fecha: new Date().toLocaleString(),
          autor: currentUser.usuario
        });

        localStorage.setItem("actas", JSON.stringify(actas));
        renderActas();
      });
    }

    // Mostrar actas
    if (actas.length === 0) {
      container.innerHTML += `<p class="text-gray-500 text-sm">No hay actas registradas.</p>`;
      return;
    }

    actas.slice().reverse().forEach(a => {
      const card = document.createElement("div");
      card.className = "border rounded-lg p-4 mb-3 shadow-sm bg-white";
      card.innerHTML = `
        <div class="flex justify-between items-center mb-2">
          <h4 class="font-semibold text-lg text-blue-800">${a.titulo}</h4>
          <span class="text-xs text-gray-500">${a.fecha}</span>
        </div>
        <p class="text-gray-700 mb-3">${a.contenido}</p>
        <div class="flex justify-between items-center text-sm text-gray-500">
          <span>Autor: ${a.autor}</span>
          ${["admin", "alto"].includes(currentUser.rol)
            ? `<button data-id="${a.id}" class="borrar-acta text-red-600 hover:text-red-800">Eliminar</button>`
            : ""}
        </div>
      `;
      container.appendChild(card);
    });

    // Eliminar
    document.querySelectorAll(".borrar-acta").forEach(btn => {
      btn.addEventListener("click", e => {
        const id = e.target.dataset.id;
        const nuevas = actas.filter(a => a.id != id);
        localStorage.setItem("actas", JSON.stringify(nuevas));
        renderActas();
      });
    });
  }

  // === Módulo COMUNICADOS ===
  function renderComunicados() {
    const container = document.getElementById("comunicados-content");
    container.innerHTML = "";

    const comunicados = JSON.parse(localStorage.getItem("comunicados")) || [];

    // Solo admin y alto pueden agregar
    if (["admin", "alto"].includes(currentUser.rol)) {
      const form = document.createElement("div");
      form.className = "bg-gray-50 p-4 rounded-lg mb-6";
      form.innerHTML = `
        <h3 class="font-semibold mb-2">Nuevo comunicado</h3>
        <input id="comunicadoTitulo" type="text" placeholder="Título del comunicado" class="border p-2 rounded w-full mb-2">
        <textarea id="comunicadoTexto" placeholder="Mensaje" class="border p-2 rounded w-full mb-3"></textarea>
        <button id="agregarComunicado" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Publicar</button>
      `;
      container.appendChild(form);

      document.getElementById("agregarComunicado").addEventListener("click", () => {
        const titulo = document.getElementById("comunicadoTitulo").value.trim();
        const texto = document.getElementById("comunicadoTexto").value.trim();
        if (!titulo || !texto) return alert("Completa todos los campos.");

        comunicados.push({
          id: Date.now(),
          titulo,
          texto,
          fecha: new Date().toLocaleString(),
          autor: currentUser.usuario
        });

        localStorage.setItem("comunicados", JSON.stringify(comunicados));
        renderComunicados();
      });
    }

    // Mostrar comunicados
    if (comunicados.length === 0) {
      container.innerHTML += `<p class="text-gray-500 text-sm">No hay comunicados publicados.</p>`;
      return;
    }

    comunicados.slice().reverse().forEach(c => {
      const card = document.createElement("div");
      card.className = "border rounded-lg p-4 mb-3 shadow-sm bg-white";
      card.innerHTML = `
        <div class="flex justify-between items-center mb-2">
          <h4 class="font-semibold text-lg text-blue-800">${c.titulo}</h4>
          <span class="text-xs text-gray-500">${c.fecha}</span>
        </div>
        <p class="text-gray-700 mb-3">${c.texto}</p>
        <div class="flex justify-between items-center text-sm text-gray-500">
          <span>Autor: ${c.autor}</span>
          ${["admin", "alto"].includes(currentUser.rol)
            ? `<button data-id="${c.id}" class="borrar-comunicado text-red-600 hover:text-red-800">Eliminar</button>`
            : ""}
        </div>
      `;
      container.appendChild(card);
    });

    // Eliminar
    document.querySelectorAll(".borrar-comunicado").forEach(btn => {
      btn.addEventListener("click", e => {
        const id = e.target.dataset.id;
        const nuevos = comunicados.filter(c => c.id != id);
        localStorage.setItem("comunicados", JSON.stringify(nuevos));
        renderComunicados();
      });
    });
  }

  // === Agregar los nuevos módulos al sistema de navegación ===
  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      sections.forEach(sec => sec.classList.add("hidden"));
      document.getElementById(`view-${view}`).classList.remove("hidden");

      if (view === "tiempo") renderControlTiempo();
      if (view === "usuarios") renderUsuarios();
      if (view === "actas") renderActas();
      if (view === "comunicados") renderComunicados();
    });
  });
});
