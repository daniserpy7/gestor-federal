// ==== DATOS INICIALES ====
const usuariosBase = [
  { usuario: "admin", pass: "1234", rol: "admin" },
  { usuario: "alto1", pass: "1234", rol: "alto" },
  { usuario: "medio1", pass: "1234", rol: "medio" },
  { usuario: "basico1", pass: "1234", rol: "basico" },
];

// Cargar usuarios en localStorage si no existen
if (!localStorage.getItem("usuarios")) {
  localStorage.setItem("usuarios", JSON.stringify(usuariosBase));
}

// ==== LOGIN ====
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    const user = usuarios.find(u => u.usuario === username && u.pass === password);

    if (user) {
      localStorage.setItem("sesionActiva", JSON.stringify(user));
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("loginError").classList.remove("hidden");
    }
  });
}

// ==== DASHBOARD ====
const userRole = document.getElementById("userRole");
if (userRole) {
  const sesion = JSON.parse(localStorage.getItem("sesionActiva"));
  if (!sesion) window.location.href = "index.html";
  userRole.textContent = `${sesion.usuario} (${sesion.rol})`;

  // Botón de cerrar sesión
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("sesionActiva");
    window.location.href = "index.html";
  });
}
