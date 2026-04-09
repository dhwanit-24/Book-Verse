/* ============================================
   CATALOG PAGE JAVASCRIPT
   ============================================ */
   
   function initSorting() {
       const sortSelect = document.querySelector('.sort-select');
       if (!sortSelect) return;

       sortSelect.addEventListener('change', function() {
           const value = this.value;
           const bookGrid = document.querySelector('.book-grid');
           const bookCards = Array.from(document.querySelectorAll('.book-card'));

           if (value === 'name-asc') {
               bookCards.sort((a, b) => {
                   const titleA = a.querySelector('.book-title').innerText.toLowerCase();
                   const titleB = b.querySelector('.book-title').innerText.toLowerCase();
                   return titleA.localeCompare(titleB);
               });
           } else if (value === 'name-desc') {
               bookCards.sort((a, b) => {
                   const titleA = a.querySelector('.book-title').innerText.toLowerCase();
                   const titleB = b.querySelector('.book-title').innerText.toLowerCase();
                   return titleB.localeCompare(titleA);
               });
           } else if (value === 'price-asc') {
               bookCards.sort((a, b) => {
                   const priceA = parseFloat(a.querySelector('.book-price span').innerText);
                   const priceB = parseFloat(b.querySelector('.book-price span').innerText);
                   return priceA - priceB;
               });
           } else if (value === 'price-desc') {
               bookCards.sort((a, b) => {
                   const priceA = parseFloat(a.querySelector('.book-price span').innerText);
                   const priceB = parseFloat(b.querySelector('.book-price span').innerText);
                   return priceB - priceA;
               });
           }

           // Re-append sorted cards
           bookCards.forEach(card => bookGrid.appendChild(card));
       });
   }

   function initViewToggle() {
       const viewBtns = document.querySelectorAll('.view-btn');
       const bookGrid = document.querySelector('.book-grid');

       viewBtns.forEach(btn => {
           btn.addEventListener('click', function() {
               const view = this.dataset.view;
               viewBtns.forEach(b => b.classList.remove('active'));
               this.classList.add('active');

               if (view === 'list') {
                   bookGrid.classList.add('list-view');
               } else {
                   bookGrid.classList.remove('list-view');
               }
           });
       });
   }

document.addEventListener('DOMContentLoaded', function() {

    // Search
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchText = this.value.toLowerCase().trim();
            document.querySelectorAll('.book-card').forEach(function(card) {
                const title = card.querySelector('.book-title').innerText.toLowerCase();
                const author = card.querySelector('.book-author').innerText.toLowerCase();
                card.style.display = (title.includes(searchText) || author.includes(searchText)) ? 'block' : 'none';
            });
        });
    }

    // Category filters
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const selectedCategories = Array.from(document.querySelectorAll('.filter-checkbox:checked'))
                .map(cb => cb.dataset.category.toLowerCase().trim());

            document.querySelectorAll('.book-card').forEach(function(card) {
                const genre = card.querySelector('.book-category').innerText.toLowerCase().trim();
                card.style.display = (selectedCategories.length === 0 || selectedCategories.includes(genre)) ? 'block' : 'none';
            });
        });
    });

    // Price slider
    const priceSlider = document.querySelector('.price-slider');
    if (priceSlider) {
        const allPrices = Array.from(document.querySelectorAll('.book-price span'))
            .map(el => parseFloat(el.innerText.trim()));
        const minPrice = Math.min(...allPrices);
        const maxPrice = Math.max(...allPrices);

        priceSlider.min = minPrice;
        priceSlider.max = maxPrice;
        priceSlider.value = maxPrice;
        document.querySelector('.price-max').textContent = '₹' + maxPrice;

        priceSlider.addEventListener('input', function() {
            const selectedMax = parseFloat(this.value);
            document.querySelector('.price-max').textContent = '₹' + selectedMax;
            document.querySelectorAll('.book-card').forEach(function(card) {
                const price = parseFloat(card.querySelector('.book-price span').innerText.trim());
                card.style.display = price <= selectedMax ? 'block' : 'none';
            });
        });
    }

    // Clear filters
    const clearBtn = document.querySelector('.clear-filters-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            document.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = false);
            document.querySelectorAll('.book-card').forEach(card => card.style.display = 'block');
            if (searchInput) searchInput.value = '';
            if (priceSlider) {
                priceSlider.value = priceSlider.max;
                document.querySelector('.price-max').textContent = '₹' + priceSlider.max;
            }
            BookStore.showNotification('Filters cleared', 'info');
        });
    }

    // Mobile filter toggle
    const mobileFilterBtn = document.querySelector('.mobile-filter-btn');
    const sidebar = document.querySelector('.catalog-sidebar');
    if (mobileFilterBtn && sidebar) {
        mobileFilterBtn.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }

    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Category toggle
    window.toggleFilter = function(btn) {
        const options = btn.closest('.filter-card').querySelector('.filter-options');
        if (options.style.display === 'none') {
            options.style.display = 'block';
            btn.textContent = '−';
        } else {
            options.style.display = 'none';
            btn.textContent = '+';
        }
    };

});

