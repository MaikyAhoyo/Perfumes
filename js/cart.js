async function loadCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartContainer = document.getElementById("cart-container");
  const mainTitle = document.querySelector("h1");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="flex-1 flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
        <div class="bg-slate-50 p-6 rounded-full mb-6">
           <i class="ph-duotone ph-shopping-cart text-6xl text-slate-300"></i>
        </div>
        <h2 class="text-2xl font-bold text-primary mb-2">Your cart is empty</h2>
        <p class="text-slate-500 mb-8">It looks like you haven't added any fragrances yet.</p>
        <a href="index.html" class="inline-flex items-center gap-2 bg-secondary text-primary px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/20">
          <i class="ph-bold ph-arrow-left"></i> Back to Catalogue
        </a>
      </div>
    `;
    updateBadge(0);
    return;
  }

  const itemsHTML = cart
    .map(
      (perfume) => `
    <article class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4 items-center group relative overflow-hidden">
      <div class="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
         <img src="${perfume.image}" alt="${perfume.name}" class="w-full h-full object-cover">
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex justify-between items-start mb-1">
           <div>
             <span class="text-xs font-bold text-secondary uppercase tracking-wider">${perfume.brand}</span>
             <h3 class="text-lg font-bold text-primary truncate">${perfume.name}</h3>
           </div>

           <button onclick="removeFromCart(${perfume.id})" class="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50" aria-label="Remove">
             <i class="ph-bold ph-trash text-xl"></i>
           </button>
        </div>

        <p class="text-sm text-slate-500 mb-2 truncate">${perfume.category.join(", ")}</p>

        <div class="font-bold text-primary text-lg">$${perfume.price}</div>
      </div>
    </article>
  `,
    )
    .join("");

  cartItemsContainer.innerHTML = itemsHTML;
  calculateTotals(cart);
  updateBadge(cart.length);
}

function calculateTotals(cart) {
  const subtotal = cart.reduce((total, item) => total + item.price, 0);
  const tax = subtotal * 0.16;
  const total = subtotal + tax;

  const subtotalEl = document.getElementById("subtotal-price");
  const taxEl = document.getElementById("tax-price");
  const totalEl = document.getElementById("total-price");

  if (!subtotalEl) return;

  subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
  taxEl.innerText = `$${tax.toFixed(2)}`;
  totalEl.innerText = `$${total.toFixed(2)}`;
}

function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const newCart = cart.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(newCart));

  if (newCart.length === 0) {
    loadCart();
  } else {
    loadCart();
  }
}

function clearCart() {
  if (confirm("Are you sure you want to empty your cart?")) {
    localStorage.removeItem("cart");
    loadCart();
  }
}

function checkout() {
  alert("Thank you for your purchase! Your fragrance order is on its way.");
  localStorage.removeItem("cart");
  window.location.href = "index.html";
}

function updateBadge(count) {
  const countBadge = document.getElementById("cart-count");
  if (!countBadge) return;

  if (count > 0) {
    countBadge.innerText = count;
    countBadge.classList.remove("hidden");
    countBadge.classList.add("flex");
  } else {
    countBadge.classList.add("hidden");
    countBadge.classList.remove("flex");
  }
}

document.addEventListener("DOMContentLoaded", loadCart);
