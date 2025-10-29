/* script.js (UNMODIFIED FROM PREVIOUS RESPONSE, RETAINS ALL FIXES)
  Shared across pages:
  - product data
  - render product lists
  - cart functions using localStorage
  - cart count sync
  - small UI helpers (menu toggle, preview on home)
*/

const STORAGE_KEY = 'stackly_cart_v1';

// ----------------- Product data -----------------
const PRODUCTS = [
  // Milk
  { id: 'milk-01', cat: 'Milk', name: 'Organic Milk 1L', price: 60, desc: 'Farm fresh pasteurized milk Important for the nervous system and the formation of red blood cells.', img: 'fresh milk.png' },
  { id: 'milk-02', cat: 'Milk', name: 'Toned Milk 1L', price: 45, desc: 'Good quality everyday milk Added to toned milk to compensate for the fat removal, this vitamin is crucial for vision, immune function, and skin health. ', img: 'toneds.png' },
  { id: 'ghee-03', cat: 'Milk', name: 'ghee 1L', price: 200, desc: 'fresh ghee  Important for eye and skin health, and supports the immune system.', img: 'ghee.png' },


  { id: 'milk-04', cat: 'Milk', name: 'butter (50gm)', price: 70, desc: 'fresh butter Crucial for bone development and strength, as it helps the body absorb calcium. ', img: 'butter.png' },
  { id: 'milk-05', cat: 'Milk', name: 'cheese', price: 60, desc: 'Good quality cheese B-Complex Vitamins (Riboflavin, Niacin, Pantothenic Acid): Essential for energy production and other metabolic processes. ', img: 'cheese.png' },
  { id: 'milk-06', cat: 'Milk', name: 'milkshake', price: 100, desc: 'fresh milkshake Contains carbohydrates for energy, fluids, and electrolytes for rehydration.', img: 'milkshake.png' },
  // Bread
  { id: 'bread-01', cat: 'Bread', name: 'Farmhouse Bread', price: 40, desc: 'Freshly baked loaf  Supports energy metabolism and healthy nervous system function.', img: 'bread.png' },
  { id: 'bread-02', cat: 'Bread', name: 'Multigrain Bread', price: 55, desc: 'Healthy multigrain loaf Folate (Vitamin B9) is also present, which is essential for DNA synthesis and repair. ', img: 'multigrain bread.png' },

  // Fruits
  { id: 'fruit-01', cat: 'Fruits', name: 'Seasonal Fruit Box', price: 199, desc: 'Assorted seasonal fruits Because they are harvested at peak ripeness, seasonal fruits are generally juicier and more flavorful.', img: 'fruite box.png' },
  { id: 'fruit-02', cat: 'Fruits', name: 'Bananas (1kg)', price: 60, desc: 'Ripe bananas Crucial for regulating blood pressure and supporting overall heart health. ', img: 'banana.png' },

{ id: 'fruit-03', cat: 'Fruits', name: 'apple', price: 250, desc: 'Assorted seasonal apple A powerful antioxidant that boosts the immune system, protects against free radical damage, and supports skin health. ', img: 'apple.png' },
  { id: 'fruit-04', cat: 'Fruits', name: 'orange (1kg)', price: 60, desc: 'Ripe orange This B vitamin is vital for cell division and the creation of DNA. It is especially important for pregnant women, as it helps prevent birth defects.', img: 'orange.png' },

  { id: 'fruit-05', cat: 'Fruits', name: 'grapes', price: 80, desc: 'Assorted seasonal grapes Crucial for healthy blood clotting and maintaining strong, healthy bones. ', img: 'grapes.png' },
  { id: 'fruit-06', cat: 'Fruits', name: 'guava (1kg)', price: 50, desc: 'Ripe guava Guava is a top source, boosting the immune system and promoting skin health by aiding collagen synthesis. ', img: 'guava.png' },
  // Vegetables
  { id: 'veg-01', cat: 'Vegetables', name: 'Tomato (1kg)', price: 40, desc: 'Farm tomatoes Tomatoes are a good source of essential vitamins, minerals, and antioxidants like lycopene and beta-carotene. ', img: 'tomato.png' },
  { id: 'veg-02', cat: 'Vegetables', name: 'Potato (1kg)', price: 35, desc: 'Fresh potatoes Potatoes are a good source of vitamin C, vitamin B6, and potassium, containing more potassium than a banana. ', img: 'potato.png' },

  { id: 'veg-03', cat: 'vegetables', name: 'carrot (1kg)', price: 40, desc: 'farm carrot They are also rich in vitamin K, potassium, fiber, vitamin C, vitamin B6, folate, and other minerals like calcium and magnesium. ', img: 'carrot.png' },
  { id: 'veg-04', cat: 'vegetables', name: 'cabbage (1kg)', price: 35, desc: 'fresh cabbage High in Vitamin C, Vitamin K, and fiber.', img: 'cabbage.png' },
  
  { id: 'veg-05', cat: 'vegetables', name: 'coconut (1kg)', price: 75, desc: 'fresh coconut The high fiber content in coconut meat promotes digestive health, regulates bowel movements, and helps control blood sugar levels by slowing digestion.', img: 'coconut.png' },
  { id: 'veg-06', cat: 'vegetables', name: 'green chilli (1kg)', price: 80, desc: 'fresh chilli Boosts the immune system, Aids in collagen production for healthy skin, and Acts as an antioxidant.', img: 'green chilli.png' },
];

// ----------------- Storage helpers -----------------
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}
function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  updateCartCount();
}

// ----------------- Cart logic -----------------
function addToCart(productId, qty = 1) {
  const cart = loadCart();
  if (!cart[productId]) {
    const p = PRODUCTS.find(x => x.id === productId);
    if (!p) return;
    // FIX: When adding a new item, ensure qty starts from 1 if called with qty=1
    cart[productId] = { id: p.id, name: p.name, price: p.price, qty: 0 }; 
  }
  cart[productId].qty += qty;
  saveCart(cart);
  notify('Added to cart');
}
function removeFromCart(productId) {
  const cart = loadCart();
  delete cart[productId];
  saveCart(cart);
}
function changeQty(productId, newQty) {
  const cart = loadCart();
  if (!cart[productId]) return;
  cart[productId].qty = Math.max(0, newQty);
  if (cart[productId].qty === 0) delete cart[productId];
  saveCart(cart);
}
function clearCart() {
  localStorage.removeItem(STORAGE_KEY);
  updateCartCount();
}

// ----------------- UI helpers -----------------
function updateCartCount() {
  const cart = loadCart();
  const count = Object.values(cart).reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
}

// lightweight notification
function notify(msg) {
  const t = document.createElement('div');
  t.textContent = msg;  
  t.style.position='fixed'; t.style.right='18px'; t.style.bottom='18px';
  t.style.background='rgba(0,0,0,0.8)'; t.style.color='#fff';  
  t.style.padding='10px 14px'; t.style.borderRadius='10px';
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),1500);
}

// ----------------- Render products -----------------
function createProductCard(p) {
  const div = document.createElement('div');
  div.className = 'card';
  div.innerHTML = `
    <div class="product-image"><img src="${p.img}" alt="${p.name}"></div>
    <h4>${p.name}</h4>
    <div class="muted" style="font-size:13px">${p.desc}</div>
    <div class="price">₹${p.price}</div>
    <div style="margin-top:auto;display:flex;gap:8px">
      <button class="btn primary add-btn" data-id="${p.id}">Add</button>
      <button class="btn outline info-btn" data-id="${p.id}">Info</button>
    </div>
  `;
  return div;
}

function renderProductsGrid(containerSelector, filterCat = null) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.innerHTML = '';
  const list = filterCat ? PRODUCTS.filter(p => p.cat === filterCat) : PRODUCTS;
  list.forEach(p => container.appendChild(createProductCard(p)));

  // attach listeners
  container.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      addToCart(btn.dataset.id, 1);
      updateCartCount();
    });
  });
  container.querySelectorAll('.info-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const prod = PRODUCTS.find(x => x.id === btn.dataset.id);
      alert(`${prod.name}\n\n${prod.desc}\nPrice: ₹${prod.price}`);
    });
  });
}

// ----------------- Render cart page -----------------
function renderCartArea() {
  const area = document.getElementById('cart-area');
  if (!area) return;
  const cart = loadCart();
  const keys = Object.keys(cart);
  area.innerHTML = '';
  if (keys.length === 0) {
    area.innerHTML = '<div class="muted">Your cart is empty — add some fresh items!</div>';
    document.getElementById('checkout-btn')?.setAttribute('disabled','disabled');
    return;
  }
  document.getElementById('checkout-btn')?.removeAttribute('disabled');
  const list = document.createElement('div');
  list.style.display = 'flex'; list.style.flexDirection = 'column'; list.style.gap = '12px';
  let subtotal = 0;
  keys.forEach(k => {
    const it = cart[k];
    subtotal += it.qty * it.price;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div style="flex:1">
        <strong>${it.name}</strong>
        <div class="muted">₹${it.price} each</div>
      </div>
      <div class="qty-controls">
        <button class="btn outline dec" data-id="${it.id}">-</button>
        <div class="qty-display">${it.qty}</div> 
        <button class="btn outline inc" data-id="${it.id}">+</button>
      </div>
      <div style="min-width:100px;text-align:right">
        <div style="font-weight:900">₹${it.qty * it.price}</div>
        <button class="btn outline rm" data-id="${it.id}">Remove</button>
      </div>
    `;
    list.appendChild(row);
  });
  const totalRow = document.createElement('div');
  totalRow.style.fontWeight = '900'; totalRow.style.marginTop = '10px';
  totalRow.textContent = `Subtotal: ₹${subtotal}`;
  area.appendChild(list);
  area.appendChild(totalRow);

  // attach handlers
  area.querySelectorAll('.dec').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.id; const cart = loadCart();
    if (!cart[id]) return;
    changeQty(id, cart[id].qty - 1);
    renderCartArea();
    updateCartCount();
  }));
  area.querySelectorAll('.inc').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.id; const cart = loadCart();
    if (!cart[id]) return;
    changeQty(id, cart[id].qty + 1);
    renderCartArea();
    updateCartCount();
  }));
  area.querySelectorAll('.rm').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.id;
    if (confirm('Remove item from cart?')) {
      removeFromCart(id);
      renderCartArea();
      updateCartCount();
    }
  }));

  // Clear Cart functionality
  document.getElementById('clear-cart')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your entire cart?')) {
        clearCart();
        renderCartArea();
    }
  });
}

// ----------------- On page load init -----------------
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  // render product previews on home (first 4)
  const previewGrid = document.getElementById('preview-grid');
  if (previewGrid) {
    const previewItems = PRODUCTS.slice(0, 4);
    previewItems.forEach(p => previewGrid.appendChild(createProductCard(p)));
  }

  // products page listing
  const productsGrid = document.getElementById('products-grid');
  if (productsGrid) {
    renderProductsGrid('#products-grid');
  }

  // cart page
  if (document.getElementById('cart-area')) {
    renderCartArea();
  }

  // FIX: Mobile menu toggle functionality
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });
  }
});

const themeBtn = document.getElementById("theme-toggle");
if (themeBtn) {
  // load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️";
  } else if (savedTheme === "light") {
      themeBtn.textContent = "🌙";
  } else {
    // Default to light if no theme saved, ensuring the moon icon is shown
    themeBtn.textContent = "🌙";
  }

  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
      themeBtn.textContent = "☀️";
    } else {
      localStorage.setItem("theme", "light");
      themeBtn.textContent = "🌙";
    }
  });
}


// { id: 'veg-01', cat: 'Vegetables', ... }
// { id: 'veg-03', cat: 'vegetables', ... }
cat: 'Vegetables'
function filterProducts(category = null) {
  const searchInput = document.getElementById('product-search').value.toLowerCase();
  const container = document.getElementById('products-grid');
  container.innerHTML = '';
  let list = PRODUCTS;

  if (category && category !== 'All') {
    list = list.filter(p => p.cat === category);
  }

  if (searchInput) {
    list = list.filter(p => p.name.toLowerCase().includes(searchInput));
  }

  list.forEach(p => container.appendChild(createProductCard(p)));
}
cart[productId] = { id: p.id, name: p.name, price: p.price, qty: 0 };
cart[productId].qty += qty;
cart[productId] = { id: p.id, name: p.name, price: p.price, qty: qty };

// Highlight active page link
document.querySelectorAll('.main-nav .nav-link').forEach(link => {
  if(link.href === window.location.href){
    link.classList.add('active');
  }
});

document.getElementById('checkout-btn')?.addEventListener('click', () => {
  window.location.href = '404.html';
});
