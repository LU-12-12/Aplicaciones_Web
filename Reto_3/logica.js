/**
 * Lógica Maestra: Mural de Fondo de Bikini
 * Razonamiento: 
 * 1. Usamos un objeto literal para encapsular la funcionalidad.
 * 2. Manipulamos el DOM dinámicamente para que el HTML sea mínimo.
 * 3. Implementamos un evento 'input' para actualización en tiempo real.
 */

const MuralApp = {
    // Genera el string del marco basado en las reglas del reto
    createFrameString: function(names) {
        if (!names || names.length === 0) return "¡Escribe algo, Patricio!";

        // Encontramos el largo máximo para definir la anchura del barco
        const maxLength = Math.max(...names.map(n => n.trim().length));
        const totalWidth = maxLength + 4; // Borde + Espacio + Texto + Espacio + Borde

        const border = "*".repeat(totalWidth);
        const rows = names.map(name => {
            const cleanName = name.trim();
            // padEnd asegura que el texto se alinee a la izquierda y rellene el resto
            const padded = cleanName.padEnd(maxLength, " ");
            return `* ${padded} *`;
        });

        return [border, ...rows, border].join("\n");
    },

    // Actualiza la visualización del mural en el DOM
    render: function() {
        const input = document.getElementById('lugares-input');
        const display = document.getElementById('mural-display');
        
        // Convertimos el input en arreglo filtrando entradas vacías
        const nombres = input.value.split(',').filter(n => n.trim() !== "");
        
        // Inyectamos el texto
        display.textContent = this.createFrameString(nombres);

        // Feedback visual: Animación de "sacudida" al actualizar
        display.style.animation = 'none';
        display.offsetHeight; // Forzar reflow para reiniciar animación
        display.style.animation = 'shake 0.3s ease-out';
    }
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos el contenedor principal
    const card = document.querySelector('.card');

    // 1. Creamos el Input de forma dinámica para control total del estilo
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'input-wrapper';
    inputWrapper.innerHTML = `
        <label for="lugares-input">📝 Lugares visitados:</label>
        <input type="text" id="lugares-input" placeholder="Playa, Piña, Laguna..." autocomplete="off">
        <p class="hint">Escribe nombres separados por comas</p>
    `;
    
    // Insertamos antes del área de visualización
    const display = document.getElementById('mural-display');
    card.insertBefore(inputWrapper, display);

    // 2. Event listener para interactividad instantánea
    document.getElementById('lugares-input').addEventListener('input', () => {
        MuralApp.render();
    });

    // 3. Render inicial con el ejemplo del reto
    document.getElementById('lugares-input').value = "Playa, Cabañas, Snorkel";
    MuralApp.render();
});