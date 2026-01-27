let perfumes = [];
let reviews = [];

async function init() {
  try {
    perfumes = await fetch("data/perfumes.json").then((res) => res.json());
    reviews = await fetch("data/reviews.json").then((res) => res.json());
    renderPerfumes();
    updateCartCount();
  } catch (error) {
    console.error("Error loading data:", error);
  }
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

  container.innerHTML = perfumes
    .map(
      (perfume) => `
      <article class="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 group flex flex-col h-full border border-gray-100/50">
        <div class="relative h-64 overflow-hidden bg-gray-100">
           <img src="${perfume.image}" alt="${perfume.name}" class="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500">

           <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm flex items-center gap-1">
             <i class="ph-fill ph-star text-secondary"></i> ${perfume.rating}
           </div>
        </div>

        <div class="p-6 flex-1 flex flex-col">
          <div class="mb-4">
             <span class="text-xs font-bold tracking-wider text-secondary uppercase mb-1 block">${perfume.brand}</span>
             <h2 class="text-xl font-bold text-primary leading-tight mb-2">${perfume.name}</h2>
             <div class="flex flex-wrap gap-2 mb-3">
               ${perfume.category.map((c) => `<span class="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide">${c}</span>`).join("")}
             </div>
             <p class="text-slate-500 text-sm line-clamp-3 leading-relaxed">
               ${perfume.description}
             </p>
          </div>

          <div class="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
            <span class="text-2xl font-bold text-primary">$${perfume.price}</span>

            <div class="flex gap-2">
               <a href="product.html?id=${perfume.id}" class="text-slate-400 hover:text-primary hover:bg-slate-100 w-10 h-10 rounded-full flex items-center justify-center transition-all" title="View Details">
                 <i class="ph-bold ph-eye text-xl"></i>
               </a>
               <button onclick="addCart(${perfume.id})" class="bg-primary text-white hover:bg-secondary hover:text-primary w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg shadow-primary/20" title="Add to Cart">
                 <i class="ph-bold ph-shopping-cart text-xl"></i>
               </button>
            </div>
          </div>
        </div>
      </article>
  `,
    )
    .join("");
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

init();
