// Estado global
let S = {
    u: null,
    us: [{id:1, username:'admin', password:'admin123', role:'admin', name:'Admin'}],
    tm: {},
    cd: {},
    rc: [],
    ac: [],
    cm: [],
    v: 'login',
    cp: false
};

let ti = null;

// Funciones de almacenamiento
function sv() {
    try {
        localStorage.setItem('gf', JSON.stringify({
            us: S.us,
            rc: S.rc,
            ac: S.ac,
            cm: S.cm
        }));
    } catch(e) {}
}

function ld() {
    try {
        let d = JSON.parse(localStorage.getItem('gf'));
        if (d) {
            S.us = d.us || S.us;
            S.rc = d.rc || [];
            S.ac = d.ac || [];
            S.cm = d.cm || [];
        }
    } catch(e) {}
}

// Formatear tiempo
function fmt(s) {
    let h = Math.floor(s / 3600);
    let m = Math.floor((s % 3600) / 60);
    let sec = s % 60;
    return `${h}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
}

// Login
function login(e) {
    e.preventDefault();
    let u = document.getElementById('u').value;
    let p = document.getElementById('p').value;
    let user = S.us.find(x => x.username === u && x.password === p);
    
    if (user) {
        S.u = user;
        S.v = user.role === 'admin' ? 'admin' : user.role === 'alto' ? 'alto' : 'bajo';
        r();
        sti();
    } else {
        alert('Credenciales incorrectas');
    }
}

// Logout
function logout() {
    S.u = null;
    S.v = 'login';
    if (ti) {
        clearInterval(ti);
        ti = null;
    }
    r();
}

// Iniciar interval del timer
function sti() {
    if (ti) return;
    ti = setInterval(() => {
        let hasActive = false;
        Object.keys(S.tm).forEach(uid => {
            if (S.tm[uid].r) {
                S.tm[uid].e++;
                hasActive = true;
            }
        });
        if (hasActive) {
            document.querySelectorAll('.tm').forEach(el => {
                let uid = el.dataset.uid;
                if (S.tm[uid]) el.textContent = fmt(S.tm[uid].e);
            });
        }
    }, 1000);
}

// Generar código
function gc() {
    let c = Math.random().toString(36).substring(2, 8).toUpperCase();
    S.cd[c] = {ai: S.u.id, an: S.u.name};
    alert('Código generado: ' + c);
    r();
}

// Iniciar timer
function st() {
    let c = document.getElementById('cd').value.toUpperCase();
    if (!S.cd[c]) {
        alert('Código inválido');
        return;
    }
    S.tm[S.u.id] = {e: 0, r: true, ai: S.cd[c].ai, an: S.cd[c].an};
    r();
}

// Detener propio timer
function stp() {
    let t = S.tm[S.u.id];
    if (t) {
        let sec = t.e;
        let m = Math.floor(sec / 60);
        let h = Math.floor(m / 60);
        S.rc.push({
            id: S.rc.length + 1,
            uid: S.u.id,
            un: S.u.name,
            ai: t.ai,
            an: t.an,
            h: h,
            m: m % 60,
            s: sec % 60,
            d: new Date().toISOString()
        });
        delete S.tm[S.u.id];
        sv();
        alert(`Registrado: ${h}h ${m % 60}m ${sec % 60}s`);
        r();
    }
}

// Detener timer de usuario
function stpu(uid) {
    let t = S.tm[uid];
    if (t) {
        let sec = t.e;
        let m = Math.floor(sec / 60);
        let h = Math.floor(m / 60);
        let u = S.us.find(x => x.id === uid);
        S.rc.push({
            id: S.rc.length + 1,
            uid: uid,
            un: u.name,
            ai: t.ai,
            an: t.an,
            h: h,
            m: m % 60,
            s: sec % 60,
            d: new Date().toISOString()
        });
        delete S.tm[uid];
        sv();
        alert(`Detenido: ${u.name} - ${h}h ${m % 60}m ${sec % 60}s`);
        r();
    }
}

// Agregar usuario
function au(e) {
    e.preventDefault();
    let n = document.getElementById('un').value;
    let u = document.getElementById('uu').value;
    let p = document.getElementById('up').value;
    let ro = document.getElementById('ur').value;
    
    if (S.us.find(x => x.username === u)) {
        alert('Usuario ya existe');
        return;
    }
    
    S.us.push({
        id: S.us.length + 1,
        username: u,
        password: p,
        role: ro,
        name: n
    });
    sv();
    alert('Usuario creado');
    r();
}

// Agregar acta
function aa(e) {
    e.preventDefault();
    let uid = parseInt(document.getElementById('auid').value);
    let mot = document.getElementById('amot').value;
    let u = S.us.find(x => x.id === uid);
    
    S.ac.push({
        id: S.ac.length + 1,
        uid: uid,
        un: u.name,
        mot: mot,
        by: S.u.name,
        d: new Date().toISOString()
    });
    sv();
    alert('Acta creada');
    r();
}

// Agregar comunicado
function acm(e) {
    e.preventDefault();
    if (S.cm.length >= 10) {
        alert('Máximo 10 comunicados');
        return;
    }
    
    let t = document.getElementById('cmt').value;
    let c = document.getElementById('cmc').value;
    
    S.cm.push({
        id: S.cm.length + 1,
        t: t,
        c: c,
        by: S.u.name,
        d: new Date().toISOString()
    });
    sv();
    alert('Comunicado creado');
    r();
}

// Eliminar comunicado
function dcm(id) {
    if (confirm('¿Eliminar?')) {
        S.cm = S.cm.filter(x => x.id !== id);
        sv();
        r();
    }
}

// Cambiar contraseña
function cp(e) {
    e.preventDefault();
    let curr = document.getElementById('cpc').value;
    let newp = document.getElementById('cpn').value;
    
    if (S.u.password !== curr) {
        alert('Contraseña actual incorrecta');
        return;
    }
    if (newp.length < 3) {
        alert('Mínimo 3 caracteres');
        return;
    }
    
    let u = S.us.find(u => u.id === S.u.id);
    u.password = newp;
    S.u.password = newp;
    S.cp = false;
    sv();
    alert('✅ Contraseña cambiada');
    r();
}

// Render principal
function r() {
    let a = document.getElementById('app');
    
    if (S.v === 'login') {
        a.innerHTML = `
            <div class="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
                <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                    <h1 class="text-4xl font-bold text-blue-900 text-center mb-2">GestorFederal</h1>
                    <p class="text-gray-600 text-center mb-6">Sistema de Control de Tiempos</p>
                    <form onsubmit="login(event)" class="space-y-4">
                        <input type="text" id="u" placeholder="Usuario" required class="w-full px-4 py-3 border rounded-lg">
                        <input type="password" id="p" placeholder="Contraseña" required class="w-full px-4 py-3 border rounded-lg">
                        <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Ingresar</button>
                    </form>
                    <div class="mt-4 p-3 bg-gray-50 rounded text-sm">
                        <p>Prueba: <b>admin</b> / <b>admin123</b></p>
                    </div>
                </div>
            </div>
        `;
    } else if (S.v === 'admin') {
        a.innerHTML = `
            <div class="min-h-screen bg-gray-100">
                <nav class="bg-blue-900 text-white p-4">
                    <div class="container mx-auto flex justify-between items-center">
                        <h1 class="text-xl font-bold">GestorFederal - Admin</h1>
                        <div class="flex gap-2">
                            <button onclick="S.cp=true;r()" class="bg-blue-700 px-4 py-2 rounded hover:bg-blue-600">🔑</button>
                            <button onclick="logout()" class="bg-blue-700 px-4 py-2 rounded hover:bg-blue-600">Salir</button>
                        </div>
                    </div>
                </nav>
                ${S.cp ? `
                    <div class="container mx-auto p-4">
                        <div class="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
                            <h2 class="text-xl font-bold mb-4">🔑 Cambiar Contraseña</h2>
                            <form onsubmit="cp(event)" class="space-y-4">
                                <input type="password" id="cpc" placeholder="Contraseña actual" required class="w-full px-4 py-2 border rounded">
                                <input type="password" id="cpn" placeholder="Nueva contraseña" required class="w-full px-4 py-2 border rounded">
                                <div class="flex gap-2">
                                    <button type="submit" class="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">Guardar</button>
                                    <button type="button" onclick="S.cp=false;r()" class="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600">Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                ` : `
                    <div class="container mx-auto p-4">
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <button onclick="S.v='users';r()" class="bg-white p-6 rounded-lg shadow hover:shadow-lg">
                                <h3 class="font-bold">👥 Usuarios</h3>
                            </button>
                            <button onclick="S.v='actas';r()" class="bg-white p-6 rounded-lg shadow hover:shadow-lg">
                                <h3 class="font-bold">📄 Actas</h3>
                            </button>
                            <button onclick="S.v='bit';r()" class="bg-white p-6 rounded-lg shadow hover:shadow-lg">
                                <h3 class="font-bold">🏆 Bitácora</h3>
                            </button>
                            <button onclick="S.v='coms';r()" class="bg-white p-6 rounded-lg shadow hover:shadow-lg">
                                <h3 class="font-bold">📢 Comunicados</h3>
                            </button>
                        </div>
                        <div class="bg-white rounded-lg shadow p-6">
                            <h2 class="text-2xl font-bold mb-4">Estadísticas</h2>
                            <div class="grid grid-cols-3 gap-4">
                                <div class="bg-blue-50 p-4 rounded">
                                    <p class="text-sm text-gray-600">Usuarios</p>
                                    <p class="text-3xl font-bold text-blue-600">${S.us.length}</p>
                                </div>
                                <div class="bg-green-50 p-4 rounded">
                                    <p class="text-sm text-gray-600">Registros</p>
                                    <p class="text-3xl font-bold text-green-600">${S.rc.length}</p>
                                </div>
                                <div class="bg-purple-50 p-4 rounded">
                                    <p class="text-sm text-gray-600">Actas</p>
                                    <p class="text-3xl font-bold text-purple-600">${S.ac.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `}
            </div>
        `;
    }
    // Aquí irían las demás vistas (users, actas, bit, coms, bajo, alto)
    // Las agrego en el siguiente mensaje
}

// Cargar datos al inicio
ld();
r();
