const products = [
  { name: "Bamboo Toothbrush", price: 120, img: "https://m.media-amazon.com/images/I/61yKp+O2LCL._SL1500_.jpg", link: "Amazon" },
  { name: "Reusable Cotton Bag", price: 150, img: "https://m.media-amazon.com/images/I/71k+YIvCBAL._SL1500_.jpg", link: "Flipkart" },
  { name: "Eco Steel Straw Set", price: 180, img: "https://m.media-amazon.com/images/I/61uXx6b7X0L._SL1500_.jpg", link: "Meesho" },
  { name: "Coconut Bowl Set", price: 200, img: "https://m.media-amazon.com/images/I/81gYh44O8oL._SL1500_.jpg", link: "Amazon" },
  { name: "Organic Cotton Napkin", price: 130, img: "https://m.media-amazon.com/images/I/71HBr9tVzRL._SL1500_.jpg", link: "Flipkart" }
];

const productContainer = document.getElementById("productContainer");

function renderProducts() {
  productContainer.innerHTML = "";
  products.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>Price: ₹${p.price}</p>
      <p>Available on: <b>${p.link}</b></p>
      <div class="review">
        ⭐⭐⭐⭐☆ (4.3/5)<br>
        <em>Customers love its quality and eco impact!</em>
      </div>
    `;
    productContainer.appendChild(card);
  });
}
renderProducts();

// Login + Dashboard
const loginBtn = document.getElementById("loginBtn");
const loginSection = document.getElementById("login-section");
const loginForm = document.getElementById("loginForm");
const dashboard = document.getElementById("dashboard");
const addProductForm = document.getElementById("addProductForm");

loginBtn.onclick = () => {
  loginSection.classList.toggle("hidden");
};

loginForm.onsubmit = (e) => {
  e.preventDefault();
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user === "admin" && pass === "1234") {
    alert("Login Successful!");
    dashboard.classList.remove("hidden");
    loginForm.classList.add("hidden");
  } else {
    alert("Invalid credentials. Try admin / 1234");
  }
};

// Add Product
addProductForm.onsubmit = (e) => {
  e.preventDefault();
  const pname = document.getElementById("pname").value;
  const pprice = document.getElementById("pprice").value;
  const pimage = document.getElementById("pimage").value;
  const plink = document.getElementById("plink").value;
  products.push({ name: pname, price: pprice, img: pimage, link: plink });
  renderProducts();
  alert("Product Added Successfully!");
  addProductForm.reset();
};
