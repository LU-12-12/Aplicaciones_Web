/**
 * SISTEMA ESPIRITUAL DE PHANTUMP
 * Razonamiento: 
 * 1. Controlamos la transición del Pokémon con 'load'.
 * 2. Ejecutamos la cadena de ejercicios con la tecla 'F'.
 */

// --- 1. TRANSICIÓN INICIAL ---
window.addEventListener('load', () => {
    const phantump = document.getElementById('phantump-loader');
    const container = document.querySelector('.mistic-container');

    // Tiempo de "manifestación" antes de moverse a la esquina
    setTimeout(() => {
        phantump.classList.remove('center');
        phantump.classList.add('corner');
        
        // Revelamos la interfaz del ritual
        container.style.opacity = "1";
        container.style.transform = "scale(1)";
    }, 2500);
});

// --- 2. ACTIVACIÓN DEL RITUAL POR TECLADO ---
window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f') {
        ejecutarGrimorio();
    }
});

function ejecutarGrimorio() {
    console.clear();
    console.log("--- 🪵 EL TOCÓN SAGRADO RESPONDE A LA TECLA 'F' ---");

    // EJERCICIO 1: Temporizador
    console.log("🕯️ Invocando sabiduría ancestral... (3s)");
    setTimeout(() => {
        console.log("🍂 Mensaje espiritual recibido.");

        // EJERCICIO 2: Operación Matemática
        matematicasEspirituales(25, 17, (resultado) => {
            console.log(`🔥 El fuego fatuo revela la suma de energías: ${resultado}`);

            // EJERCICIO 3: Receta de Poción (Secuencial)
            console.log("--- INICIANDO ALQUIMIA DE BOSQUE ---");
            cortarRaices(() => {
                destilarEsencia(() => {
                    console.log("3. 🧪 ¡Poción de Sombra terminada!");
                    console.log("-----------------------------------------");
                });
            });
        });
    }, 3000);
}

// --- FUNCIONES DE APOYO ---

function matematicasEspirituales(a, b, callback) {
    callback(a + b);
}

function cortarRaices(done) {
    console.log("1. Picando raíces retorcidas... (2s)");
    setTimeout(() => {
        console.log("✅ Raíces listas.");
        done();
    }, 2000);
}

function destilarEsencia(done) {
    console.log("2. Destilando esencia espectral... (3s)");
    setTimeout(() => {
        console.log("✅ Esencia purificada.");
        done();
    }, 3000);
}