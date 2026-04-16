/**
 * Organiza las actividades y las muestra en el DOM con estilo maximalista.
 * Este proyecto esta inspirado visualmente en el musical de Epic:The Musical.
 */
function processAndDisplay() {
    const activities = [ 
        { name: 'Snorkel', quantity: 5, category: 'Acuaticas' }, 
        { name: 'Kayak', quantity: 3, category: 'Acuaticas' }, 
        { name: 'Futbol', quantity: 2, category: 'Deportes' }, 
        { name: 'Kayak', quantity: 2, category: 'Acuaticas' }, 
        { name: 'Tenis', quantity: 4, category: 'Deportes' } 
    ];

    const activities2 = [ 
        { name: 'Tour', quantity: 10, category: 'Excursiones' }, 
        { name: 'Tour', quantity: 5, category: 'Excursiones' }, 
        { name: 'Pintura', quantity: 3, category: 'Arte' } 
    ];

    // Combinamos ambos arreglos para el despliegue final
    const allActivities = [...activities, ...activities2];
    const organized = organizeActivities(allActivities);
    
    renderResults(organized);
}

function organizeActivities(arr) {
    if (!arr || arr.length === 0) return {};
    return arr.reduce((acc, curr) => {
        const { name, quantity, category } = curr;
        if (!acc[category]) acc[category] = {};
        acc[category][name] = (acc[category][name] || 0) + quantity;
        return acc;
    }, {});
}

function renderResults(data) {
    const container = document.getElementById('resultados');
    container.innerHTML = ''; // Limpiar carga inicial

    for (const [category, acts] of Object.entries(data)) {
        const card = document.createElement('div');
        card.className = 'category-card';
        
        let html = `<h2 class="category-title">${category.toUpperCase()}</h2>`;
        
        for (const [name, qty] of Object.entries(acts)) {
            // Lógica de "Capacidad": Si hay más de 8 personas, la barra se vuelve "peligrosa"
            const statusClass = qty > 8 ? 'danger' : 'safe';
            const width = Math.min(qty * 10, 100); // Para que no se salga de la barra

            html += `
                <div class="activity-item">
                    <div class="activity-info">
                        <span>${name}</span>
                        <span>${qty} Inscritos</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${statusClass}" style="width: ${width}%"></div>
                    </div>
                </div>
            `;
        }
        
        card.innerHTML = html;
        container.appendChild(card);
    }
}

// Ejecutar al cargar la página
window.onload = processAndDisplay;