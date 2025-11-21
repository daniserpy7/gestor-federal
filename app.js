function goTo(section) {
    if (section === "tiempo") loadTiempoUI();
    if (section === "comunicados") loadComunicadosUI();
    if (section === "actas") loadActasUI();
    if (section === "ranking") loadRankingUI();
    if (section === "usuarios") loadUsuariosUI();
}

/* Ranking */
function loadRankingUI() {
    const users = getUsers();
    const container = document.getElementById("viewContainer");

    let html = "<div class='card'><h3>Ranking</h3><ul>";

    users.sort((a,b)=> b.tiempo - a.tiempo).forEach(u=>{
        html += `<li>${u.alias} — ${u.rol} — ${u.tiempo} min</li>`;
    });

    html += "</ul></div>";

    container.innerHTML = html;
}

/* Usuarios admin */
function loadUsuariosUI() {
    const users = getUsers();
    const container = document.getElementById("viewContainer");

    let html = "<div class='card'><h3>Gestión de Usuarios</h3><ul>";

    users.forEach(u=>{
        html += `<li>${u.alias} (${u.usuario}) — ${u.rol} 
        <button onclick="eliminarUser('${u.usuario}')">Eliminar</button></li>`;
    });

    html += "</ul></div>";

    container.innerHTML = html;
}

function eliminarUser(user) {
    let db = getUsers();
    db = db.filter(u => u.usuario !== user);
    saveUsers(db);
    loadUsuariosUI();
}
