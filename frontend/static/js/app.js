const API_URL = 'http://localhost:5000/api';

// Tab Management
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    if (tabName === 'products') loadProducts();
    if (tabName === 'suppliers') loadSuppliers();
    if (tabName === 'transactions') loadTransactions();
    if (tabName === 'reports') loadLowStock();
}

// Products
function showAddProductForm() {
    document.getElementById('addProductForm').style.display = 'block';
    loadSuppliersForDropdown();
}

function hideAddProductForm() {
    document.getElementById('addProductForm').style.display = 'none';
}

async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        const tbody = document.getElementById('productsTableBody');
        
        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8">No products found. Add your first product!</td></tr>';
            return;
        }
        
        tbody.innerHTML = products.map(p => `
            <tr>
                <td>${p.product_id}</td>
                <td>${p.name}</td>
                <td>${p.category}</td>
                <td>$${p.price.toFixed(2)}</td>
                <td>${p.quantity}</td>
                <td>${p.reorder_level}</td>
                <td>${getStockStatus(p.quantity, p.reorder_level)}</td>
                <td class="action-buttons">
                    <button class="btn btn-danger" onclick="deleteProduct(${p.product_id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function getStockStatus(quantity, reorderLevel) {
    if (quantity === 0) {
        return '<span class="status-badge status-critical">Out of Stock</span>';
    } else if (quantity <= reorderLevel) {
        return '<span class="status-badge status-low">Low Stock</span>';
    } else {
        return '<span class="status-badge status-ok">In Stock</span>';
    }
}

async function addProduct(event) {
    event.preventDefault();
    
    const data = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        quantity: parseInt(document.getElementById('productQuantity').value),
        reorder_level: parseInt(document.getElementById('productReorder').value),
        supplier_id: document.getElementById('productSupplier').value || null
    };
    
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        alert(result.message);
        hideAddProductForm();
        event.target.reset();
        loadProducts();
    } catch (error) {
        console.error('Error adding product:', error);
        alert('Error adding product');
    }
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        const response = await fetch(`${API_URL}/products/${productId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        alert(result.message);
        loadProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

// Suppliers
function showAddSupplierForm() {
    document.getElementById('addSupplierForm').style.display = 'block';
}

function hideAddSupplierForm() {
    document.getElementById('addSupplierForm').style.display = 'none';
}

async function loadSuppliers() {
    try {
        const response = await fetch(`${API_URL}/suppliers`);
        const suppliers = await response.json();
        const tbody = document.getElementById('suppliersTableBody');
        
        if (suppliers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No suppliers found. Add your first supplier!</td></tr>';
            return;
        }
        
        tbody.innerHTML = suppliers.map(s => `
            <tr>
                <td>${s.supplier_id}</td>
                <td>${s.name}</td>
                <td>${s.contact_person || '-'}</td>
                <td>${s.phone || '-'}</td>
                <td>${s.email || '-'}</td>
                <td class="action-buttons">
                    <button class="btn btn-danger" onclick="deleteSupplier(${s.supplier_id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading suppliers:', error);
    }
}

async function addSupplier(event) {
    event.preventDefault();
    
    const data = {
        name: document.getElementById('supplierName').value,
        contact_person: document.getElementById('supplierContact').value,
        phone: document.getElementById('supplierPhone').value,
        email: document.getElementById('supplierEmail').value,
        address: document.getElementById('supplierAddress').value
    };
    
    try {
        const response = await fetch(`${API_URL}/suppliers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        alert(result.message);
        hideAddSupplierForm();
        event.target.reset();
        loadSuppliers();
    } catch (error) {
        console.error('Error adding supplier:', error);
        alert('Error adding supplier');
    }
}

async function deleteSupplier(supplierId) {
    if (!confirm('Are you sure you want to delete this supplier?')) return;
    
    try {
        const response = await fetch(`${API_URL}/suppliers/${supplierId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        alert(result.message);
        loadSuppliers();
    } catch (error) {
        console.error('Error deleting supplier:', error);
    }
}

async function loadSuppliersForDropdown() {
    try {
        const response = await fetch(`${API_URL}/suppliers`);
        const suppliers = await response.json();
        const select = document.getElementById('productSupplier');
        
        select.innerHTML = '<option value="">Select Supplier (Optional)</option>' +
            suppliers.map(s => `<option value="${s.supplier_id}">${s.name}</option>`).join('');
    } catch (error) {
        console.error('Error loading suppliers:', error);
    }
}

// Transactions
function showAddTransactionForm() {
    document.getElementById('addTransactionForm').style.display = 'block';
    loadProductsForDropdown();
}

function hideAddTransactionForm() {
    document.getElementById('addTransactionForm').style.display = 'none';
}

async function loadTransactions() {
    try {
        const response = await fetch(`${API_URL}/transactions`);
        const transactions = await response.json();
        const tbody = document.getElementById('transactionsTableBody');
        
        if (transactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No transactions found.</td></tr>';
            return;
        }
        
        tbody.innerHTML = transactions.map(t => `
            <tr>
                <td>${t.transaction_id}</td>
                <td>${t.product_id}</td>
                <td><span class="status-badge ${t.transaction_type === 'IN' ? 'status-ok' : 'status-low'}">${t.transaction_type}</span></td>
                <td>${t.quantity}</td>
                <td>${t.date}</td>
                <td>${t.notes || '-'}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

async function addTransaction(event) {
    event.preventDefault();
    
    const data = {
        product_id: parseInt(document.getElementById('transactionProduct').value),
        transaction_type: document.getElementById('transactionType').value,
        quantity: parseInt(document.getElementById('transactionQuantity').value),
        notes: document.getElementById('transactionNotes').value
    };
    
    try {
        const response = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        alert(result.message);
        hideAddTransactionForm();
        event.target.reset();
        loadTransactions();
    } catch (error) {
        console.error('Error adding transaction:', error);
        alert('Error adding transaction');
    }
}

async function loadProductsForDropdown() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        const select = document.getElementById('transactionProduct');
        
        select.innerHTML = '<option value="">Select Product</option>' +
            products.map(p => `<option value="${p.product_id}">${p.name} (Stock: ${p.quantity})</option>`).join('');
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Reports
async function loadLowStock() {
    try {
        const response = await fetch(`${API_URL}/products/low-stock`);
        const products = await response.json();
        const tbody = document.getElementById('lowStockTableBody');
        
        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">✅ All products are well stocked!</td></tr>';
            return;
        }
        
        tbody.innerHTML = products.map(p => `
            <tr>
                <td>${p.product_id}</td>
                <td>${p.name}</td>
                <td>${p.quantity}</td>
                <td>${p.reorder_level}</td>
                <td><span class="status-badge status-critical">Reorder Now</span></td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading low stock:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});
