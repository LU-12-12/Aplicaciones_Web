// --- 1. FONDO DE LLUVIA MATRIX ---
const canvas = document.getElementById('canvasRain');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*";
const drops = Array(Math.floor(canvas.width/16)).fill(1);

function drawRain() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00ff41";
    drops.forEach((y, i) => {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 16, y * 16);
        if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    });
}
setInterval(drawRain, 35);

// --- 2. LÓGICA DE DESCRIPTADO ---
function decodeFilename(filename) {
    const regex = /^\d+_(.*)\.[^.]+$/;
    const match = filename.match(regex);
    return match ? match[1] : "ERROR_DE_SINTAXIS";
}

// --- 3. FUNCIONALIDAD DIVERTIDA: ANALIZADOR DE RIESGO ---
function analyzeRisk(filename) {
    const dangerExtensions = ['exe', 'bat', 'sh', 'tmp', 'backup'];
    const ext = filename.split('.').pop().toLowerCase();
    
    let risk = Math.floor(Math.random() * 40) + 10; // Riesgo base
    if (dangerExtensions.includes(ext)) risk += 50;
    if (filename.length > 30) risk += 10;

    return Math.min(risk, 100);
}

// --- 4. INTERACCIÓN Y EFECTOS ---
const btn = document.getElementById('decodeBtn');
const log = document.getElementById('logTerminal');

function addLog(msg) {
    const p = document.createElement('p');
    p.innerText = `> ${msg}`;
    log.prepend(p);
}

btn.addEventListener('click', () => {
    const input = document.getElementById('filenameInput').value;
    const resultDiv = document.getElementById('resultDisplay');
    const riskText = document.getElementById('riskLevel');
    const riskBar = document.getElementById('riskBar');

    if (!input) return addLog("ERROR: NO SE DETECTARON DATOS DE ENTRADA");

    // Reiniciar interfaz
    resultDiv.innerText = "DESCIFRANDO...";
    addLog(`ANALIZANDO: ${input.substring(0,15)}...`);

    setTimeout(() => {
        const decoded = decodeFilename(input);
        const risk = analyzeRisk(input);

        // Efecto Typewriter para el nombre
        resultDiv.innerText = "";
        let i = 0;
        const type = () => {
            if (i < decoded.length) {
                resultDiv.innerText += decoded[i++];
                setTimeout(type, 50);
            }
        };
        type();

        // Actualizar Riesgo
        riskBar.style.width = risk + "%";
        riskText.innerText = risk > 70 ? "CRÍTICO" : risk > 40 ? "ADVERTENCIA" : "SEGURO";
        riskBar.style.background = risk > 70 ? "#ff003c" : "#00ff41";
        
        addLog(`EXTRACCIÓN EXITOSA. RIESGO: ${risk}%`);
    }, 800);
});

// Reloj en tiempo real
setInterval(() => {
    document.getElementById('timestamp').innerText = new Date().toLocaleTimeString();
}, 1000);