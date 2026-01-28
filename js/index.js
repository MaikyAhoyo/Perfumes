let perfumes = [];
let reviews = [];

async function init() {
  try {
    perfumes = await fetch("data/perfumes.json").then((res) => res.json());
    reviews = await fetch("data/reviews.json").then((res) => res.json());

    initFilters();
    renderPerfumes();
    updateCartCount();
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

function initFilters() {
  const categories = new Set();
  perfumes.forEach((p) => p.category.forEach((c) => categories.add(c)));

  const select = document.getElementById("filter-category");
  if (select) {
    const sortedCategories = [...categories].sort();
    select.innerHTML =
      '<option value="">All Categories</option>' +
      sortedCategories
        .map((c) => `<option value="${c}">${c}</option>`)
        .join("");

    select.addEventListener("change", renderPerfumes);
  }

  document
    .getElementById("filter-favorites")
    ?.addEventListener("change", renderPerfumes);
  document
    .getElementById("filter-min-price")
    ?.addEventListener("input", renderPerfumes);
  document
    .getElementById("filter-max-price")
    ?.addEventListener("input", renderPerfumes);
}

function getStars(rating) {
  return (
    '<i class="ph-fill ph-star text-yellow-400"></i>'.repeat(rating) +
    '<i class="ph ph-star text-gray-300"></i>'.repeat(5 - rating)
  );
}

function renderPerfumes() {
  const container = document.getElementById("perfumes-grid");

  if (!container) return;

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Filter Values
  const showFavorites = document.getElementById("filter-favorites")?.checked;
  const selectedCategory = document.getElementById("filter-category")?.value;
  const minPriceInput = document.getElementById("filter-min-price")?.value;
  const maxPriceInput = document.getElementById("filter-max-price")?.value;

  const minPrice = minPriceInput ? parseFloat(minPriceInput) : null;
  const maxPrice = maxPriceInput ? parseFloat(maxPriceInput) : null;

  const filtered = perfumes.filter((p) => {
    // Favorites Filter
    if (showFavorites && !favorites.some((fav) => fav.id === p.id)) {
      return false;
    }

    // Category Filter
    if (selectedCategory && !p.category.includes(selectedCategory)) {
      return false;
    }

    // Price Filter
    if (minPrice !== null && p.price < minPrice) return false;
    if (maxPrice !== null && p.price > maxPrice) return false;

    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
        <div class="col-span-full text-center py-20">
            <i class="ph ph-magnifying-glass text-6xl text-slate-200 mb-4 inline-block"></i>
            <h3 class="text-xl font-bold text-slate-400 mb-2">No fragrances found</h3>
            <p class="text-slate-400 mb-6">Try adjusting your search criteria</p>
            <button onclick="clearFilters()" class="px-6 py-2 bg-secondary text-primary font-bold rounded-full hover:bg-yellow-300 transition-colors shadow-sm">
                Clear Filters
            </button>
        </div>
      `;
    return;
  }

  container.innerHTML = filtered
    .map((perfume) => {
      const isFav = favorites.some((fav) => fav.id === perfume.id);
      const btnClasses = isFav
        ? "bg-red-500 text-white opacity-100"
        : "bg-white/90 backdrop-blur-md text-gray-500 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100";

      return `
      <article class="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 group flex flex-col h-full border border-gray-100/50">
        <div class="relative h-64 overflow-hidden bg-gray-100">
           <img src="${perfume.image}" alt="${perfume.name}" class="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500">

           <button onclick="toggleFavorite(${
             perfume.id
           })" class="absolute top-3 right-3 px-3 py-3 rounded-full text-xl font-bold transition-all duration-300 shadow-sm flex items-center gap-1 hover:cursor-pointer ${btnClasses}">
             <i class="ph-fill ph-heart"></i>
           </button>
        </div>

        <div class="p-6 flex-1 flex flex-col">
          <div class="mb-4 relative">
             <div class="absolute top-0 right-0 text-xs font-bold text-primary gap-1">
               <i class="ph-fill ph-star text-secondary"></i> ${perfume.rating}
             </div>
             <span class="text-xs font-bold tracking-wider text-secondary uppercase mb-1 block">${
               perfume.brand
             }</span>
             <h2 class="text-xl font-bold text-primary leading-tight mb-2">${
               perfume.name
             }</h2>
             <div class="flex flex-wrap gap-2 mb-3">
               ${perfume.category
                 .map(
                   (c) =>
                     `<span class="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide">${c}</span>`,
                 )
                 .join("")}
             </div>
             <p class="text-slate-500 text-sm line-clamp-3 leading-relaxed">
               ${perfume.description}
             </p>
          </div>

          <div class="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
            <span class="text-2xl font-bold text-primary">$${
              perfume.price
            }</span>

            <div class="flex gap-2">
               <a href="product.html?id=${
                 perfume.id
               }" class="text-slate-400 hover:text-primary hover:bg-slate-100 w-10 h-10 rounded-full flex items-center justify-center transition-all" title="View Details">
                 <i class="ph-bold ph-eye text-xl"></i>
               </a>
               <button onclick="addCart(${
                 perfume.id
               })" class="bg-primary text-white hover:bg-secondary hover:text-primary w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg shadow-primary/20" title="Add to Cart">
                 <i class="ph-bold ph-shopping-cart text-xl"></i>
               </button>
            </div>
          </div>
        </div>
      </article>
  `;
    })
    .join("");
}

function clearFilters() {
  const fFav = document.getElementById("filter-favorites");
  const fCat = document.getElementById("filter-category");
  const fMin = document.getElementById("filter-min-price");
  const fMax = document.getElementById("filter-max-price");

  if (fFav) fFav.checked = false;
  if (fCat) fCat.value = "";
  if (fMin) fMin.value = "";
  if (fMax) fMax.value = "";

  renderPerfumes();
}

function toggleFavorite(perfumeId) {
  const perfume = perfumes.find((p) => p.id === perfumeId);
  if (!perfume) return;

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const index = favorites.findIndex((item) => item.id === perfumeId);

  if (index !== -1) {
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderPerfumes();
    // alert(`"${perfume.name}" remove from favorites.`);
  } else {
    favorites.push(perfume);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderPerfumes();
    // alert(`"${perfume.name}" added to favorites.`);
  }
}

function addCart(perfumeId) {
  const perfume = perfumes.find((p) => p.id === perfumeId);
  if (!perfume) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existe = cart.find((item) => item.id === perfumeId);
  if (existe) {
    alert(`"${perfume.name}" is already in your cart!`);
    return;
  }

  cart.push(perfume);
  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();

  alert(`"${perfume.name}" has been added to the cart.`);
}

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const countBadge = document.getElementById("cart-count");
  if (cart.length > 0) {
    countBadge.innerText = cart.length;
    countBadge.classList.remove("hidden");
    countBadge.classList.add("flex");
  } else {
    countBadge.classList.add("hidden");
    countBadge.classList.remove("flex");
  }
}

function checkUserSession() {
  const session = localStorage.getItem("user_session");
  const userLink = document.getElementById("user-link");
  const userStatus = document.getElementById("user-status");

  if (session && userLink) {
    // User is logged in
    const user = JSON.parse(session);
    if (userStatus) userStatus.classList.remove("hidden");

    // Optional: Change link to logout or profile?
    // For now, let's just make it clear they are logged in.
    userLink.title = `Logged in as ${user.name}`;

    // Simple logout handler via click (optional, but good for "simulated" feel)
    userLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm(`Logout from ${user.name}?`)) {
        localStorage.removeItem("user_session");
        window.location.reload();
      }
    });
  }
}

init();
