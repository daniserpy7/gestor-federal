function loadTiempoUI() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const container = document.getElementById("viewContainer");

    container.innerHTML = `
        <div class="card">
            <h3>Tiempo de trabajo</h3>
            <p>Total acumulado: <span id="tTotal"></span></p>

            <button onclick="startTiempo()">Iniciar</button>
            <button onclick="pauseTiempo()">Pausar</button>
            <button onclick="resumeTiempo()">Reanudar</button>
            <button onclick="stopTiempo()">Detener</button>

            ${ user.rol !== 'basico' && user.rol !== 'medio' ? `
                <hr>
                <h4>Agregar tiempo</h4>
                <input id="addMin" type="number" placeholder="Minutos">
                <input id="addMotivo" placeholder="Motivo">
                <button onclick="agregarTiempo()">Agregar</button>
            `: "" }
        </div>
    `;

    actualizarTiempoUI();
}

function actualizarTiempoUI() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    document.getElementById("tTotal").textContent = user.tiempo + " min";
}

function startTiempo() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    user.lastStart = Date.now();
    localStorage.setItem("currentUser", JSON.stringify(user));
}

function pauseTiempo() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    if (user.lastStart) {
        const min = (Date.now() - user.lastStart) / 60000;
        user.tiempo += Math.floor(min);
        user.lastStart = null;
        localStorage.setItem("currentUser", JSON.stringify(user));
        actualizarTiempoUI();
    }
}

function resumeTiempo() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    user.lastStart = Date.now();
    localStorage.setItem("currentUser", JSON.stringify(user));
}

function stopTiempo() {
    pauseTiempo();
}

function agregarTiempo() {
    const min = Number(document.getElementById("addMin").value);
    const motivo = document.getElementById("addMotivo").value;

    if (!min || !motivo) {
        alert("Ingresa minutos y motivo");
        return;
    }

    let user = JSON.parse(localStorage.getItem("currentUser"));
    user.tiempo += min;
    localStorage.setItem("currentUser", JSON.stringify(user));

    actualizarTiempoUI();
}
