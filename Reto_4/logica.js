/**
 * LÓGICA DE CONSTRUCCIÓN ASÍNCRONA
 * Para mejorar la experiencia, la torre se construye nivel por nivel.
 * Se utiliza async/await para manejar las pausas de tiempo (efecto carga).
 */

async function startEnergySurge() {
    // 1. OBTENCIÓN DE DATOS Y RESET
    const display = document.getElementById('tower-display');
    const height = parseInt(document.getElementById('height-input').value) || 5;
    const symbol = document.getElementById('symbol-input').value || '*';
    
    // Limpiamos el estado anterior
    display.textContent = "INICIALIZANDO...";
    display.classList.remove('energy-active');
    
    // El ancho máximo define el lienzo de la torre
    const maxWidth = 2 * height - 1;
    let towerLines = [];

    // Pequeña pausa antes de empezar
    await new Promise(r => setTimeout(r, 400));

    // 2. CONSTRUCCIÓN DE NIVELES (TRIÁNGULO)
    for (let i = 1; i <= height; i++) {
        const energyCount = 2 * i - 1;
        const paddingSide = (maxWidth - energyCount) / 2;
        
        const line = "_".repeat(paddingSide) + symbol.repeat(energyCount) + "_".repeat(paddingSide);
        
        towerLines.push(line);
        display.textContent = towerLines.join("\n");
        
        // Retraso de 80ms para efecto de "escaneo/construcción"
        await new Promise(r => setTimeout(r, 80));
    }

    // 3. CONSTRUCCIÓN DEL NÚCLEO (#)
    const corePadding = (maxWidth - 1) / 2;
    const coreLine = "_".repeat(corePadding) + "#" + "_".repeat(corePadding);

    for (let j = 0; j < 2; j++) {
        towerLines.push(coreLine);
        display.textContent = towerLines.join("\n");
        await new Promise(r => setTimeout(r, 100));
    }

    // 4. ACTIVACIÓN FINAL
    // Una vez completado, el texto comienza a brillar
    display.classList.add('energy-active');
    console.log("Despliegue finalizado: Estructura estable.");
}