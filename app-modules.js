// ==============================
// MÓDULOS DEL SISTEMA
// ==============================

// Cargar datos del usuario en el dashboard
function cargarDashboard() {
    const usuarioActivo = localStorage.getItem("usuarioActivo");

    if (!usuarioActivo) {
        window.location.href = "index.html";
        return;
    }

    const datos = JSON.parse(usuarioActivo);

    const info = document.getElementById("infoUsuario");

    info.innerHTML = `
        <div class="card p-3 shadow-sm">
            <h4>Usuario: ${datos.usuario}</h4>
            <p><strong>Rol:</strong> ${datos.rol}</p>
        </div>
    `;
}

// Cerrar sesión
const cerrarSesionBtn = document.getElementById("cerrarSesionBtn");
if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener("click", () => {
        localStorage.removeItem("usuarioActivo");
        window.location.href = "index.html";
    });
}
