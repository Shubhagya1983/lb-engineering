// Database Mockup Array / Initial Product Records
let products = [
    { id: 1, name: "Delta DVP-14SS2", model: "DVP14SS211R", brand: "Delta", category: "PLC", spec: "8 DI / 6 DO (Relay), 24VDC", price: 24500, stock: 12, icon: "fa-solid fa-microchip" },
    { id: 2, name: "Siemens SIMATIC S7-1200", model: "CPU 1214C DC/DC/DC", brand: "Siemens", category: "PLC", spec: "14 DI / 10 DO / 2 AI, 24VDC", price: 89000, stock: 3, icon: "fa-solid fa-microchip" },
    { id: 3, name: "Zoncn VFD Inverter", model: "NZ100-2R2G-2", brand: "Zoncn", category: "VFD", spec: "2.2kW, 3-Phase 220V Input", price: 38000, stock: 15, icon: "fa-solid fa-bolt-lightning" },
    { id: 4, name: "Hyundai N700E Series VFD", model: "N700E-055HF", brand: "Hyundai", category: "VFD", spec: "5.5kW / 7.5HP, 380V 3-Phase", price: 74000, stock: 2, icon: "fa-solid fa-bolt-lightning" },
    { id: 5, name: "Wecon HMI Touch Panel", model: "PI3070i", brand: "Wecon", category: "HMI", spec: "7 inch TFT, 800x480, Ethernet", price: 32000, stock: 8, icon: "fa-solid fa-tv" },
    { id: 6, name: "Autonics Photoelectric Sensor", model: "BR200-DDTN", brand: "Autonics", category: "Sensors", spec: "Diffuse reflective, 200mm, NPN", price: 6800, stock: 25, icon: "fa-solid fa-eye" }
];

let cart = [];

// Initialize Systems
document.addEventListener("DOMContentLoaded", () => {
    renderProducts(products);
    updateStockAlerts();
    populateProductSelect();
});

// Render Product Items UI
function renderProducts(productsList) {
    const container = document.getElementById("products-container");
    container.innerHTML = "";
    
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
                <div class="product-img">
                    <i class="${prod.icon}"></i>
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
        const filtered = products.filter(p => p.category === cat);
        renderProducts(filtered);
    }
}

// Shopping Cart Core Functions
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
            alert("Cannot add more items than available in technical inventory stock.");
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

// Checkout & E-Commerce Automation Transaction Simulator
function checkoutOrder() {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    // Deduct quantity from original inventory (Automated Action)
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product) {
            product.stock -= cartItem.qty;
        }
    });

    alert("? LB Engineering Gateway Simulation:\nPayment Successful! Order Confirmed. Database inventory stock updated automatically.");
    
    cart = [];
    updateCartUI();
    renderProducts(products);
    updateStockAlerts();
    toggleCart();
}

// Administrative Panel / Dashboard Controls
function toggleDashboard() {
    const modal = document.getElementById("dashboard-modal");
    modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}

function updateStockAlerts() {
    const lowStockList = document.getElementById("low-stock-list");
    lowStockList.innerHTML = "";
    
    const lowStockItems = products.filter(p => p.stock <= 3);
    
    if(lowStockItems.length === 0) {
        lowStockList.innerHTML = "<li><i class='fa-solid fa-circle-check' style='color:green'></i> All automation system stock lines healthy.</li>";
        return;
    }

    lowStockItems.forEach(p => {
        const li = document.createElement("li");
        li.style.color = p.stock === 0 ? "#ff4757" : "#ffa502";
        li.style.marginBottom = "5px";
        li.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <strong>${p.name}</strong> - Only ${p.stock} Units Left!`;
        lowStockList.appendChild(li);
    });
}

function populateProductSelect() {
    const select = document.getElementById("select-product");
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
    const pid = parseInt(document.getElementById("select-product").value);
    const newStock = parseInt(document.getElementById("input-stock").value);
    const newPrice = parseInt(document.getElementById("input-price").value);

    const product = products.find(p => p.id === pid);
    if(product) {
        product.stock = newStock;
        product.price = newPrice;
        
        alert(`Successfully updated data logs for ${product.name}`);
        renderProducts(products);
        updateStockAlerts();
        document.getElementById("stock-form").reset();
        toggleDashboard();
    }
}