/* ============================================
   CATALOG PAGE JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initFilters();
    initViewToggle();
    initSorting();
    initPagination();
    loadBooks();
});

/* ============================================
   BOOKS DATA
   ============================================ */
/*const allBooks = [
    { id: 'book-1', title: 'The Silent Echo', author: 'Sarah Mitchell', category: 'Mystery', price: 240.00, originalPrice: 290.00, rating: 4.8, reviews: 234, badge: 'Bestseller', color: '#0d5c63', description: 'A gripping mystery that will keep you on the edge of your seat.' },
    { id: 'book-2', title: 'Beyond the Horizon', author: 'James Chen', category: 'Sci-Fi', price: 190.00, rating: 4.6, reviews: 189, color: '#ff6b5b', description: 'An epic space adventure spanning galaxies.' },
    { id: 'book-3', title: 'Whispers of Time', author: 'Elena Rodriguez', category: 'Romance', price: 210.00, originalPrice: 260.00, rating: 4.9, reviews: 312, badge: 'New', color: '#6366f1', description: 'A beautiful love story that transcends time.' },
    { id: 'book-4', title: 'The Last Kingdom', author: 'Michael Stone', category: 'Fantasy', price: 270.00, rating: 4.7, reviews: 156, color: '#8b5cf6', description: 'Enter a world of magic and adventure.' },
    { id: 'book-5', title: 'Digital Dreams', author: 'Anna Park', category: 'Sci-Fi', price: 220.00, rating: 4.5, reviews: 98, color: '#14b8a6', description: 'When AI becomes indistinguishable from reality.' },
    { id: 'book-6', title: 'Midnight Gardens', author: 'David Foster', category: 'Mystery', price: 180.00, rating: 4.4, reviews: 167, color: '#f59e0b', description: 'Dark secrets lurk beneath the beautiful gardens.' },
    { id: 'book-7', title: 'The Heart Remembers', author: 'Lisa Wang', category: 'Romance', price: 160.00, rating: 4.8, reviews: 289, color: '#ec4899', description: 'A touching story of love lost and found.' },
    { id: 'book-8', title: 'Empire of Shadows', author: 'Robert King', category: 'Fantasy', price: 290.00, rating: 4.9, reviews: 445, badge: 'Editor\'s Pick', color: '#7c3aed', description: 'An epic fantasy saga begins.' },
    { id: 'book-9', title: 'The Quantum Paradox', author: 'Dr. Emily Nash', category: 'Sci-Fi', price: 250.00, rating: 4.6, reviews: 123, color: '#06b6d4', description: 'Where physics meets philosophy.' }
];*/

let filteredBooks = [...allBooks];
let currentPage = 1;
const booksPerPage = 6;

/* ============================================
   FILTERS
   ============================================ */
let activeFilters = {
    search: '',
    categories: [],
    priceRange: [0, 50],
    rating: 0
};

function initFilters() {
    // Search filter
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            activeFilters.search = this.value.toLowerCase();
            applyFilters();
        }, 300));
    }

    // Category filters
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const category = this.dataset.category;
            if (this.checked) {
                activeFilters.categories.push(category);
            } else {
                activeFilters.categories = activeFilters.categories.filter(c => c !== category);
            }
            applyFilters();
        });
    });

    // Price range
    const priceSlider = document.querySelector('.price-slider');
    if (priceSlider) {
        priceSlider.addEventListener('input', function() {
            activeFilters.priceRange[1] = parseInt(this.value);
            document.querySelector('.price-max').textContent = '₹' + this.value;
            applyFilters();
        });
    }

    // Rating filter
    document.querySelectorAll('.rating-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.rating-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            activeFilters.rating = parseInt(this.dataset.rating);
            applyFilters();
        });
    });

    // Clear filters
    const clearBtn = document.querySelector('.clear-filters-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearFilters);
    }

    // Mobile filter toggle
    const mobileFilterBtn = document.querySelector('.mobile-filter-btn');
    const sidebar = document.querySelector('.catalog-sidebar');
    if (mobileFilterBtn && sidebar) {
        mobileFilterBtn.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
}

function applyFilters() {
    filteredBooks = allBooks.filter(book => {
        // Search filter
        if (activeFilters.search && 
            !book.title.toLowerCase().includes(activeFilters.search) &&
            !book.author.toLowerCase().includes(activeFilters.search)) {
            return false;
        }

        // Category filter
        if (activeFilters.categories.length > 0 && 
            !activeFilters.categories.includes(book.category)) {
            return false;
        }

        // Price filter
        if (book.price < activeFilters.priceRange[0] || 
            book.price > activeFilters.priceRange[1]) {
            return false;
        }

        // Rating filter
        if (activeFilters.rating > 0 && book.rating < activeFilters.rating) {
            return false;
        }

        return true;
    });

    currentPage = 1;
    renderBooks();
    updateResultsCount();
}

function clearFilters() {
    activeFilters = {
        search: '',
        categories: [],
        priceRange: [0, 50],
        rating: 0
    };

    // Reset UI
    document.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = false);
    document.querySelectorAll('.rating-option').forEach(o => o.classList.remove('active'));
    
    const searchInput = document.querySelector('.search-input');
    if (searchInput) searchInput.value = '';
    
    const priceSlider = document.querySelector('.price-slider');
    if (priceSlider) priceSlider.value = 50;

    filteredBooks = [...allBooks];
    renderBooks();
    updateResultsCount();
    
    BookStore.showNotification('Filters cleared', 'info');
}

/* ============================================
   VIEW TOGGLE
   ============================================ */
let currentView = 'grid';

function initViewToggle() {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentView = this.dataset.view;
            
            const grid = document.querySelector('.catalog-grid');
            if (grid) {
                grid.classList.toggle('list-view', currentView === 'list');
            }
        });
    });
}

/* ============================================
   SORTING
   ============================================ */
function initSorting() {
    const sortSelect = document.querySelector('.sort-select');
    if (!sortSelect) return;

    sortSelect.addEventListener('change', function() {
        const sortBy = this.value;
        
        switch(sortBy) {
            case 'price-low':
                filteredBooks.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredBooks.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filteredBooks.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                filteredBooks.sort((a, b) => b.id.localeCompare(a.id));
                break;
            default:
                // featured - keep original order
                filteredBooks = [...allBooks];
                applyFilters();
                return;
        }
        
        renderBooks();
    });
}

/* ============================================
   PAGINATION
   ============================================ */
function initPagination() {
    // Pagination is rendered dynamically
}

function getTotalPages() {
    return Math.ceil(filteredBooks.length / booksPerPage);
}

function goToPage(page) {
    const totalPages = getTotalPages();
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderBooks();
    
    // Scroll to top of catalog
    document.querySelector('.catalog-main').scrollIntoView({ behavior: 'smooth' });
}

function renderPagination() {
    const container = document.querySelector('.pagination');
    if (!container) return;

    const totalPages = getTotalPages();
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = `
        <button class="page-btn nav-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            ← Previous
        </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `
                <button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += '<span class="page-ellipsis">...</span>';
        }
    }

    html += `
        <button class="page-btn nav-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            Next →
        </button>
    `;

    container.innerHTML = html;
}

/* ============================================
   RENDER BOOKS
   ============================================ */
function loadBooks() {
    renderBooks();
    updateResultsCount();
}

function renderBooks() {
    const grid = document.querySelector('.catalog-grid');
    if (!grid) return;

    const start = (currentPage - 1) * booksPerPage;
    const end = start + booksPerPage;
    const booksToShow = filteredBooks.slice(start, end);

    if (booksToShow.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📚</div>
                <h3>No books found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button class="btn btn-primary" onclick="clearFilters()">Clear Filters</button>
            </div>
        `;
        document.querySelector('.pagination').innerHTML = '';
        return;
    }

    grid.innerHTML = booksToShow.map(book => createBookCard(book)).join('');
    renderPagination();
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
                    <button class="quick-action-btn" onclick="window.location.href='book-detail.html?id=${book.id}'" title="Quick View">👁</button>
                    <button class="quick-action-btn btn-wishlist" data-book-id="${book.id}" onclick="BookStore.toggleWishlist('${book.id}')" title="Wishlist">♡</button>
                    <button class="quick-action-btn" onclick="addToCart('${book.id}')" title="Add to Cart">+</button>
                </div>
            </div>
            <div class="book-card-content">
                <span class="book-category">${book.category}</span>
                <h4 class="book-title">
                    <a href="book-detail.html?id=${book.id}">${book.title}</a>
                </h4>
                <p class="book-author">by ${book.author}</p>
                <p class="book-description">${book.description}</p>
                <div class="book-footer">
                    <span class="book-price">
                        ${BookStore.formatPrice(book.price)}
                        ${hasDiscount ? `<span style="text-decoration: line-through; color: #999; font-size: 0.85rem; margin-left: 8px;">${BookStore.formatPrice(book.originalPrice)}</span>` : ''}
                    </span>
                    <span class="book-rating">★ ${book.rating}</span>
                </div>
                <button class="btn btn-primary btn-add-cart" onclick="addToCart('${book.id}')" style="width: 100%; margin-top: 12px;">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

function updateResultsCount() {
    const countEl = document.querySelector('.results-count');
    if (countEl) {
        countEl.innerHTML = `Showing <strong>${filteredBooks.length}</strong> of <strong>${allBooks.length}</strong> books`;
    }
}

function addToCart(bookId) {
    const book = allBooks.find(b => b.id === bookId);
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
