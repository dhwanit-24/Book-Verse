/* ============================================
   BOOKSTORE - COMMON JAVASCRIPT
   ============================================ */

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initHeader();
    initMobileMenu();
    initCart();
    initAnimations();
});

/* ============================================
   HEADER FUNCTIONALITY
   ============================================ */
function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show on scroll (optional)
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (!mobileMenuBtn || !navLinks) return;

    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('open');
        mobileMenuBtn.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('open');
            mobileMenuBtn.classList.remove('active');
        });
    });
}

/* ============================================
   CART FUNCTIONALITY
   ============================================ */
let cart = JSON.parse(localStorage.getItem('bookstore_cart')) || [];

function initCart() {
    updateCartCount();
}

function addToCart(book) {
    const existingItem = cart.find(item => item.id === book.id);
    
    if (existingItem) {
        existingItem.quantity += book.quantity || 1;
    } else {
        cart.push({
            ...book,
            quantity: book.quantity || 1
        });
    }

    saveCart();
    updateCartCount();
    showNotification('Added to cart!', 'success');
}

function removeFromCart(bookId) {
    cart = cart.filter(item => item.id !== bookId);
    saveCart();
    updateCartCount();
    showNotification('Removed from cart', 'info');
}

function updateCartQuantity(bookId, quantity) {
    const item = cart.find(item => item.id === bookId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        saveCart();
        updateCartCount();
    }
}

function saveCart() {
    localStorage.setItem('bookstore_cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
        el.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
}

/* ============================================
   NOTIFICATIONS
   ============================================ */
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
        <span class="notification-message">${message}</span>
    `;

    // Styles
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '16px 24px',
        background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#0d5c63',
        color: '#fff',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontWeight: '500',
        zIndex: '9999',
        animation: 'slideIn 0.3s ease',
        fontSize: '0.95rem'
    });

    document.body.appendChild(notification);

    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animate class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */
function formatPrice(price) {
    return '₹' + price.toFixed(2);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ============================================
   WISHLIST FUNCTIONALITY
   ============================================ */
let wishlist = JSON.parse(localStorage.getItem('bookstore_wishlist')) || [];

function toggleWishlist(bookId) {
    const index = wishlist.indexOf(bookId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Removed from wishlist', 'info');
    } else {
        wishlist.push(bookId);
        showNotification('Added to wishlist!', 'success');
    }

    localStorage.setItem('bookstore_wishlist', JSON.stringify(wishlist));
    updateWishlistButtons();
}

function updateWishlistButtons() {
    document.querySelectorAll('.btn-wishlist').forEach(btn => {
        const bookId = btn.dataset.bookId;
        if (wishlist.includes(bookId)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Export functions for use in other files
window.BookStore = {
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getCartTotal,
    clearCart,
    toggleWishlist,
    showNotification,
    formatPrice
};
