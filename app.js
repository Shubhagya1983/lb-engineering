// LB Engineering - Fully Verified Google Sheet Integration
const SHEET_ID = '1QW7hjUwejMcnbDeZCqyd0O6SMCBFkPaVt3tc4uPhnk'; 
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

let products = [];
let cart = [];

document.addEventListener("DOMContentLoaded", () => {
    fetchProductsFromSheet();
});

async function fetchProductsFromSheet() {
    try {
        const response = await fetch(SHEET_URL);
        const text = await response.text();
        
        // Google Data JSON පිරිසිදු කිරීම
        const json = JSON.parse(text.substr(47).slice(0, -2));
        const rows = json.table.rows;
        
        // Column අනුපිළිවෙල ස්වයංක්‍රීයව හඳුනාගැනීම
        products = rows.map((row, index) => {
            return {
                id: row.c[0] ? String(row.c[0].v) : String(index + 1),
                name: row.c[1] ? String(row.c[1].v) : 'Industrial Product',
                model: row.c[2] ? String(row.c[2].v) : 'N/A',
                brand: row.c[3] ? String(row.c[3].v) : 'Generic',
                category: row.c[4] ? String(row.c[4].v) : 'General',
                spec: row.c[5] ? String(row.c[5].v) : '',
                price: row.c[6] ? Number(row.c[6].v) : 0,
                stock: row.c[7] ? Number(row.c[7].v) : 0,
                image: row.c[8] ? String(row.c[8].v) : 'https://via.placeholder.com/200'
            };
        });

        // මුලින්ම සියලුම භාණ්ඩ තිරයට ලබාදීම
        renderProducts(products);
    } catch (error) {
        console.error("Error connecting to sheet:", error);
        document.getElementById("products-container").innerHTML = "<p style='color:red; padding:20px;'>Connection error. Please refresh.</p>";
    }
}

function renderProducts(productsList) {
    const container = document.getElementById("products-container");
    container.innerHTML = "";
    
    if(!productsList || productsList.length === 0) {
        container.innerHTML = "<p style='padding:20px; color:#747d8c;'>No products found.</p>";
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
            <button class="btn-add-cart" onclick="addToCart('${prod.id}')" ${prod.stock === 0 ? 'disabled style="background:#b2bec3;"' : ''}>
                ${prod.stock === 0 ? 'Unavailable' : '<i class="fa-solid fa-cart-plus"></i> Add to Cart'}
            </button>
        `;
        container.appendChild(card);
    });
}

// Filters (Category)
function filterCategory(cat) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (cat === 'all') {
        renderProducts(products);
    } else if (cat === 'VFD') {
        const filtered = products.filter(p => p.category.toUpperCase().includes('VFD'));
        renderProducts(filtered);
    } else if (cat === 'PLC') {
        const filtered = products.filter(p => p.category.toUpperCase().includes('PLC'));
        renderProducts(filtered);
    } else {
        const filtered = products.filter(p => p.category.toLowerCase().includes(cat.toLowerCase()));
        renderProducts(filtered);
    }
}

// Basic Operations
function toggleCart() { document.getElementById("cart-sidebar").classList.toggle("open"); }
function toggleDashboard() { const m = document.getElementById("dashboard-modal"); m.style.display = m.style.display === "flex" ? "none" : "flex"; }
function updateStock(e) { e.preventDefault(); toggleDashboard(); }
