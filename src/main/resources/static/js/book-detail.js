/* ============================================
   BOOK DETAIL PAGE JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    loadBookDetails();
    initQuantityControls();
    initTabs();
    initWishlist();
    initRelatedBooks();
});

/* ============================================
   BOOK DATA
   ============================================ */
const booksDatabase = {
    'book-1': {
        id: 'book-1',
        title: 'The Silent Echo',
        author: 'Sarah Mitchell',
        category: 'Mystery',
        price: 240.00,
        originalPrice: 290.00,
        rating: 4.8,
        reviews: 234,
        badge: 'Bestseller',
        color: '#0d5c63',
        isbn: '978-0-123456-78-9',
        pages: 342,
        publisher: 'Penguin Books',
        language: 'English',
        format: 'Hardcover',
        published: 'March 2024',
        stock: 15,
        description: `
            <p>In the quiet town of Millbrook, detective Sarah Chen discovers that silence can be the loudest cry for help. When a renowned pianist is found dead in her soundproofed studio, the case seems simple—until Sarah realizes the victim left behind a symphony of secrets.</p>
            <p>As she delves deeper into the investigation, Sarah uncovers a web of jealousy, forbidden love, and long-buried grudges among the town's elite. Each clue leads to another mystery, and the echoes of the past threaten to consume everyone involved.</p>
            <p>"The Silent Echo" is a masterful blend of psychological suspense and small-town drama that will keep you guessing until the very last page.</p>
        `,
        reviewsList: [
            { name: 'John D.', rating: 5, date: '2024-01-15', text: 'Absolutely gripping from start to finish. Couldn\'t put it down!' },
            { name: 'Maria S.', rating: 4, date: '2024-01-10', text: 'Great mystery with well-developed characters. The ending surprised me.' },
            { name: 'Alex K.', rating: 5, date: '2024-01-05', text: 'Sarah Mitchell has outdone herself. A must-read for mystery lovers.' }
        ]
    },
    'book-2': {
        id: 'book-2',
        title: 'Beyond the Horizon',
        author: 'James Chen',
        category: 'Sci-Fi',
        price: 190.00,
        rating: 4.6,
        reviews: 189,
        color: '#ff6b5b',
        isbn: '978-0-234567-89-0',
        pages: 456,
        publisher: 'Orbit Books',
        language: 'English',
        format: 'Paperback',
        published: 'February 2024',
        stock: 8,
        description: `
            <p>In the year 2347, humanity has colonized the solar system, but the stars remain tantalizingly out of reach. Captain Maya Torres and her crew aboard the starship Endeavor are about to change that forever.</p>
            <p>When an ancient alien artifact is discovered on Europa, it reveals the key to faster-than-light travel. But the technology comes with a warning: those who venture beyond the horizon may never return the same.</p>
        `,
        reviewsList: [
            { name: 'Sam T.', rating: 5, date: '2024-02-01', text: 'Epic space opera with heart. The world-building is incredible.' },
            { name: 'Rachel M.', rating: 4, date: '2024-01-28', text: 'A fresh take on the space exploration genre.' }
        ]
    }
};

/* ============================================
   LOAD BOOK DETAILS
   ============================================ */
function loadBookDetails() {
    // Get book ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id') || 'book-1';
    
    const book = booksDatabase[bookId] || booksDatabase['book-1'];
    
    // Update page content
    renderBookDetails(book);
    
    // Store current book for cart operations
    window.currentBook = book;
}

function renderBookDetails(book) {
    // Update title
    document.title = `${book.title} - BookVerse`;
    
    // Update breadcrumb
    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) {
        breadcrumb.innerHTML = `
            <a href="index.html">Home</a>
            <span>›</span>
            <a href="catalog.html">Books</a>
            <span>›</span>
            <a href="catalog.html?category=${book.category.toLowerCase()}">${book.category}</a>
            <span>›</span>
            <span>${book.title}</span>
        `;
    }

    // Update book cover
    const bookCover = document.querySelector('.book-cover-large');
    if (bookCover) {
        bookCover.style.background = `linear-gradient(145deg, ${book.color}, ${adjustColor(book.color, -30)})`;
        bookCover.innerHTML = `<span>${book.title}</span>`;
    }

    // Update sale badge
    const saleBadge = document.querySelector('.sale-badge');
    if (saleBadge) {
        if (book.originalPrice) {
            const discount = Math.round((1 - book.price / book.originalPrice) * 100);
            saleBadge.textContent = `-${discount}%`;
            saleBadge.style.display = 'block';
        } else {
            saleBadge.style.display = 'none';
        }
    }

    // Update book info
    updateElement('.book-category-tag', book.category);
    updateElement('.book-detail-title', book.title);
    updateElement('.book-author-link a', book.author);
    
    // Rating
    const ratingStars = document.querySelector('.rating-stars');
    if (ratingStars) {
        ratingStars.innerHTML = generateStars(book.rating);
    }
    updateElement('.rating-score', book.rating.toFixed(1));
    updateElement('.rating-count a', `${book.reviews} reviews`);

    // Price
    updateElement('.current-price', BookStore.formatPrice(book.price));
    const originalPrice = document.querySelector('.original-price');
    if (originalPrice) {
        if (book.originalPrice) {
            originalPrice.textContent = BookStore.formatPrice(book.originalPrice);
            originalPrice.style.display = 'inline';
        } else {
            originalPrice.style.display = 'none';
        }
    }

    // Save badge
    const saveBadge = document.querySelector('.save-badge');
    if (saveBadge && book.originalPrice) {
        const saved = (book.originalPrice - book.price).toFixed(2);
        saveBadge.textContent = `Save $${saved}`;
        saveBadge.style.display = 'inline-block';
    }

    // Stock status
    const stockStatus = document.querySelector('.stock-status');
    if (stockStatus) {
        if (book.stock > 10) {
            stockStatus.innerHTML = '<span class="stock-dot"></span> In Stock';
            stockStatus.classList.remove('low');
        } else if (book.stock > 0) {
            stockStatus.innerHTML = `<span class="stock-dot"></span> Only ${book.stock} left`;
            stockStatus.classList.add('low');
        } else {
            stockStatus.innerHTML = '<span class="stock-dot"></span> Out of Stock';
            stockStatus.classList.add('low');
        }
    }

    // Meta information
    updateElement('[data-meta="isbn"]', book.isbn);
    updateElement('[data-meta="pages"]', book.pages);
    updateElement('[data-meta="publisher"]', book.publisher);
    updateElement('[data-meta="language"]', book.language);
    updateElement('[data-meta="format"]', book.format);
    updateElement('[data-meta="published"]', book.published);

    // Description
    const descriptionText = document.querySelector('.book-description-text');
    if (descriptionText) {
        descriptionText.innerHTML = book.description;
    }

    // Reviews
    renderReviews(book.reviewsList || []);
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    if (hasHalf) stars += '½';
    for (let i = fullStars + (hasHalf ? 1 : 0); i < 5; i++) {
        stars += '☆';
    }
    
    return stars;
}

function renderReviews(reviews) {
    const container = document.querySelector('.reviews-list');
    if (!container) return;

    container.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">${review.name.charAt(0)}</div>
                    <div>
                        <div class="reviewer-name">${review.name}</div>
                        <div class="review-date">${formatDate(review.date)}</div>
                    </div>
                </div>
                <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
            </div>
            <p class="review-text">${review.text}</p>
        </div>
    `).join('');
}

/* ============================================
   QUANTITY CONTROLS
   ============================================ */
let quantity = 1;

function initQuantityControls() {
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');
    const qtyInput = document.querySelector('.qty-input');

    if (minusBtn) {
        minusBtn.addEventListener('click', function() {
            if (quantity > 1) {
                quantity--;
                updateQuantityDisplay();
            }
        });
    }

    if (plusBtn) {
        plusBtn.addEventListener('click', function() {
            if (quantity < 99) {
                quantity++;
                updateQuantityDisplay();
            }
        });
    }

    if (qtyInput) {
        qtyInput.addEventListener('change', function() {
            const val = parseInt(this.value);
            if (val >= 1 && val <= 99) {
                quantity = val;
            }
            updateQuantityDisplay();
        });
    }
}

function updateQuantityDisplay() {
    const qtyInput = document.querySelector('.qty-input');
    if (qtyInput) {
        qtyInput.value = quantity;
    }
}

/* ============================================
   ADD TO CART
   ============================================ */
function addToCartFromDetail() {
    if (window.currentBook) {
        BookStore.addToCart({
            id: window.currentBook.id,
            title: window.currentBook.title,
            author: window.currentBook.author,
            price: window.currentBook.price,
            color: window.currentBook.color,
            quantity: quantity
        });
    }
}

// Attach to window for inline onclick
window.addToCartFromDetail = addToCartFromDetail;

/* ============================================
   TABS
   ============================================ */
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.tab;

            // Update buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Update content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.dataset.tab === targetTab) {
                    content.classList.add('active');
                }
            });
        });
    });
}

/* ============================================
   WISHLIST
   ============================================ */
function initWishlist() {
    const wishlistBtn = document.querySelector('.btn-wishlist');
    if (!wishlistBtn) return;

    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id') || 'book-1';
    
    wishlistBtn.dataset.bookId = bookId;
    
    // Check if already in wishlist
    const wishlist = JSON.parse(localStorage.getItem('bookstore_wishlist')) || [];
    if (wishlist.includes(bookId)) {
        wishlistBtn.classList.add('active');
    }

    wishlistBtn.addEventListener('click', function() {
        BookStore.toggleWishlist(bookId);
        this.classList.toggle('active');
    });
}

/* ============================================
   RELATED BOOKS
   ============================================ */
function initRelatedBooks() {
    const container = document.querySelector('.related-books-grid');
    if (!container) return;

    // Get related books (simplified - just show other books)
    const relatedBooks = Object.values(booksDatabase).slice(0, 4);
    
    container.innerHTML = relatedBooks.map(book => `
        <div class="book-card">
            <div class="book-card-image">
                <div class="book-cover" style="background: linear-gradient(145deg, ${book.color}, ${adjustColor(book.color, -30)})">
                    <span>${book.title}</span>
                </div>
            </div>
            <div class="book-card-content">
                <span class="book-category">${book.category}</span>
                <h4 class="book-title">
                    <a href="book-detail.html?id=${book.id}">${book.title}</a>
                </h4>
                <p class="book-author">by ${book.author}</p>
                <div class="book-footer">
                    <span class="book-price">${BookStore.formatPrice(book.price)}</span>
                    <span class="book-rating">★ ${book.rating}</span>
                </div>
            </div>
        </div>
    `).join('');
}

/* ============================================
   UTILITIES
   ============================================ */
function updateElement(selector, content) {
    const el = document.querySelector(selector);
    if (el) el.textContent = content;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function adjustColor(hex, amount) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}
