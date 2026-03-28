/* ============================================
   HOME PAGE JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initHeroAnimations();
    //initFeaturedBooks();
    initCategoryCards();
    initNewsletter();
    initBookCards();
});

/* ============================================
   HERO SECTION
   ============================================ */
function initHeroAnimations() {
    const heroVisual = document.querySelector('.hero-visual');
    const books = document.querySelectorAll('.featured-book');

    if (!heroVisual) return;

    // Parallax effect on mouse move
    document.addEventListener('mousemove', throttle(function(e) {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;

        books.forEach((book, index) => {
            const depth = (index + 1) * 0.5;
            book.style.transform = `
                rotateY(${-15 + index * 10 + x * depth}deg) 
                rotateX(${y * depth}deg) 
                translateZ(${20 - index * 10}px)
            `;
        });
    }, 50));

    // Reset on mouse leave
    heroVisual.addEventListener('mouseleave', function() {
        books.forEach((book, index) => {
            book.style.transform = `
                rotateY(${-15 + index * 10}deg) 
                translateZ(${20 - index * 10}px)
            `;
        });
    });
}

/* ============================================
   FEATURED BOOKS DATA
   ============================================ */
const featuredBooks = [
    {
        id: 'book-1',
        title: 'The Silent Echo',
        author: 'Sarah Mitchell',
        category: 'Mystery',
        price: 240.00,
        originalPrice: 290.00,
        rating: 4.8,
        reviews: 234,
        badge: 'Bestseller',
        color: '#0d5c63'
    },
    {
        id: 'book-2',
        title: 'Beyond the Horizon',
        author: 'James Chen',
        category: 'Sci-Fi',
        price: 190.00,
        rating: 4.6,
        reviews: 189,
        badge: null,
        color: '#ff6b5b'
    },
    {
        id: 'book-3',
        title: 'Whispers of Time',
        author: 'Elena Rodriguez',
        category: 'Romance',
        price: 210.00,
        originalPrice: 260.00,
        rating: 4.9,
        reviews: 312,
        badge: 'New',
        color: '#6366f1'
    },
    {
        id: 'book-4',
        title: 'The Last Kingdom',
        author: 'Michael Stone',
        category: 'Fantasy',
        price: 27.99,
        rating: 4.7,
        reviews: 156,
        badge: null,
        color: '#8b5cf6'
    }
];

function initFeaturedBooks() {
    const bookGrid = document.querySelector('.book-grid');
    if (!bookGrid) return;

    bookGrid.innerHTML = featuredBooks.map(book => createBookCard(book)).join('');
}

function createBookCard(book) {
    const hasDiscount = book.originalPrice && book.originalPrice > book.price;
    
    return `
        <div class="book-card" data-book-id="${book.id}">
            <div class="book-card-image">
                ${book.badge ? `<span class="book-badge">${book.badge}</span>` : ''}
                <div class="book-cover" style="background: linear-gradient(145deg, ${book.color}, ${adjustColor(book.color, -30)})">
                    <span>${book.title}</span>
                </div>
                <div class="quick-actions">
                    <button class="quick-action-btn btn-quick-view" onclick="quickView('${book.id}')" title="Quick View">
                        👁
                    </button>
                    <button class="quick-action-btn btn-wishlist" data-book-id="${book.id}" onclick="BookStore.toggleWishlist('${book.id}')" title="Add to Wishlist">
                        ♡
                    </button>
                    <button class="quick-action-btn btn-add" onclick="addBookToCart('${book.id}')" title="Add to Cart">
                        +
                    </button>
                </div>
            </div>
            <div class="book-card-content">
                <span class="book-category">${book.category}</span>
                <h4 class="book-title">
                    <a href="book-detail.html?id=${book.id}">${book.title}</a>
                </h4>
                <p class="book-author">by ${book.author}</p>
                <div class="book-footer">
                    <span class="book-price">
                        ${BookStore.formatPrice(book.price)}
                        ${hasDiscount ? `<span class="original-price">${BookStore.formatPrice(book.originalPrice)}</span>` : ''}
                    </span>
                    <span class="book-rating">
                        ★ ${book.rating}
                    </span>
                </div>
            </div>
        </div>
    `;
}

function addBookToCart(bookId) {
    const book = featuredBooks.find(b => b.id === bookId);
    if (book) {
        BookStore.addToCart({
            id: book.id,
            title: book.title,
            author: book.author,
            price: book.price,
            color: book.color
        });
    }
}

function quickView(bookId) {
    // Could open a modal with book details
    window.location.href = `book-detail.html?id=${bookId}`;
}


/* ============================================
   NEWSLETTER
   ============================================ */
function initNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('.newsletter-input').value;
        
        if (validateEmail(email)) {
            BookStore.showNotification('Thanks for subscribing!', 'success');
            this.reset();
        } else {
            BookStore.showNotification('Please enter a valid email', 'error');
        }
    });
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ============================================
   BOOK CARDS INTERACTIONS
   ============================================ */
function initBookCards() {
    // Add hover sound effect (optional)
    document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

/* ============================================
   UTILITY
   ============================================ */
function adjustColor(hex, amount) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
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
