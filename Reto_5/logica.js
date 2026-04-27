/**
 * Lógica mejorada con validación y visualización dinámica.
 */

// Función principal de organización con validación 
function organizeShoes(shoes) {
    // Validación de integridad
    if (!Array.isArray(shoes)) {
        return { error: "DATA_CORRUPT", pairs: [] };
    }

    const inventory = {};
    const pairs = [];

    for (const shoe of shoes) {
        // Ignorar botas dañadas o sin datos
        if (!shoe.size || !['I', 'R'].includes(shoe.type)) {
            continue;
        }

        const { type, size } = shoe;
        if (!inventory[size]) inventory[size] = { I: 0, R: 0 };

        const opposite = type === 'I' ? 'R' : 'I';

        if (inventory[size][opposite] > 0) {
            pairs.push(size);
            inventory[size][opposite]--;
        } else {
            inventory[size][type]++;
        }
    }
    return { error: null, pairs };
}

// Función para simular el proceso
async function iniciarProtocolo() {
    const logs = document.getElementById('logs');
    const bootGrid = document.getElementById('boot-visuals');
    const finalResult = document.getElementById('final-result');

    // Datos de prueba
    const shoesData = [
        { type: 'I', size: 38 }, { type: 'R', size: 38 },
        { type: 'I', size: 42 }, { type: 'X', size: 99 }, // Corrupta
        { type: 'I', size: 38 }, { type: 'R', size: 38 },
        { type: 'R', size: 42 }
    ];

    // Limpiar interfaz
    logs.innerHTML = "> Iniciando escaneo de Mark LXXXV...";
    bootGrid.innerHTML = "";
    
    // Simular escaneo bota por bota
    for (const shoe of shoesData) {
        await new Promise(r => setTimeout(r, 400)); // Delay para efecto visual
        
        // Crear bota visualmente solo si es válida
        if (['I', 'R'].includes(shoe.type)) {
            const div = document.createElement('div');
            div.className = `boot-card ${shoe.type}`;
            div.innerHTML = `<span>${shoe.type}</span><span>${shoe.size}</span>`;
            bootGrid.appendChild(div);
            logs.innerHTML += `<br>> Detectada bota ${shoe.type} talla ${shoe.size}`;
        } else {
            logs.innerHTML += `<br><span style="color:red">> ERROR: Bota corrupta omitida</span>`;
        }
        logs.scrollTop = logs.scrollHeight;
    }

    // Ejecutar lógica final
    const resultado = organizeShoes(shoesData);
    
    await new Promise(r => setTimeout(r, 800));
    logs.innerHTML += `<br>> Escaneo finalizado. Pares optimizados.`;
    finalResult.innerHTML = `PARES LISTOS: [ ${resultado.pairs.join(', ')} ]`;
    finalResult.style.color = "var(--stark-gold)";
}