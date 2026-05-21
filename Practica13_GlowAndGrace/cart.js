const CART_KEY = 'glowgrace_cart';
const CARTS_API = 'https://dummyjson.com/carts/add';

let cart = [];

//Cargar y guardar carrito
function loadCart() {
    const stored = localStorage.getItem(CART_KEY);
    cart = stored ? JSON.parse(stored) : [];
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}



function getCartTotals() {
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return { count, total };
}

//items
function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const summaryCount = document.getElementById('summary-count');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');
    const confirmBtn = document.getElementById('confirm-btn');

    if (!container) return;

    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                <p style="font-size: 1.2rem; margin-bottom: 1rem;">Tu carrito está vacío 🛒</p>
                <a href="index.html" class="btn-primary" style="text-decoration: none; padding: 0.8rem 2rem; display: inline-block;">
                    Explorar productos
                </a>
            </div>`;

        if (confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.5';
            confirmBtn.style.cursor = 'not-allowed';
        }

        if (summaryCount) summaryCount.textContent = '0';
        if (summarySubtotal) summarySubtotal.textContent = '$0.00';
        if (summaryTotal) summaryTotal.textContent = '$0.00';
        return;
    }

    if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.style.opacity = '1';
        confirmBtn.style.cursor = 'pointer';
    }

    cart.forEach(item => {
        const itemTotal = (item.price * item.quantity).toFixed(2);

        const itemEl = document.createElement('div');
        itemEl.classList.add('cart-item');
        itemEl.innerHTML = `
            <img
                src="${item.thumbnail}"
                alt="${item.title}"
                onerror="this.src='https://placehold.co/60x60/f4dada/2d2d2d?text=G'"
            >
            <div class="cart-item-info">
                <h4>${item.title}</h4>
                <p>$${item.price.toFixed(2)} × ${item.quantity} = <strong>$${itemTotal}</strong></p>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
                    <button class="qty-btn" data-action="decrease" data-id="${item.id}" 
                        style="width:28px;height:28px;border:1px solid #e2e8f0;background:#f8fafc;cursor:pointer;font-size:1rem;border-radius:4px;">
                        −
                    </button>
                    <span style="min-width: 1.5rem; text-align: center; font-weight: 600;">${item.quantity}</span>
                    <button class="qty-btn" data-action="increase" data-id="${item.id}"
                        style="width:28px;height:28px;border:1px solid #e2e8f0;background:#f8fafc;cursor:pointer;font-size:1rem;border-radius:4px;">
                        +
                    </button>
                </div>
            </div>
            <button class="delete-btn" data-id="${item.id}" title="Eliminar producto">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6l-1 14H6L5 6"></path>
                    <path d="M10 11v6M14 11v6"></path>
                    <path d="M9 6V4h6v2"></path>
                </svg>
            </button>
        `;

        container.appendChild(itemEl);
    });

    const { count, total } = getCartTotals();
    if (summaryCount) summaryCount.textContent = count;
    if (summarySubtotal) summarySubtotal.textContent = `$${total.toFixed(2)}`;
    if (summaryTotal) summaryTotal.textContent = `$${total.toFixed(2)}`;
    attachItemListeners();
}

//Eventos items
function attachItemListeners() {
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            removeFromCart(id);
        });
    });

    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            const action = e.currentTarget.dataset.action;
            updateQuantity(id, action);
        });
    });
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCartItems();
}

function updateQuantity(id, action) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    if (action === 'increase') {
        item.quantity += 1;
    } else if (action === 'decrease') {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart = cart.filter(i => i.id !== id);
        }
    }

    saveCart();
    renderCartItems();
}

//Checkout
async function processCheckout(email, phone) {
    const confirmBtn = document.getElementById('confirm-btn');

    confirmBtn.textContent = 'Procesando...';
    confirmBtn.disabled = true;

    //Usuario fake
    const payload = {
        userId: 1,
        products: cart.map(item => ({
            id: item.id,
            quantity: item.quantity,
        })),
        clientEmail: email,
        clientPhone: phone,
    };

    try {
        const response = await fetch(CARTS_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const data = await response.json();
        console.log('Respuesta de la API:', data);

        const { count, total } = getCartTotals();
        window.alert(
            `Compra confirmada\n\n` +
            `Productos: ${count}\n` +
            `Total: $${total.toFixed(2)}\n` +
            `Confirmación enviada a: ${email}\n\n` +
            `¡Gracias por tu compra en GLOW & GRACE!`
        );

        cart = [];
        saveCart();
        renderCartItems();

        document.getElementById('checkout-email').value = '';
        document.getElementById('checkout-phone').value = '';

    } catch (error) {
        console.error('Error en el checkout:', error);
        window.alert(
            `⚠️ Hubo un problema al procesar tu compra.\n\nError: ${error.message}\n\nIntenta de nuevo.`
        );
    } finally {
        confirmBtn.textContent = 'Confirmar Compra';
        confirmBtn.disabled = false;
    }
}

function setupCheckoutForm() {
    const confirmBtn = document.getElementById('confirm-btn');
    const emailInput = document.getElementById('checkout-email');
    const phoneInput = document.getElementById('checkout-phone');

    if (!confirmBtn) return;

    confirmBtn.addEventListener('click', () => {
        const email = emailInput ? emailInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';

        if (!email || !phone) {
            window.alert('⚠️ Por favor completa todos los campos antes de confirmar.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            window.alert('⚠️ Por favor ingresa un correo electrónico válido.');
            return;
        }

        if (cart.length === 0) {
            window.alert('⚠️ Tu carrito está vacío. Agrega productos antes de confirmar.');
            return;
        }

        processCheckout(email, phone);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderCartItems();
    setupCheckoutForm();
});
