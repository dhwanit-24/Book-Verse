/* ============================================
   CART PAGE JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    renderCart();
    initPromoCode();
});

/* ============================================
   RENDER CART
   ============================================ */
function renderCart() {
    const cartContainer = document.querySelector('.cart-items');
    const cart = JSON.parse(localStorage.getItem('bookstore_cart')) || [];

    if (cart.length === 0) {
        renderEmptyCart();
        return;
    }

    let html = `
        <div class="cart-items-header">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Subtotal</span>
            <span></span>
        </div>
    `;

    html += cart.map(item => renderCartItem(item)).join('');
    
    cartContainer.innerHTML = html;
    updateCartSummary();
}

function renderCartItem(item) {
    const subtotal = item.price * item.quantity;
    
    return `
        <div class="cart-item" data-item-id="${item.id}">
            <div class="cart-product">
                <div class="cart-product-image">
                    <div class="cart-book-cover" style="background: linear-gradient(145deg, ${item.color || '#0d5c63'}, ${adjustColor(item.color || '#0d5c63', -30)})"></div>
                </div>
                <div class="cart-product-details">
                    <h4><a href="book-detail.html?id=${item.id}">${item.title}</a></h4>
                    <p class="cart-product-author">by ${item.author}</p>
                    <span class="cart-product-format">Hardcover</span>
                </div>
            </div>
            <div class="cart-price">
                ${BookStore.formatPrice(item.price)}
            </div>
            <div class="cart-quantity">
                <div class="cart-qty-control">
                    <button class="cart-qty-btn" onclick="updateItemQuantity('${item.id}', ${item.quantity - 1})">−</button>
                    <span class="cart-qty-value">${item.quantity}</span>
                    <button class="cart-qty-btn" onclick="updateItemQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
            </div>
            <div class="cart-subtotal">
                ${BookStore.formatPrice(subtotal)}
            </div>
            <button class="cart-remove-btn" onclick="removeItem('${item.id}')" title="Remove item">
                ✕
            </button>
        </div>
    `;
}

function renderEmptyCart() {
    const cartLayout = document.querySelector('.cart-layout');
    if (!cartLayout) return;

    cartLayout.innerHTML = `
        <div class="empty-cart">
            <div class="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any books yet. Start exploring our collection!</p>
            <a href="catalog.html" class="btn btn-primary btn-lg">Browse Books</a>
        </div>
    `;
}

/* ============================================
   CART OPERATIONS
   ============================================ */
function updateItemQuantity(itemId, newQuantity) {
    if (newQuantity < 1) {
        removeItem(itemId);
        return;
    }

    let cart = JSON.parse(localStorage.getItem('bookstore_cart')) || [];
    const item = cart.find(i => i.id === itemId);
    
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('bookstore_cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }
}

function removeItem(itemId) {
    let cart = JSON.parse(localStorage.getItem('bookstore_cart')) || [];
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('bookstore_cart', JSON.stringify(cart));
    
    BookStore.showNotification('Item removed from cart', 'info');
    renderCart();
    updateCartCount();
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.setItem('bookstore_cart', JSON.stringify([]));
        BookStore.showNotification('Cart cleared', 'info');
        renderCart();
        updateCartCount();
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('bookstore_cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
        el.style.display = totalItems > 0 ? 'flex' : 'none';
    });

    // Update header badge
    const headerBadge = document.querySelector('.cart-count-badge');
    if (headerBadge) {
        headerBadge.textContent = `${totalItems} items`;
    }
}

/* ============================================
   CART SUMMARY
   ============================================ */
let appliedPromo = null;

function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('bookstore_cart')) || [];
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 40.00;
    const discount = appliedPromo ? subtotal * appliedPromo.discount : 0;
    const total = subtotal + shipping - discount;

    // Update summary values
    updateElement('.summary-subtotal', BookStore.formatPrice(subtotal));
    updateElement('.summary-shipping', shipping === 0 ? 'FREE' : BookStore.formatPrice(shipping));
    updateElement('.summary-total-value', BookStore.formatPrice(total));

    // Show/hide discount row
    const discountRow = document.querySelector('.summary-row.discount');
    if (discountRow) {
        if (appliedPromo) {
            discountRow.style.display = 'flex';
            discountRow.querySelector('.summary-value').textContent = '-' + BookStore.formatPrice(discount);
        } else {
            discountRow.style.display = 'none';
        }
    }

    // Free shipping message
    const shippingMessage = document.querySelector('.shipping-message');
    if (shippingMessage) {
        if (shipping === 0) {
            shippingMessage.innerHTML = '🎉 You qualify for <strong>FREE shipping!</strong>';
            shippingMessage.style.color = '#10b981';
        } else {
            const remaining = 50 - subtotal;
            shippingMessage.innerHTML = `Add <strong>${BookStore.formatPrice(remaining)}</strong> more for free shipping`;
            shippingMessage.style.color = '';
        }
    }
}

function updateElement(selector, content) {
    const el = document.querySelector(selector);
    if (el) el.textContent = content;
}

/* ============================================
   PROMO CODE
   ============================================ */
const promoCodes = {
    'SAVE10': { discount: 0.10, description: '10% off' },
    'BOOKS20': { discount: 0.20, description: '20% off' },
    'WELCOME': { discount: 0.15, description: '15% off for new customers' }
};

function initPromoCode() {
    const promoForm = document.querySelector('.promo-form');
    if (!promoForm) return;

    promoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const input = this.querySelector('.promo-input');
        const code = input.value.trim().toUpperCase();
        
        if (promoCodes[code]) {
            appliedPromo = { code, ...promoCodes[code] };
            showPromoApplied(code, promoCodes[code].description);
            updateCartSummary();
            BookStore.showNotification(`Promo code applied: ${promoCodes[code].description}`, 'success');
            input.value = '';
        } else {
            BookStore.showNotification('Invalid promo code', 'error');
        }
    });
}

function showPromoApplied(code, description) {
    const container = document.querySelector('.promo-section');
    if (!container) return;

    const appliedHtml = `
        <div class="promo-applied">
            <span class="promo-code">
                <span>🏷️</span>
                <span>${code} - ${description}</span>
            </span>
            <button class="promo-remove" onclick="removePromo()">✕</button>
        </div>
    `;

    // Add after form
    const existingApplied = container.querySelector('.promo-applied');
    if (existingApplied) {
        existingApplied.outerHTML = appliedHtml;
    } else {
        container.insertAdjacentHTML('beforeend', appliedHtml);
    }
}

function removePromo() {
    appliedPromo = null;
    const appliedEl = document.querySelector('.promo-applied');
    if (appliedEl) appliedEl.remove();
    updateCartSummary();
    BookStore.showNotification('Promo code removed', 'info');
}

/* ============================================
   CHECKOUT
   ============================================ */
function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('bookstore_cart')) || [];
    
    if (cart.length === 0) {
        BookStore.showNotification('Your cart is empty', 'error');
        return;
    }

    // In a real app, this would redirect to checkout
    BookStore.showNotification('Redirecting to checkout...', 'success');
    
    // Simulate checkout redirect
    setTimeout(() => {
        alert('This is a demo. In a real application, you would be redirected to the checkout page.');
    }, 1000);
}

// Attach to window for inline onclick
window.proceedToCheckout = proceedToCheckout;
window.clearCart = clearCart;
window.removePromo = removePromo;

/* ============================================
   UTILITIES
   ============================================ */
function adjustColor(hex, amount) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}
