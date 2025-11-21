document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = loginUser.value.trim();
      const pass = loginPass.value.trim();

      const usuarios = getUsers();
      const found = usuarios.find(u => u.usuario === user && u.pass === pass);

      if (!found) {
        loginError.textContent = "Usuario o contraseña incorrectos";
        return;
      }

      if (!found.activo) {
        loginError.textContent = "Usuario desactivado";
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(found));
      window.location = "dashboard.html";
    });
  }

  if (location.pathname.includes("dashboard.html")) {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      location.href = "index.html";
      return;
    }

    document.getElementById("dashName").textContent = user.alias;
    document.getElementById("dashRole").textContent = "Rango: " + user.rol;

    document.body.classList.add(user.rol);

    if (user.rol === "admin") {
      adminPanel.innerHTML = `
        <button class="menu-btn" onclick="goTo('ranking')">🏆 Ranking</button>
        <button class="menu-btn" onclick="goTo('usuarios')">👤 Usuarios</button>
      `;
    }
  }
});

function logout() {
  localStorage.removeItem("currentUser");
  location.href = "index.html";
}
