
const API_URL = 'https://dummyjson.com/products/category/beauty';
const CART_KEY = 'glowgrace_cart';

let allProducts = [];  
let cart = [];         

//carga, guarda y actualiza el carrito
function loadCart() {
    const stored = localStorage.getItem(CART_KEY);
    cart = stored ? JSON.parse(stored) : [];
    updateCartCounter();
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartCounter() {
    const counter = document.getElementById('cart-counter');
    if (counter) {
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        counter.textContent = totalItems;
    }
}

async function fetchProducts() {
    const grid = document.getElementById('products-grid');

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        allProducts = data.products;

        renderProducts(allProducts);

    } catch (error) {
        console.error('Error al obtener productos:', error);
        grid.innerHTML = `
            <div class="loader" style="color: #ef4444;">
                ⚠️ No se pudieron cargar los productos. Intenta de nuevo más tarde.
            </div>`;
    }
}

//tarjetas
function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = `
            <div class="loader" style="color: var(--text-muted);">
                No se encontraron productos para tu búsqueda.
            </div>`;
        return;
    }

    products.forEach(product => {
        const salePrice = product.price.toFixed(2);
        const originalPrice = (product.price * 1.25).toFixed(2);

        const card = document.createElement('div');
        card.classList.add('product-card');
        card.dataset.id = product.id;

        card.innerHTML = `
            <span class="sale-badge">Oferta</span>
            <img
                src="${product.thumbnail}"
                alt="${product.title}"
                class="product-image"
                loading="lazy"
                onerror="this.src='https://placehold.co/300x300/f4dada/2d2d2d?text=GLOW'"
            >
            <div class="product-info">
                <h3>${product.title}</h3>
                <div class="price-container">
                    <span class="old-price">$${originalPrice}</span>
                    <span class="product-price">$${salePrice}</span>
                </div>
                <button class="btn-primary full-width add-to-cart-btn" data-id="${product.id}">
                    Agregar al carrito
                </button>
            </div>
        `;

        grid.appendChild(card);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
    attachAddToCartListeners();
}

//Agregar al carrito
function attachAddToCartListeners() {
    const buttons = document.querySelectorAll('.add-to-cart-btn');

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.dataset.id);
            addToCart(productId);
        });
    });
}

function addToCart(id) {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            quantity: 1,
        });
    }

    saveCart();
    updateCartCounter();

    const goToCart = window.confirm(
        `✅ "${product.title}" fue agregado al carrito.\n\n¿Deseas ir al carrito ahora?`
    );

    if (goToCart) {
        window.location.href = 'cart.html';
    }
}

//busqueda
function setupSearch() {
    const searchInput = document.getElementById('product-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();

        if (query === '') {
            renderProducts(allProducts);
            return;
        }

        const filtered = allProducts.filter(product =>
            product.title.toLowerCase().includes(query)
        );

        renderProducts(filtered);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    fetchProducts();
    setupSearch(); 
});
