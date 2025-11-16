/* ===========================
   BASE DE USUARIOS INICIALES
=========================== */

const BASE_USUARIOS = [
    { usuario: "admin", contraseña: "1234", rol: "admin" },
    { usuario: "alto1", contraseña: "1234", rol: "alto" },
    { usuario: "medio1", contraseña: "1234", rol: "medio" },
    { usuario: "basico1", contraseña: "1234", rol: "basico" }
];

/* ===========================
   INICIALIZAR USUARIOS
=========================== */

if (!localStorage.getItem("usuarios")) {
    localStorage.setItem("usuarios", JSON.stringify(BASE_USUARIOS));
}

/* ===========================
   FUNCIÓN DE LOGIN
=========================== */

function login(usuario, contraseña) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    return usuarios.find(
        u => u.usuario === usuario && u.contraseña === contraseña
    );
}
