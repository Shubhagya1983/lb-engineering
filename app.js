// Google Sheet Live Integration for LB Engineering
// Automatically reads data from Google Spreadsheet

const SHEET_ID = '1QW7hjUwejMcnbDeZCqyd0O6SMCBFkPaVt3tc4uPhnk';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

let products = [];
let cart = [];

document.addEventListener("DOMContentLoaded", () => {
    fetchProductsFromSheet();
});

// Fetch Data from Google Sheet
async function fetchProductsFromSheet() {
    try {
        const response = await fetch(SHEET_URL);
        const text = await response.text();
        const json = JSON.parse(text.substr(47).slice(0, -2));
        const rows = json.table.rows;
        
        products = rows.map((row, index) => {
            return {
                id: row.c[0] ? parseInt(row.c[0].v) : index + 1,
                name: row.c[1] ? row.c[1].v : '',
                model: row.c[2] ? row.c[2].v : '',
                brand: row.c[3] ? row.c[3].v : '',
                category: row.c[4] ? row.c[4].v : '',
                spec: row.c[5] ? row.c[5].v : '',
                price: row.c[6] ? parseFloat(row.c[6].v) : 0,
                stock: row.c[7] ? parseInt(row.c[7].v) : 0,
                image: row.c[8] ? row.c[8].v : 'https://via.placeholder.com/200'
            };
        });

        renderProducts(products);
        populateProductSelect();
        updateStockAlerts();
    } catch (error) {
        console.error("Error fetching data from Google Sheet:", error);
    }
}

// Render Products UI
function renderProducts(productsList) {
    const container = document.getElementById("products-container");
    container.innerHTML = "";
    
    if(productsList.length === 0) {
        container.innerHTML = "<p style='padding:20px; color:#747d8c;'>No products found in this category.</p>";
        return;
    }
    
    productsList.forEach(prod => {
        let stockClass = "in-stock";
        let stockText = `In Stock (${prod.stock})`;
        
        if (prod.stock === 0) {
            stockClass = "out-of-stock";
            stockText = "Out of Stock";
        } else if (prod.stock <= 3) {
            stockClass = "low-stock";
            stockText = `Low Stock (${prod.stock})`;
        }

        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div>
                <div class="product-img" style="background:#fff; display:flex; align-items:center; justify-content:center;">
                    <img src="${prod.image}" alt="${prod.name}" style="max-width:100%; max-height:180px; object-fit:contain; padding:10px;">
                </div>
                <div class="product-info">
                    <span class="product-brand">${prod.brand}</span>
                    <h3 class="product-title">${prod.name}</h3>
                    <p style="font-size:0.8rem; color:#747d8c; margin-bottom:5px;">Model: ${prod.model}</p>
                    <div class="product-spec">${prod.spec}</div>
                    <div class="product-meta">
                        <span class="price">LKR ${prod.price.toLocaleString()}</span>
                        <span class="stock-status ${stockClass}">${stockText}</span>
                    </div>
                </div>
            </div>
            <button class="btn-add-cart" onclick="addToCart(${prod.id})" ${prod.stock === 0 ? 'disabled style="background:#b2bec3;"' : ''}>
                ${prod.stock === 0 ? 'Unavailable' : '<i class="fa-solid fa-cart-plus"></i> Add to Cart'}
            </button>
        `;
        container.appendChild(card);
    });
}

// Category Filter System
function filterCategory(cat) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (cat === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category.toLowerCase() === cat.toLowerCase());
        renderProducts(filtered);
    }
}

// Cart Core Functions
function toggleCart() {
    document.getElementById("cart-sidebar").classList.toggle("open");
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product || product.stock <= 0) return;

    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
        if (cartItem.qty < product.stock) {
            cartItem.qty++;
        } else {
            alert("Insufficient stock available.");
            return;
        }
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    const cartContainer = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");
    
    cartContainer.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
        count += item.qty;

        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <small>LKR ${item.price.toLocaleString()} x ${item.qty}</small>
            </div>
            <i class="fa-solid fa-trash" style="color:#ff4757; cursor:pointer;" onclick="removeFromCart(${item.id})"></i>
        `;
        cartContainer.appendChild(div);
    });

    cartCount.innerText = count;
    cartTotal.innerText = total.toLocaleString();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function checkoutOrder() {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }
    alert("⚡ LB Engineering Gateway Simulation:\nOrder placed successfully! (Note: Connect a backend API to permanently auto-deduct stock from Google Sheets).");
    cart = [];
    updateCartUI();
    toggleCart();
}

// Dashboard Portal Logic
function toggleDashboard() {
    const modal = document.getElementById("dashboard-modal");
    modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}

function updateStockAlerts() {
    const lowStockList = document.getElementById("low-stock-list");
    if(!lowStockList) return;
    lowStockList.innerHTML = "";
    
    const lowStockItems = products.filter(p => p.stock <= 3);
    
    if(lowStockItems.length === 0) {
        lowStockList.innerHTML = "<li><i class='fa-solid fa-circle-check' style='color:green'></i> All inventory stock healthy.</li>";
        return;
    }

    lowStockItems.forEach(p => {
        const li = document.createElement("li");
        li.style.color = p.stock === 0 ? "#ff4757" : "#ffa502";
        li.style.marginBottom = "5px";
        li.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <strong>${p.name}</strong> - Only ${p.stock} left!`;
        lowStockList.appendChild(li);
    });
}

function populateProductSelect() {
    const select = document.getElementById("select-product");
    if(!select) return;
    select.innerHTML = "";
    products.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.innerText = `${p.brand} - ${p.name} (${p.model})`;
        select.appendChild(opt);
    });
}

function updateStock(event) {
    event.preventDefault();
    alert("Notice: Data is managed live from Google Sheets. Please update prices/stock directly inside your Spreadsheet rows to change them permanently.");
    toggleDashboard();
}
