let filteredBooks = [];
let currentPage = 1;
const booksPerPage = 6;

 //FILTERS
   
let activeFilters = {
    search: '',
    categories: [],
    priceRange: [0, 50],
    rating: 0
};

const searchInput = document.querySelector('.search-input');
if (searchInput) {
    searchInput.addEventListener('input', function() {
        const searchText = this.value.toLowerCase().trim();
        const bookCards = document.querySelectorAll('.book-card');
        
        bookCards.forEach(function(card) {
            const title = card.querySelector('.book-title').innerText.toLowerCase();
            const author = card.querySelector('.book-author').innerText.toLowerCase();
            
            if (title.includes(searchText) || author.includes(searchText)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

}
    // Category filters
	const bookCards = document.querySelectorAll('.book-card');
	console.log('Total cards found:', bookCards.length);
	bookCards.forEach(function(card) {
	    const genre = card.querySelector('.book-category');
	    console.log('Genre element:', genre);
	});
	
	document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
	    checkbox.addEventListener('change', function() {
	        const checkedBoxes = document.querySelectorAll('.filter-checkbox:checked');
	        const selectedCategories = Array.from(checkedBoxes).map(cb => cb.dataset.category);
	        
	        const bookCards = document.querySelectorAll('.book-card');
	        bookCards.forEach(function(card) {
				
	            const genre = card.querySelector('.book-category').innerText.trim();
				console.log('Card genre: [' + genre + '] Selected: ' + JSON.stringify(selectedCategories));
	            if (selectedCategories.length === 0 || selectedCategories.map(c => c.toLowerCase().trim()).includes(genre.toLowerCase().trim())) {
					card.style.display = 'block';
				} else {
					 card.style.display = 'none';
				}
	        });
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


//CATALOG PAGE

document.addEventListener('DOMContentLoaded', function() {
    initFilters();
    initViewToggle();
    initSorting();
    initPagination();
});


// book catagory toggle button 
function toggleFilter(btn) {
    const options = btn.closest('.filter-card').querySelector('.filter-options');
    if (options.style.display === 'none') {
        options.style.display = 'block';
        btn.textContent = '−';
    } else {
        options.style.display = 'none';
        btn.textContent = '+';
    }
}