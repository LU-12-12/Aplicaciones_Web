import { store } from '../state/store.js';
import { getCharacters } from '../core/api.js';

export const dashboard = {
    elements: {
        grid: document.getElementById('charactersGrid'),
        favoritesList: document.getElementById('favoritesList'),
        search: document.getElementById('characterSearch'),
        filter: document.getElementById('statusFilter'),
        loader: document.getElementById('loader'),
        noResults: document.getElementById('noResults'),
        prevBtn: document.getElementById('prevPage'),
        nextBtn: document.getElementById('nextPage'),
        pageInfo: document.getElementById('pageInfo')
    },

    async init() {
        lucide.createIcons();
        this.setupEventListeners();
        await this.loadCharacters();
        this.renderFavorites();
    },

    setupEventListeners() {
        let timeout;
        this.elements.search.addEventListener('input', (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                store.state.filters.name = e.target.value.trim();
                store.state.currentPage = 1;
                this.loadCharacters();
            }, 500);
        });

        this.elements.filter.addEventListener('change', (e) => {
            store.state.filters.status = e.target.value;
            store.state.currentPage = 1;
            this.loadCharacters();
        });

        this.elements.prevBtn.addEventListener('click', () => {
            if (store.state.currentPage > 1) {
                store.state.currentPage--;
                this.loadCharacters();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });

        this.elements.nextBtn.addEventListener('click', () => {
            if (store.state.currentPage < store.state.totalPages) {
                store.state.currentPage++;
                this.loadCharacters();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    },

    //Solicitar personajes api
    async loadCharacters() {
        this.showLoader(true);
        this.elements.noResults.classList.add('hidden');

        const data = await getCharacters(store.state.currentPage, store.state.filters);

        if (data.error || !data.results) {
            store.state.characters = [];
            store.state.totalPages = 0;
            this.elements.noResults.classList.remove('hidden');
        } else {
            store.state.characters = data.results;
            store.state.totalPages = data.info.pages;
        }

        this.renderGrid();
        this.updatePagination();
        this.showLoader(false);
    },

    //dibujar cuadrícula
    renderGrid() {
        const cards = this.elements.grid.querySelectorAll('.character-card');
        cards.forEach(c => c.remove());
        store.state.characters.forEach(char => {
            const isFav = store.isFavorite(char.id);
            const card = document.createElement('div');
            card.className = 'character-card';
            card.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="${char.image}" alt="${char.name}" loading="lazy">
                </div>
                <div class="card-content">
                    <h3 class="character-name">${char.name}</h3>
                    <div class="status-label status-${char.status.toLowerCase()}">
                        <span class="status-indicator"></span>
                        ${char.status}
                    </div>
                    <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${char.id}">
                        <i data-lucide="star"></i>
                        <span>${isFav ? 'En Favoritos' : 'Añadir a Favoritos'}</span>
                    </button>
                </div>
            `;


            card.querySelector('.fav-btn').addEventListener('click', (e) => {
                const btn = e.currentTarget;
                const added = store.toggleFavorite(char);

                btn.classList.toggle('active', added);
                btn.querySelector('span').textContent = added ? 'En Favoritos' : 'Añadir a Favoritos';

                this.renderFavorites();
                lucide.createIcons();
            });

            this.elements.grid.appendChild(card);
        });

        lucide.createIcons();
    },

    //favoritos
    renderFavorites() {
        const { favoritesList } = this.elements;

        if (store.state.favorites.length === 0) {
            favoritesList.innerHTML = `
                <div class="empty-favorites">
                    <p>No hay favoritos aún</p>
                </div>
            `;
            return;
        }

        favoritesList.innerHTML = '';
        store.state.favorites.forEach(fav => {
            const item = document.createElement('div');
            item.className = 'fav-item';
            item.innerHTML = `
                <img src="${fav.image}" alt="${fav.name}">
                <div class="fav-item-info">
                    <p class="fav-item-name">${fav.name}</p>
                </div>
                <button class="remove-fav" data-id="${fav.id}">
                    <i data-lucide="x"></i>
                </button>
            `;

            item.querySelector('.remove-fav').addEventListener('click', () => {
                store.toggleFavorite(fav);
                this.renderFavorites();
                this.renderGrid();
            });

            favoritesList.appendChild(item);
        });

        lucide.createIcons();
    },

    updatePagination() {
        this.elements.prevBtn.disabled = store.state.currentPage <= 1;
        this.elements.nextBtn.disabled = store.state.currentPage >= store.state.totalPages;
        this.elements.pageInfo.textContent = `Página ${store.state.currentPage} de ${store.state.totalPages || 1}`;
    },

    showLoader(show) {
        this.elements.loader.classList.toggle('hidden', !show);
    }
};
