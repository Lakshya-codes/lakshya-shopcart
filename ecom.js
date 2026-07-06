alert("Development is in Progress.. Thankyou for you Patience 😌")
const products = [
  { id:1,  name:"Wireless Noise-Cancelling Headphones", category:"Electronics", price:1499, oldPrice:1999, rating:4.8, reviews:2341, badge:"sale", img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" },
  { id:2,  name:"Mechanical Keyboard — RGB Backlit", category:"Electronics", price:899, oldPrice:null, rating:4.6, reviews:987, badge:"new", img:"https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&q=80" },
  { id:3,  name:"Premium Leather Wallet", category:"Accessories", price:499, oldPrice:699, rating:4.7, reviews:512, badge:"sale", img:"https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80" },
  { id:4,  name:"Smart Watch Series 6", category:"Electronics", price:2999, oldPrice:3499, rating:4.9, reviews:4122, badge:"sale", img:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" },
  { id:5,  name:"Bamboo Desk Organizer", category:"Home", price:349, oldPrice:null, rating:4.5, reviews:308, badge:"new", img:"https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80" },
  { id:6,  name:"Yoga Mat — Extra Thick", category:"Fitness", price:449, oldPrice:599, rating:4.7, reviews:1876, badge:"sale", img:"https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&q=80" },
  { id:7,  name:"Minimalist Sneakers", category:"Fashion", price:799, oldPrice:null, rating:4.4, reviews:653, badge:"new", img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" },
  { id:8,  name:"Portable Bluetooth Speaker", category:"Electronics", price:599, oldPrice:799, rating:4.6, reviews:2105, badge:"sale", img:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80" },
  { id:9,  name:"Stainless Steel Water Bottle", category:"Fitness", price:249, oldPrice:null, rating:4.8, reviews:3210, badge:null, img:"https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80" },
  { id:10, name:"Portable Coffee Machine", category:"Home", price:399, oldPrice:549, rating:4.5, reviews:445, badge:"sale", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { id:11, name:"Rayban Sunglasses", category:"Accessories", price:299, oldPrice:null, rating:4.3, reviews:789, badge:null, img:"https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=400&q=80" },
  { id:12, name:"Thinking Handbook", category:"Books", price:199, oldPrice:279, rating:4.9, reviews:1033, badge:"sale", img:"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80" },
];

let cart = [];
let activeCategory = 'all';
let searchQuery = '';
let loved = new Set();

function stars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let s = '★'.repeat(full);
  if (half) s += '½';
  s += '☆'.repeat(5 - full - (half?1:0));
  return s;
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const count = document.getElementById('resultCount');
  const query = searchQuery.toLowerCase();

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });

  count.textContent = filtered.length + ' item' + (filtered.length !== 1 ? 's' : '');

  if (!filtered.length) {
    grid.innerHTML = `<div class="no-results"><p>No products match your search.<br><a href="#" style="color:var(--accent)" onclick="clearSearch()">Clear filters</a></p></div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const discountPct = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;
    const isLoved = loved.has(p.id);
    return `
    <div class="product-card">
      <div class="product-img">
        <img src="${p.img}" loading="lazy">
        ${p.badge === 'sale' ? `<span class="product-badge-sale">-${discountPct}%</span>` : ''}
        ${p.badge === 'new' ? `<span class="product-badge-new">New</span>` : ''}
        <button class="wishlist-btn ${isLoved ? 'loved' : ''}" onclick="toggleLove(${p.id}, this)" title="Wishlist">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="${isLoved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">
          <span class="stars">${stars(p.rating)}</span>
          <span class="rating-count">${p.rating} (${p.reviews.toLocaleString()})</span>
        </div>
        <div class="product-price-row">
          <span class="price">₹${p.price.toFixed(2)}</span>
          ${p.oldPrice ? `<span class="price-old">₹${p.oldPrice.toFixed(2)}</span>` : ''}
        </div>
        <button class="add-to-cart" id="btn-${p.id}" onclick="addToCart(${p.id}, this)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          Add to cart
        </button>
      </div>
    </div>`;
  }).join('');
}

function setCategory(cat, el) {
  activeCategory = cat;
  document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderProducts();
}

function filterProducts() {
  searchQuery = document.getElementById('searchInput').value;
  renderProducts();
}

function clearSearch() {
  searchQuery = '';
  document.getElementById('searchInput').value = '';
  activeCategory = 'all';
  document.querySelectorAll('.cat-chip').forEach((c, i) => c.classList.toggle('active', i === 0));
  renderProducts();
  return false;
}

function toggleLove(id, btn) {
  if (loved.has(id)) {
    loved.delete(id);
    btn.classList.remove('loved');
    btn.querySelector('svg').setAttribute('fill', 'none');
    showToast('Removed from wishlist', '');
  } else {
    loved.add(id);
    btn.classList.add('loved');
    btn.querySelector('svg').setAttribute('fill', 'currentColor');
    showToast('Added to wishlist ♥', 'success');
  }
}

function addToCart(id, btn) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  // Animate button
  btn.classList.add('added');
  btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Added!`;
  setTimeout(() => {
    btn.classList.remove('added');
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> Add to cart`;
  }, 1500);

  updateCartUI();
  showToast(`${product.name.split(' ').slice(0,3).join(' ')} added to cart`, 'success');
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(id); return; }
  updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  const badge = document.getElementById('cartBadge');
  badge.textContent = totalItems;
  badge.classList.toggle('hidden', totalItems === 0);

  const itemsEl = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');

  if (!cart.length) {
    itemsEl.innerHTML = `<div class="cart-empty">
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      <p>Your cart is empty.<br>Add some items to get started!</p>
    </div>`;
    footer.style.display = 'none';
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        <img src="${item.img}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
        <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    </div>
  `).join('');

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  document.getElementById('subtotalAmt').textContent = '₹' + subtotal.toFixed(2);
  document.getElementById('shippingAmt').textContent = shipping === 0 ? 'Free' : '₹' + shipping.toFixed(2);
  document.getElementById('taxAmt').textContent = '₹' + tax.toFixed(2);
  document.getElementById('totalAmt').textContent = '₹' + total.toFixed(2);
  footer.style.display = 'block';
}

function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  const open = sidebar.classList.toggle('open');
  overlay.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

function checkout() {
  if (!cart.length) return;
  showToast('🎉 Order placed! Thank you for shopping with SmartCart.', 'success');
  cart = [];
  updateCartUI();
  toggleCart();
}

function showToast(message, type) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast' + (type === 'success' ? ' success' : '');
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 2400);
}

// Init
renderProducts();
