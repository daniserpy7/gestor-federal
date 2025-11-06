// app-core.js
// --- Login y control de roles ---

const users = [
  { username: "admin", password: "1234", role: "admin" },
  { username: "alto1", password: "1234", role: "alto" },
  { username: "medio1", password: "1234", role: "medio" },
  { username: "basico1", password: "1234", role: "basico" }
];

function saveUserSession(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function getUserSession() {
  const data = localStorage.getItem("currentUser");
  return data ? JSON.parse(data) : null;
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

if (window.location.pathname.includes("index.html") || window.location.pathname.endsWith("/")) {
  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      const user = users.find(u => u.username === username && u.password === password);
      const errorMsg = document.getElementById("loginError");

      if (user) {
        saveUserSession(user);
        window.location.href = "dashboard.html";
      } else {
        errorMsg.classList.remove("hidden");
      }
    });
  }
}

// --- Dashboard ---
if (window.location.pathname.includes("dashboard.html")) {
  const user = getUserSession();
  if (!user) window.location.href = "index.html";

  const roleDisplay = document.getElementById("userRole");
  if (roleDisplay) roleDisplay.textContent = user.role.toUpperCase();

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  // Cargar estilo según rol
  const body = document.body;
  if (user.role === "admin" || user.role === "alto") {
    body.classList.add("bg-slate-900", "text-white");
  } else {
    body.classList.add("bg-gray-100", "text-gray-800");
  }

  // Cargar scripts de módulos
  const script = document.createElement("script");
  script.src = "app-modules.js";
  document.body.appendChild(script);
}
