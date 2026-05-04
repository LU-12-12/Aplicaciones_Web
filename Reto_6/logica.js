// ==========================================
// ESTADO DEL JUEGO (State)
// ==========================================
// Guardamos las coordenadas de la serpiente en un arreglo.
// El índice 0 siempre representa la posición de la cabeza.
let serpiente = [
    { r: 2, c: 0 }, // Cabeza (O)
    { r: 3, c: 0 }, // Cuerpo (o)
    { r: 4, c: 0 }  // Cola (o)
];

// Coordenadas actuales del objetivo a comer
let raton = { r: 1, c: 0 };

// Dimensiones estáticas del tablero
const filas = 5;
const columnas = 5;

// Bandera para detener la ejecución si hay una colisión
let gameOver = false; 

/**
 * Genera la matriz de la cuadrícula y la renderiza en el DOM.
 * Convierte las coordenadas del estado actual en caracteres visuales.
 */
function renderBoard() {
    const boardContainer = document.getElementById('board-display');
    
    // 1. Inicializar tablero vacío llenándolo de caracteres '·'
    let nuevoTablero = [];
    for (let i = 0; i < filas; i++) {
        nuevoTablero.push(new Array(columnas).fill('·'));
    }

    // 2. Posicionar el ratón si aún no ha sido comido
    if (raton !== null) {
        nuevoTablero[raton.r][raton.c] = 'M';
    }

    // 3. Posicionar la serpiente iterando sobre su arreglo de coordenadas
    serpiente.forEach((segmento, index) => {
        // Validación de seguridad para no intentar dibujar fuera de los límites
        if (segmento.r >= 0 && segmento.r < filas && segmento.c >= 0 && segmento.c < columnas) {
            if (index === 0) {
                nuevoTablero[segmento.r][segmento.c] = 'O'; // Renderiza la cabeza
            } else {
                nuevoTablero[segmento.r][segmento.c] = 'o'; // Renderiza el cuerpo
            }
        }
    });

    // 4. Transformar la matriz 2D en una cadena de texto HTML
    boardContainer.innerHTML = nuevoTablero.map(fila => fila.join('')).join('<br>');
}

/**
 * Procesa el input del usuario, calcula la lógica de colisión y actualiza el estado.
 * @param {string} mov - Dirección de movimiento esperada ('U', 'D', 'L', 'R').
 */
function executeMove(mov) {
    const resultSpan = document.getElementById('resultado');

    // Bloquear controles si el juego ya terminó
    if (gameOver) {
        resultSpan.textContent = "JUEGO TERMINADO. RECARGA LA PÁGINA.";
        return;
    }

    // PASO 1: Calcular el vector del próximo movimiento basado en la cabeza actual
    let cabezaActual = serpiente[0];
    let nuevaFila = cabezaActual.r;
    let nuevaCol = cabezaActual.c;

    if (mov === 'U') nuevaFila -= 1;
    else if (mov === 'D') nuevaFila += 1;
    else if (mov === 'L') nuevaCol -= 1;
    else if (mov === 'R') nuevaCol += 1;

    // PASO 2: Detección de colisión contra los bordes (Out of Bounds)
    if (nuevaFila < 0 || nuevaFila >= filas || nuevaCol < 0 || nuevaCol >= columnas) {
        gameOver = true;
        resultSpan.style.color = '#ff4d4d';
        resultSpan.textContent = "CRASH - Colisión con el borde del tablero";
        renderBoard(); // Render final para mostrar por dónde salió
        return;
    }

    // PASO 3: Detección de colisión contra el propio cuerpo
    let chocaConCuerpo = serpiente.some((segmento, index) => {
        // Se excluye el último segmento (cola) porque en un movimiento normal 
        // ese espacio quedará libre antes de que la cabeza lo ocupe.
        if (index === serpiente.length - 1) return false; 
        return segmento.r === nuevaFila && segmento.c === nuevaCol;
    });

    if (chocaConCuerpo) {
        gameOver = true;
        resultSpan.style.color = '#ff4d4d';
        resultSpan.textContent = "CRASH - Colisión con el cuerpo de la serpiente";
        return;
    }

    // PASO 4: Ejecutar el movimiento en la estructura de datos
    // Insertamos la nueva posición al inicio del arreglo.
    serpiente.unshift({ r: nuevaFila, c: nuevaCol });

    // PASO 5: Evaluar interacciones con el ratón (Comida)
    let comioRaton = (raton !== null && nuevaFila === raton.r && nuevaCol === raton.c);

    if (comioRaton) {
        // Si come, el ratón se elimina. 
        // No extraemos la cola del arreglo, lo que aumenta la longitud de la serpiente en 1.
        raton = null; 
        resultSpan.style.color = '#4dff88';
        resultSpan.textContent = "EAT - Ratón consumido. La serpiente crece.";
    } else {
        // Si el movimiento es normal, extraemos el último elemento para mantener la misma longitud.
        serpiente.pop();
        resultSpan.style.color = 'var(--loki-gold)';
        resultSpan.textContent = "NONE - Movimiento regular.";
    }

    // Renderizar los cambios en la interfaz
    renderBoard();
}

// Inicialización
renderBoard();