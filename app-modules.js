/* ============================================================
   MÓDULO: LOGIN
============================================================ */

// Solo se ejecuta si existe el formulario de login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const usuario = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const errorMsg = document.getElementById("loginError");

        const usuarioEncontrado = appCore.login(usuario, password);

        if (usuarioEncontrado) {
            errorMsg.classList.add("hidden");
            appCore.guardarSesion(usuarioEncontrado);

            // Redirigir al dashboard
            window.location.href = "dashboard.html";
        } else {
            errorMsg.classList.remove("hidden");
        }
    });
}


/* ============================================================
   MÓDULO: PROTECCIÓN DE PÁGINAS PRIVADAS
============================================================ */

// Si la página NO es index.html, automáticamente se protege
if (!window.location.pathname.includes("index.html")) {
    const sesion = appCore.protegerPagina();

    // Si hay contenedor donde mostrar info del usuario
    const infoUsuario = document.getElementById("infoUsuario");

    if (infoUsuario && sesion) {
        infoUsuario.innerHTML = `
            <div class="alert alert-success">
                Estás conectado como <b>${sesion.usuario}</b> — Rol: <b>${sesion.rol}</b>
            </div>
        `;
    }
}


/* ============================================================
   MÓDULO: CERRAR SESIÓN
============================================================ */

const btnCerrar = document.getElementById("cerrarSesionBtn");

if (btnCerrar) {
    btnCerrar.addEventListener("click", function () {
        appCore.cerrarSesion();
    });
}


/* ============================================================
   MÓDULOS FUTUROS (ya preparados)
============================================================ */

// Usuarios
window.modUsuarios = {
    cargar() {
        console.log("MOD: usuarios cargado");
    }
};

// Comunicados
window.modComunicados = {
    cargar() {
        console.log("MOD: comunicados cargado");
    }
};

// Actas
window.modActas = {
    cargar() {
        console.log("MOD: actas cargado");
    }
};

// Control de tiempos
window.modTiempos = {
    cargar() {
        console.log("MOD: tiempos cargado");
    }
};
