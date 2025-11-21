function loadComunicadosUI() {
    const container = document.getElementById("viewContainer");
    let coms = JSON.parse(localStorage.getItem("comunicados"));

    let html = `
    <div class="card">
        <h3>Comunicados</h3>
        <ul>
    `;

    coms.forEach(c => {
        html += `
            <li>
                <strong>${c.urgente ? "🚨 URGENTE" : ""}</strong> ${c.texto}
                <br><small>${c.fecha}</small>
            </li>
        `;
    });

    html += "</ul></div>";

    container.innerHTML = html;

    document.getElementById("UrgFlag").textContent = "";
}
