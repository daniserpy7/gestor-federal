// Base inicial
if (!localStorage.getItem("usuarios")) {
    const inicial = [
        {
            alias: "Admin",
            usuario: "admin",
            pass: "1234",
            rol: "admin",
            correo: "admin@sistema.com",
            activo: true,
            tiempo: 0
        }
    ];
    localStorage.setItem("usuarios", JSON.stringify(inicial));
}

if (!localStorage.getItem("comunicados")) {
    localStorage.setItem("comunicados", JSON.stringify([]));
}

if (!localStorage.getItem("actas")) {
    localStorage.setItem("actas", JSON.stringify([]));
}

// Funciones generales
function getUsers() {
    return JSON.parse(localStorage.getItem("usuarios"));
}

function saveUsers(data) {
    localStorage.setItem("usuarios", JSON.stringify(data));
}

function addComunicado(com) {
    let arr = JSON.parse(localStorage.getItem("comunicados"));
    arr.push(com);
    localStorage.setItem("comunicados", JSON.stringify(arr));
}

function addActa(a) {
    let arr = JSON.parse(localStorage.getItem("actas"));
    arr.push(a);
    localStorage.setItem("actas", JSON.stringify(arr));
}
