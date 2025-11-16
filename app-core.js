/* ============================================================
   SISTEMA BASE DE USUARIOS
   (Se guarda en localStorage solo si no existía antes)
============================================================ */

const BASE_USUARIOS = [
    { usuario: "admin", password: "1234", rol: "admin" },
    { usuario: "alto1", password: "1234", rol: "alto" },
    { usuario: "medio1", password: "1234", rol: "medio" },
    { usuario: "basico1", password: "1234", rol: "basico" }
];

// Crear tabla de usuarios solo la primera vez
if (!localStorage.getItem("usuarios")) {
    localStorage.setItem("usuarios", JSON.stringify(BASE_USUARIOS));
}


/* ============================================================
   OBTENER USUARIOS
============================================================ */

function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}


/* ============================================================
   LOGIN — VALIDACIÓN ESTABLE Y SEGURA
============================================================ */

function login(usuario, password) {
    usuario = usuario.trim().toLowerCase();
    password = password.trim();

    const usuarios = obtenerUsuarios();

    return usuarios.find(
        u => u.usuario.toLowerCase() === usuario && u.password === password
    );
}


/* ============================================================
   SISTEMA DE SESIÓN
============================================================ */

// Guardar sesión activa en localStorage
function guardarSesion(usuarioObj) {
    localStorage.setItem("sesionActiva", JSON.stringify(usuarioObj));
}

// Obtener usuario con sesión iniciada
function obtenerSesion() {
    return JSON.parse(localStorage.getItem("sesionActiva"));
}

// Cerrar sesión
function cerrarSesion() {
    localStorage.removeItem("sesionActiva");
    window.location.href = "index.html";
}


/* ============================================================
   PROTECCIÓN DE PÁGINAS
============================================================ */

// Llamar esta función en cada página que requiera login
function protegerPagina() {
    const sesion = obtenerSesion();

    if (!sesion) {
        window.location.href = "index.html";
        return;
    }

    return sesion;
}


/* ============================================================
   EXPORTABLES (para módulos si los usas)
============================================================ */

window.appCore = {
    login,
    guardarSesion,
    obtenerSesion,
    cerrarSesion,
    protegerPagina
};
