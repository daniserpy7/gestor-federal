document.addEventListener("DOMContentLoaded", () => {
    const table = document.getElementById("tablaUsuarios");
    const form = document.getElementById("formUsuarios");

    function cargarUsuarios() {
        const lista = JSON.parse(localStorage.getItem("usuarios")) || [];
        table.innerHTML = "";

        lista.forEach((u, i) => {
            let row = `
                <tr>
                    <td>${u.usuario}</td>
                    <td>${u.rol}</td>
                    <td>
                        <button onclick="eliminarUsuario(${i})">Eliminar</button>
                    </td>
                </tr>
            `;
            table.innerHTML += row;
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const usuario = document.getElementById("user").value.trim();
        const rol = document.getElementById("rol").value.trim();

        if (usuario === "" || rol === "") {
            alert("Todos los campos son obligatorios");
            return;
        }

        const lista = JSON.parse(localStorage.getItem("usuarios")) || [];
        lista.push({ usuario, rol });
        localStorage.setItem("usuarios", JSON.stringify(lista));

        form.reset();
        cargarUsuarios();
    });

    window.eliminarUsuario = function (i) {
        const lista = JSON.parse(localStorage.getItem("usuarios")) || [];
        lista.splice(i, 1);
        localStorage.setItem("usuarios", JSON.stringify(lista));
        cargarUsuarios();
    };

    cargarUsuarios();
});
