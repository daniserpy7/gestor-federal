document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const appSection = document.getElementById("appSection");
    const logoutBtn = document.getElementById("logoutBtn");

    const USERS = [
        { user: "admin", pass: "admin123", role: "Administrador" },
        { user: "alto", pass: "alto123", role: "Alto Mando" },
        { user: "medio", pass: "medio123", role: "Mando Medio" }
    ];

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        const found = USERS.find(u => u.user === username && u.pass === password);

        if (!found) {
            alert("Usuario o contraseña incorrectos");
            return;
        }

        localStorage.setItem("loggedUser", JSON.stringify(found));

        mostrarApp(found);
    });

    function mostrarApp(user) {
        document.getElementById("loginSection").style.display = "none";
        appSection.style.display = "block";

        document.getElementById("userRole").textContent = user.role;
    }

    const saved = localStorage.getItem("loggedUser");
    if (saved) {
        mostrarApp(JSON.parse(saved));
    }

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedUser");
        location.reload();
    });
});
