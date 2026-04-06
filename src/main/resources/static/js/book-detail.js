/* ============================================
   BOOK DETAIL PAGE JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initQuantityControls();
    initTabs();
});

/* ============================================
   QUANTITY CONTROLS
   ============================================ */
let quantity = 1;
const maxStock = parseInt(document.querySelector('.qty-input').max);

function initQuantityControls() {
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');
    const qtyInput = document.querySelector('.qty-input');

    if (minusBtn) {
        minusBtn.addEventListener('click', function() {
            if (quantity > 1) {
                quantity--;
                qtyInput.value = quantity;
            }
        });
    }

    if (plusBtn) {
        plusBtn.addEventListener('click', function() {
            if (quantity < maxStock) {
                quantity++;
                qtyInput.value = quantity;
            }
        });
    }

    if (qtyInput) {
        qtyInput.addEventListener('change', function() {
            const val = parseInt(this.value);
            if (val >= 1 && val <= maxStock) {
                quantity = val;
            } else {
                this.value = quantity;
            }
        });
    }
}

/* ============================================
   TABS
   ============================================ */
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            document.querySelector(`.tab-content[data-tab="${this.dataset.tab}"]`).classList.add('active');
        });
    });
}

/* ============================================
   ADD TO CART
   ============================================ */
function addToCartFromDetail() {
    const title = document.querySelector('.book-detail-title').innerText;
    const author = document.querySelector('.book-author-link span').innerText;
    const price = parseFloat(document.querySelector('.current-price span').innerText);
    const id = window.location.pathname.split('/').pop();

    BookStore.addToCart({
        id: id,
        title: title,
        author: author,
        price: price,
        quantity: quantity
    });
}

window.addToCartFromDetail = addToCartFromDetail;