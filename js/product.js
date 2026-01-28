let perfumes = [];
let reviews = [];

async function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id"));

  if (!productId) {
    window.location.href = "index.html";
    return;
  }

  try {
    perfumes = await fetch("data/perfumes.json").then((res) => res.json());
    reviews = await fetch("data/reviews.json").then((res) => res.json());

    const product = perfumes.find((p) => p.id === productId);

    if (!product) {
      alert("Product not found");
      window.location.href = "index.html";
      return;
    }

    renderProductDetails(product);
    renderReviews(productId);
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

function renderProductDetails(product) {
  document.getElementById("breadcrumb-current").innerText = product.name;
  document.getElementById("product-image").src = product.image;
  document.getElementById("product-image").alt = product.name;
  document.getElementById("product-brand").innerText = product.brand;
  document.getElementById("product-title").innerText = product.name;
  document.getElementById("product-description").innerText =
    product.description;
  document.getElementById("product-price").innerText = `$${product.price}`;
  document.getElementById("product-rating").innerText = product.rating;

  const catsContainer = document.getElementById("product-categories");
  catsContainer.innerHTML = product.category
    .map(
      (c) =>
        `<span class="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-slate-200">${c}</span>`,
    )
    .join("");

  const btn = document.getElementById("add-to-cart-btn");
  btn.onclick = () => addCart(product.id);

  document.getElementById("product-container").classList.remove("opacity-0");
}

function renderReviews(productId) {
  const list = document.getElementById("reviews-list");
  const productReviews = reviews.filter((r) => r.perfume_id === productId);

  if (productReviews.length === 0) {
    list.innerHTML = `
            <div class="text-center py-12 bg-white rounded-2xl border-dashed border-2 border-slate-200">
                <i class="ph-duotone ph-chat-teardrop-text text-4xl text-slate-300 mb-2"></i>
                <p class="text-slate-500 font-medium">Be the first to leave a review.</p>
            </div>
        `;
    return;
  }

  list.innerHTML = productReviews
    .map(
      (review) => `
        <article class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-4 transition-transform hover:-translate-y-1 duration-300">
          <img src="${review.avatar}" alt="${review.user_name}" class="w-12 h-12 rounded-full bg-slate-100 shrink-0 object-cover">
          <div class="flex-1">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h4 class="font-bold text-primary">${review.user_name}</h4>
                <span class="text-xs text-slate-400">${review.date}</span>
              </div>
              <div class="flex text-sm">
                ${getStars(review.rating)}
              </div>
            </div>

            <p class="text-slate-600 leading-relaxed text-sm">"${review.comment}"</p>
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
