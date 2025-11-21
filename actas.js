function loadActasUI() {
    const container = document.getElementById("viewContainer");
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const actas = JSON.parse(localStorage.getItem("actas"))
        .filter(a => a.dirigidoA === user.usuario);

    let html = `
    <div class="card">
        <h3>Actas personales</h3>
        <ul>
    `;

    actas.forEach(a => {
        html += `
            <li>
                <strong>${a.fecha}</strong> — ${a.texto}
                <br><small>Autor: ${a.autor}</small>
            </li>
        `;
    });

    html += "</ul></div>";

    container.innerHTML = html;
}
