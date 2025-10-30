/* script.js
   NATUREKART — simple SPA prototype (no backend).
   Reviews and cart saved in localStorage.
*/

const products = [
  {
    id: "p1",
    name: "Bamboo Toothbrush",
    price: 120,
    desc: "Biodegradable bamboo handle, soft nylon bristles, plastic-free packaging.",
    platforms: ["Amazon","Flipkart","Meesho"],
    img: svgData("Bamboo Toothbrush"),
    rating: 4.3
  },
  {
    id: "p2",
    name: "Reusable Steel Bottle",
    price: 650, // note: slightly above range but common — we'll keep original requirement but user asked 100-200; adjust to fit: replace with ₹180? user insisted avg 100-200 for all products. We'll set price within 100-200.
    price: 180,
    desc: "Insulated stainless-steel bottle — reusable and durable.",
    platforms: ["Amazon","Flipkart"],
    img: svgData("Reusable Bottle"),
    rating: 4.5
  },
  {
    id: "p3",
    name: "Jute Shopping Bag",
    price: 180,
    desc: "Reusable jute bag, strong and biodegradable.",
    platforms: ["Amazon","Meesho"],
    img: svgData("Jute Bag"),
    rating: 4.2
  },
  {
    id: "p4",
    name: "Recycled Paper Notebook",
    price: 140,
    desc: "Notebook made from recycled fibers, eco-friendly stationery.",
    platforms: ["Amazon","Flipkart"],
    img: svgData("Paper Notebook"),
    rating: 4.1
  },
  {
    id: "p5",
    name: "Natural Soap Bar",
    price: 160,
    desc: "Handmade natural soap with organic oils; plastic-free wrap.",
    platforms: ["Meesho","Amazon"],
    img: svgData("Soap Bar"),
    rating: 4.4
  },
  {
    id: "p6",
    name: "Bamboo Cutlery Set",
    price: 130,
    desc: "Portable bamboo fork/knife/spoon set — reusable and compostable.",
    platforms: ["Amazon","Meesho"],
    img: svgData("Cutlery Set"),
    rating: 4.0
  },
  {
    id: "p7",
    name: "Compostable Plate (Pack)",
    price: 110,
    desc: "Plates made from sugarcane bagasse — compostable after use.",
    platforms: ["Flipkart","Amazon"],
    img: svgData("Compostable Plate"),
    rating: 3.9
  },
  {
    id: "p8",
    name: "Reusable Produce Bag",
    price: 120,
    desc: "Mesh produce bags for fruits & vegetables — washable & durable.",
    platforms: ["Amazon","Meesho"],
    img: svgData("Produce Bag"),
    rating: 4.3
  },
  {
    id: "p9",
    name: "Beeswax Food Wrap",
    price: 190,
    desc: "Replace plastic wrap with reusable beeswax cloth wraps.",
    platforms: ["Amazon"],
    img: svgData("Beeswax Wrap"),
    rating: 4.6
  },
  {
    id: "p10",
    name: "Stainless Reusable Straw Set",
    price: 150,
    desc: "Set of metal straws with cleaning brush and case.",
    platforms: ["Flipkart","Meesho"],
    img: svgData("Straw Set"),
    rating: 4.2
  }
];

// ---------- localStorage keys ----------
const CART_KEY = "naturekart_cart_v1";
const REVIEWS_KEY = "naturekart_reviews_v1";

// seed sample reviews if not present
if(!localStorage.getItem(REVIEWS_KEY)){
  const sample = {
    p1: [{name:"Sneha",rating:5,comment:"Great toothbrush, feels solid."}],
    p5: [{name:"Ravi",rating:4,comment:"Soap smells natural and lasts long."}],
    p9: [{name:"Anita",rating:5,comment:"Beeswax wrap replaced so much plastic."}]
  };
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(sample));
}

// DOM references
const grid = document.getElementById("productGrid");
const resultsCount = document.getElementById("resultsCount");
const cartCount = document.getElementById("cartCount");
const cartBtn = document.getElementById("cartBtn");
const cartSlide = document.getElementById("cartSlide");
const closeCart = document.getElementById("closeCart");
const cartItemsDiv = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const overlay = document.getElementById("overlay");
const productModal = document.getElementById("productModal");
const modalClose = document.getElementById("modalClose");
const modalBody = document.getElementById("modalBody");

const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

const filterAmazon = document.getElementById("filterAmazon");
const filterFlipkart = document.getElementById("filterFlipkart");
const filterMeesho = document.getElementById("filterMeesho");

document.getElementById("shopNow").addEventListener("click", ()=>window.scrollTo({top:350,behavior:"smooth"}));

// ---------- utility functions ----------
function svgData(text){
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'>
    <rect width='100%' height='100%' fill='#f3fff4'/>
    <g font-family='Arial' font-weight='700' fill='#2e8b46' font-size='32'>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'>${text}</text>
    </g>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function loadCart(){
  return JSON.parse(localStorage.getItem(CART_KEY) || "{}");
}
function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartUI();
}

function loadReviews(){
  return JSON.parse(localStorage.getItem(REVIEWS_KEY) || "{}");
}
function saveReviews(revs){
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(revs));
}

// ---------- render product grid ----------
function renderProducts(list){
  grid.innerHTML = "";
  list.forEach(p=>{
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h4>${p.name}</h4>
      <div class="small">${p.desc}</div>
      <div class="price">₹${p.price}</div>
      <div class="badges">${p.platforms.map(pl=>`<span class="badge">${pl}</span>`).join("")}</div>
      <div class="actions">
        <button class="btn-plain" data-id="${p.id}" onclick="viewDetails('${p.id}')">View</button>
        <button class="btn-primary" onclick="addToCart('${p.id}')">Add to Cart</button>
      </div>
    `;
    grid.appendChild(card);
  });
  resultsCount.textContent = list.length;
}

// ---------- filters / search ----------
function applyFilters(){
  const q = searchInput.value.trim().toLowerCase();
  const showAmazon = filterAmazon.checked;
  const showFlip = filterFlipkart.checked;
  const showMeesho = filterMeesho.checked;
  let list = products.filter(p=>{
    const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
    const matchesPlatform = (showAmazon && p.platforms.includes("Amazon")) ||
                            (showFlip && p.platforms.includes("Flipkart")) ||
                            (showMeesho && p.platforms.includes("Meesho"));
    return matchesQuery && matchesPlatform;
  });

  const sort = sortSelect.value;
  if(sort === "price-asc") list.sort((a,b)=>a.price-b.price);
  if(sort === "price-desc") list.sort((a,b)=>b.price-a.price);
  if(sort === "rating") list.sort((a,b)=>b.rating - a.rating);

  renderProducts(list);
}

searchInput.addEventListener("input", applyFilters);
sortSelect.addEventListener("change", applyFilters);
filterAmazon.addEventListener("change", applyFilters);
filterFlipkart.addEventListener("change", applyFilters);
filterMeesho.addEventListener("change", applyFilters);

// ---------- cart ----------
function addToCart(id){
  const cart = loadCart();
  if(!cart[id]) cart[id] = {qty:0};
  cart[id].qty += 1;
  saveCart(cart);
  showToast("Added to cart");
}

function updateCartUI(){
  const cart = loadCart();
  const ids = Object.keys(cart);
  cartCount.textContent = ids.reduce((s,i)=>s+cart[i].qty,0);
  cartItemsDiv.innerHTML = "";
  let total = 0;
  ids.forEach(id=>{
    const p = products.find(x=>x.id===id);
    const qty = cart[id].qty;
    total += p.price * qty;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div style="flex:1">
        <div><strong>${p.name}</strong></div>
        <div class="small">₹${p.price} × ${qty} = ₹${p.price * qty}</div>
        <div style="margin-top:8px" class="qty-controls">
          <button onclick="changeQty('${id}', -1)" class="btn-plain">-</button>
          <span>${qty}</span>
          <button onclick="changeQty('${id}', 1)" class="btn-plain">+</button>
          <button onclick="removeItem('${id}')" class="btn-plain">Remove</button>
        </div>
      </div>
    `;
    cartItemsDiv.appendChild(div);
  });
  cartTotalEl.textContent = total.toFixed(0);
  document.getElementById("cartTotal").textContent = total.toFixed(0);
  document.getElementById("cartCount").textContent = ids.reduce((s,i)=>s+cart[i].qty,0);
}

function changeQty(id, delta){
  const cart = loadCart();
  if(!cart[id]) return;
  cart[id].qty += delta;
  if(cart[id].qty <= 0) delete cart[id];
  saveCart(cart);
}
function removeItem(id){
  const cart = loadCart();
  delete cart[id];
  saveCart(cart);
}

cartBtn.addEventListener("click", ()=>{
  cartSlide.classList.add("open");
  overlay.style.display = "block";
  updateCartUI();
});
closeCart.addEventListener("click", ()=>{
  cartSlide.classList.remove("open");
  overlay.style.display = "none";
});
overlay.addEventListener("click", ()=>{
  productModal.style.display = "none";
  cartSlide.classList.remove("open");
  overlay.style.display = "none";
});

// ---------- product modal with reviews ----------
function viewDetails(id){
  const p = products.find(x=>x.id===id);
  const reviews = loadReviews();
  const revs = reviews[id] || [];
  productModal.style.display = "flex";
  overlay.style.display = "block";

  modalBody.innerHTML = `
    <div style="display:flex;gap:18px;align-items:flex-start">
      <img src="${p.img}" alt="${p.name}" style="width:300px;height:180px;border-radius:8px;object-fit:cover">
      <div style="flex:1">
        <h2>${p.name}</h2>
        <div class="small">${p.desc}</div>
        <div style="margin-top:8px"><strong>Price: ₹${p.price}</strong></div>
        <div style="margin-top:8px" class="badges">${p.platforms.map(pl=>`<span class="badge">${pl}</span>`).join("")}</div>
        <div style="margin-top:12px">
          <button class="btn-primary" onclick="addToCart('${p.id}')">Add to Cart</button>
          <button class="btn-plain" onclick="scrollToReviews()">See Reviews</button>
        </div>
      </div>
    </div>

    <hr style="margin:14px 0">

    <section id="reviewsSection">
      <h3>Customer Reviews (<span id="revCount">${revs.length}</span>)</h3>
      <div id="reviewList" class="review-list">
        ${revs.map(r=>`<div class="review"><div><strong>${escapeHtml(r.name)}</strong> <span class="small"> - ${r.rating}★</span></div><div class="small">${escapeHtml(r.comment)}</div></div>`).join("")}
      </div>

      <div style="margin-top:12px">
        <h4>Add a review</h4>
        <input id="revName" placeholder="Your name" style="padding:8px;border-radius:6px;border:1px solid #ddd;width:50%" />
        <select id="revRating" style="padding:8px;border-radius:6px;border:1px solid #ddd;margin-left:8px">
          <option value="5">5 - Excellent</option>
          <option value="4">4 - Very good</option>
          <option value="3">3 - Good</option>
          <option value="2">2 - Fair</option>
          <option value="1">1 - Poor</option>
        </select>
        <div style="margin-top:8px">
          <textarea id="revComment" placeholder="Write your review" style="width:100%;min-height:80px;padding:8px;border-radius:6px;border:1px solid #ddd"></textarea>
        </div>
        <div style="margin-top:8px">
          <button class="cta" id="submitReviewBtn">Submit Review</button>
        </div>
      </div>
    </section>
    <div class="note small" style="margin-top:12px">
      Note: Product availability tags show common platforms where similar items are sold (Amazon, Flipkart, Meesho). For local Bangalore availability check the marketplaces.
    </div>
  `;

  document.getElementById("submitReviewBtn").onclick = ()=>{
    const name = document.getElementById("revName").value.trim() || "Anonymous";
    const rating = parseInt(document.getElementById("revRating").value,10);
    const comment = document.getElementById("revComment").value.trim();
    if(!comment){ alert("Please write a short review"); return; }
    const reviewsObj = loadReviews();
    if(!reviewsObj[id]) reviewsObj[id] = [];
    reviewsObj[id].unshift({name,rating,comment});
    saveReviews(reviewsObj);
    viewDetails(id); // refresh modal
  };
}

modalClose.addEventListener("click", ()=>{
  productModal.style.display = "none";
  overlay.style.display = "none";
});
function scrollToReviews(){ document.getElementById("reviewsSection").scrollIntoView({behavior:"smooth"}) }

// ---------- checkout (mock) ----------
document.getElementById("checkoutBtn").addEventListener("click", ()=>{
  const cart = loadCart(); const ids = Object.keys(cart);
  if(ids.length === 0){ alert("Your cart is empty"); return; }
  // simple mock checkout
  if(confirm("Proceed to checkout? (This is a demo — no real payment)")){
    // clear cart
    localStorage.removeItem(CART_KEY);
    updateCartUI();
    alert("Thank you! Your demo order is placed. (In real app you'd integrate payment & order management)");
    cartSlide.classList.remove("open"); overlay.style.display = "none";
  }
});

// small toast
function showToast(msg){
  const t = document.createElement("div");
  t.textContent = msg; t.style.position="fixed";t.style.bottom="22px";t.style.left="50%";t.style.transform="translateX(-50%)";
  t.style.background="#222";t.style.color="#fff";t.style.padding="10px 14px";t.style.borderRadius="8px";t.style.zIndex=120;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),1600);
}

function escapeHtml(s){ return s.replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])); }

// initial render
applyFilters();
updateCartUI();

// expose a couple functions for inline handlers
window.addToCart = addToCart;
window.viewDetails = viewDetails;
window.changeQty = changeQty;
window.removeItem = removeItem;
