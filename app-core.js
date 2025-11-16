// Archivo: app-core.js
console.log("CORE JS CARGADO");


const USERS = [
{ user: "admin", pass: "1234", role: "admin" },
{ user: "alto1", pass: "1234", role: "alto" },
{ user: "medio1", pass: "1234", role: "medio" },
{ user: "basico1", pass: "1234", role: "basico" }
];


function saveUserSession(user){ localStorage.setItem("currentUser", JSON.stringify(user)); }
function getUserSession(){ return JSON.parse(localStorage.getItem("currentUser")); }
function logout(){ localStorage.removeItem("currentUser"); window.location.href = "index.html"; }


if (window.location.pathname.includes("dashboard")){
const user = getUserSession();
if(!user) window.location.href = "index.html";
}


const loginForm = document.getElementById("loginForm");
if (loginForm){
loginForm.addEventListener("submit", e => {
e.preventDefault();
const u = document.getElementById("username").value;
const p = document.getElementById("password").value;


const found = USERS.find(x => x.user === u && x.pass === p);


if(found){ saveUserSession(found); window.location.href = "dashboard.html"; }
else document.getElementById("loginError").classList.remove("hidden");
});
}
