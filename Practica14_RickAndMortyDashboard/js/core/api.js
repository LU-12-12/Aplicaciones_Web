
const BASE_URL = 'https://rickandmortyapi.com/api';

export async function getCharacters(page = 1, filters = {}) {
    let url = `${BASE_URL}/character/?page=${page}`;
    if (filters.name) url += `&name=${filters.name}`;
    if (filters.status && filters.status !== 'all') url += `&status=${filters.status}`;

    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error en la petición API:', error);
        return { error: 'No se pudieron cargar los personajes' };
    }
}
