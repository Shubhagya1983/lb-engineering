// LB Engineering - Hardcoded Verified Products Inventory
let products = [
    {
        id: 1,
        name: "T200-0R75G-2",
        model: "T200-0R75G-2",
        brand: "Zoncn",
        category: "VFD",
        spec: "230v input 0.75kw",
        price: 32200,
        stock: 3,
        image: "https://i.postimg.cc/3xqw4vmC/images.jpg"
    },
    {
        id: 2,
        name: "T200-0R75G-4",
        model: "T200-0R75G-4",
        brand: "Zoncn",
        category: "VFD",
        spec: "380v input 0.75kw",
        price: 33350,
        stock: 3,
        image: "https://i.postimg.cc/3xqw4vmC/images.jpg"
    },
    {
        id: 3,
        name: "T200-1R5G-2",
        model: "T200-1R5G-2",
        brand: "Zoncn",
        category: "VFD",
        spec: "230v input 1.5kw",
        price: 34500,
        stock: 3,
        image: "https://i.postimg.cc/3xqw4vmC/images.jpg"
    },
    {
        id: 4,
        name: "T200-1R5G-4",
        model: "T200-1R5G-4",
        brand: "Zoncn",
        category: "VFD",
        spec: "380v input 1.5kw",
        price: 35650,
        stock: 3,
        image: "https://i.postimg.cc/3xqw4vmC/images.jpg"
    },
    {
        id: 5,
        name: "T200-2R2G-2",
        model: "T200-2R2G-2",
        brand: "Zoncn",
        category: "VFD",
        spec: "230v input 2.2kw",
        price: 43470,
        stock: 3,
        image: "https://i.postimg.cc/3xqw4vmC/images.jpg"
    },
    {
        id: 6,
        name: "T200-2R2G-4",
        model: "T200-2R2G-4",
        brand: "Zoncn",
        category: "VFD",
        spec: "380v input 2.2kw",
        price: 45080,
        stock: 3,
        image: "https://i.postimg.cc/3xqw4vmC/images.jpg"
    },
    {
        id: 7,
        name: "T200-3R7G-2",
        model: "T200-3R7G-2",
        brand: "Zoncn",
        category: "VFD",
        spec: "230v input 3.7kw",
        price: 61640,
        stock: 3,
        image: "https://i.postimg.cc/3xqw4vmC/images.jpg"
    },
    {
        id: 8,
        name: "T200-3R7G-4",
        model: "T200-3R7G-4",
        brand: "Zoncn",
        category: "VFD",
        spec: "380v input 3.7kw",
        price: 61640,
        stock: 3,
        image: "https://i.postimg.cc/3xqw4vmC/images.jpg"
    },
    {
        id: 9,
        name: "T200-11G-4",
        model: "T200-11G-4",
        brand: "Zoncn",
        category: "VFD",
        spec: "380v input 11kw",
        price: 94875,
        stock: 3,
        image: "https://i.postimg.cc/3xqw4vmC/images.jpg"
    },
    {
        id: 10,
        name: "T200-15G-4",
        model: "T200-15G-4",
        brand: "Zoncn",
        category: "VFD",
        spec: "380v input 15kw",
        price: 118335,
        stock: 3,
        image: "https://i.postimg.cc/3xqw4vmC/images.jpg"
    },
    {
        id: 11,
        name: "T200-18.5G-4",
        model: "T200-18.5G-4",
        brand: "Zoncn",
        category: "VFD",
        spec: "380v input 18.5kw",
        price: 120750,
        stock: 3,
        image: "https://i.postimg.cc/3xqw4vmC/images.jpg"
    },
    {
        id: 12,
        name: "T200-22G-4",
        model: "T200-22G-4",
        brand: "Zoncn",
        category: "VFD",
        spec: "380v input 22kw",
        price: 130295,
        stock: 3,
        image: "https://i.postimg.cc/3xqw4vmC/images.jpg"
    }
];

let cart = [];

document.addEventListener("DOMContentLoaded", () => {
    renderProducts(products);
    populateProductSelect();
    updateStockAlerts();
});

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
                <div class="product-img" style="background:#fff; display:flex; align-items:center; justify-content:center; height:200px;">
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

function filterCategory(cat) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (cat === 'all') {
        renderProducts(products);
    } else if (cat === 'VFD') {
        const filtered = products.filter(p => p.category === 'VFD');
        renderProducts(filtered);
    } else {
        const filtered = products.filter(p => p.category.toLowerCase() === cat.toLowerCase());
        renderProducts(filtered);
    }
}

// Global functions for UI events
window.addToCart = function(id) {
    const product = products.find(p => p.id === id);
    if (!product || product.stock <= 0) return;

    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
        if (cartItem.qty < product.stock) {
            cartItem.qty++;
        } else {
            alert("Stock insufficient.");
            return;
        }
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
}

window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

window.toggleCart = function() {
    document.getElementById("cart-sidebar").classList.toggle("open");
}

window.checkoutOrder = function() {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }
    alert("⚡ LB Engineering Order Gateway:\nOrder placed successfully!");
    cart = [];
    updateCartUI();
    toggleCart();
}

window.toggleDashboard = function() {
    const modal = document.getElementById("dashboard-modal");
    modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}

window.updateStock = function(event) {
    event.preventDefault();
    const productId = parseInt(document.getElementById("select-product").value);
    const newPrice = parseFloat(document.getElementById("new-price").value);
    const newStock = parseInt(document.getElementById("new-stock").value);
    
    const prod = products.find(p => p.id === productId);
    if(prod) {
        if(!isNaN(newPrice)) prod.price = newPrice;
        if(!isNaN(newStock)) prod.stock = newStock;
        renderProducts(products);
        updateStockAlerts();
        alert(`Successfully updated ${prod.model}!`);
    }
    toggleDashboard();
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

function updateStockAlerts() {
    const lowStockList = document.getElementById("low-stock-list");
    if(!lowStockList) return;
    lowStockList.innerHTML = "";
    const lowStockItems = products.filter(p => p.stock <= 3);
    lowStockItems.forEach(p => {
        const li = document.createElement("li");
        li.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:#ffa502"></i> <strong>${p.model}</strong> - Stock: ${p.stock}`;
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
        opt.innerText = `${p.model} (LKR ${p.price.toLocaleString()})`;
        select.appendChild(opt);
    });
}
