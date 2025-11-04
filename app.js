document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const logoutBtn = document.getElementById("logoutBtn");
  const navBtns = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".view-section");

  if (!currentUser) {
    window.location.href = "index.html";
    return;
  }

  // Roles visibles
  if (currentUser.rol !== "admin") {
    document.querySelectorAll(".admin-only").forEach(el => el.classList.add("hidden"));
  }

  // Cerrar sesión
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
      document.getElementById("view-title").textContent = btn.textContent.trim();

      if (view === "tiempo") renderControlTiempo();
      if (view === "usuarios") renderUsuarios();
    });
  });

  // Mostrar info usuario en header
  const userNameEl = document.getElementById("user-name");
  const userRoleEl = document.getElementById("user-role");
  const userAvatarEl = document.getElementById("user-avatar");
  userNameEl.textContent = currentUser.usuario;
  userRoleEl.textContent = currentUser.rol.charAt(0).toUpperCase() + currentUser.rol.slice(1);
  userAvatarEl.textContent = currentUser.usuario.charAt(0).toUpperCase();

  // === Aplicar tema según rol ===
  const body = document.body;
  if (["admin", "alto"].includes(currentUser.rol)) {
    body.classList.add("theme-admin");
  } else {
    body.classList.add("theme-basic");
  }

  // === Control de Tiempo ===
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
          <tr class="border-b">
            <th class="py-2">Fecha</th>
            <th>Hora</th>
            <th>Actividad</th>
            <th>Tipo</th>
          </tr>
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
        tr.innerHTML = `
          <td class="py-1">${r.fecha}</td>
          <td>${r.hora}</td>
          <td>${r.actividad}</td>
          <td>${r.tipo}</td>
        `;
        tbody.appendChild(tr);
      });
    }
    actualizarTabla();

    document.getElementById("entradaBtn").addEventListener("click", () => registrarTiempo("Entrada"));
    document.getElementById("salidaBtn").addEventListener("click", () => registrarTiempo("Salida"));

    function registrarTiempo(tipo) {
      const actividad = document.getElementById("actividad").value.trim();
      if (actividad === "") {
        alert("Por favor ingresa una actividad.");
        return;
      }
      const ahora = new Date();
      const nuevoRegistro = {
        usuario: currentUser.usuario,
        fecha: ahora.toLocaleDateString(),
        hora: ahora.toLocaleTimeString(),
        actividad,
        tipo
      };
      registros.push(nuevoRegistro);
      localStorage.setItem("tiempos", JSON.stringify(registros));
      actualizarTabla();
      document.getElementById("actividad").value = "";
    }
  }

  // === Gestión de Usuarios ===
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
      { usuario: "basico1", contraseña: "1234", rol: "básico" },
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
        <thead>
          <tr class="border-b">
            <th class="py-2">Usuario</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
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
        tr.innerHTML = `
          <td class="py-1">${u.usuario}</td>
          <td>${u.rol}</td>
          <td>
            ${u.usuario !== "admin"
              ? `<button data-index="${i}" class="borrar bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs">Eliminar</button>`
              : ""}
          </td>
        `;
        tbody.appendChild(tr);
      });

      document.querySelectorAll(".borrar").forEach(btn => {
        btn.addEventListener("click", e => {
          const i = e.target.dataset.index;
          usuarios.splice(i, 1);
          localStorage.setItem("usuarios", JSON.stringify(usuarios));
          actualizarUsuarios();
        });
      });
    }
    actualizarUsuarios();

    document.getElementById("agregarUsuario").addEventListener("click", () => {
      const nuevoUsuario = document.getElementById("nuevoUsuario").value.trim();
      const nuevoPass = document.getElementById("nuevoPass").value.trim();
      const nuevoRol = document.getElementById("nuevoRol").value;
      if (nuevoUsuario === "" || nuevoPass === "") {
        alert("Completa todos los campos.");
        return;
      }
      if (usuarios.some(u => u.usuario === nuevoUsuario)) {
        alert("Ese usuario ya existe.");
        return;
      }
      usuarios.push({ usuario: nuevoUsuario, contraseña: nuevoPass, rol: nuevoRol });
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      actualizarUsuarios();
    });
  }
});
