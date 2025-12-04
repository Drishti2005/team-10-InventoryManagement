const API_URL = 'http://localhost:5000/api';
let currentUser = null;

// Check authentication on page load
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
});

async function checkAuth() {
    console.log('=== STARTING AUTH CHECK ===');
    
    // First check sessionStorage
    const storedUser = sessionStorage.getItem('user');
    console.log('Stored user in sessionStorage:', storedUser);
    
    if (!storedUser) {
        console.log('❌ No stored user found');
        window.location.href = '/';
        return;
    }
    
    try {
        console.log('Fetching session from server...');
        const response = await fetch(`${API_URL}/auth/session`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Response status:', response.status);
        
        const session = await response.json();
        console.log('Session check result:', JSON.stringify(session, null, 2));
        
        if (!session.authenticated) {
            console.log('❌ Not authenticated');
            sessionStorage.removeItem('user');
            window.location.href = '/';
            return;
        }
        
        currentUser = session;
        console.log('✅ Authentication successful!');
        console.log('Current user:', JSON.stringify(currentUser, null, 2));
        
        document.getElementById('userWelcome').textContent = `Welcome, ${session.full_name} (${session.role === 'admin' ? 'Admin' : 'Staff'})`;
        
        // Load tabs based on role
        loadTabs();
        
        // Load initial data - FIXED: Don't call showTab here, let loadTabs handle it
        if (session.role === 'admin') {
            loadDashboard();
        } else {
            loadProducts();
        }
    } catch (error) {
        console.error('❌ Auth check error:', error);
        console.error('Error stack:', error.stack);
        sessionStorage.removeItem('user');
        window.location.href = '/';
    }
}

function loadTabs() {
    const tabsContainer = document.getElementById('mainTabs');
    
    if (currentUser.role === 'admin') {
        // Admin sees all tabs
        tabsContainer.innerHTML = `
            <button class="tab-btn active" onclick="showTab('dashboard')">Dashboard</button>
            <button class="tab-btn" onclick="showTab('products')">Products</button>
            <button class="tab-btn" onclick="showTab('suppliers')">Suppliers</button>
            <button class="tab-btn" onclick="showTab('transactions')">Transactions</button>
            <button class="tab-btn" onclick="showTab('users')">Users</button>
            <button class="tab-btn" onclick="showTab('reports')">Reports</button>
        `;
        
        // Show dashboard tab for admin
        document.getElementById('dashboard').classList.add('active');
        document.querySelectorAll('.tab-content').forEach(tab => {
            if (tab.id !== 'dashboard') {
                tab.classList.remove('active');
            }
        });
    } else {
        // Staff sees limited tabs
        tabsContainer.innerHTML = `
            <button class="tab-btn active" onclick="showTab('products')">Products</button>
            <button class="tab-btn" onclick="showTab('transactions')">Transactions</button>
            <button class="tab-btn" onclick="showTab('reports')">Reports</button>
        `;
        
        // Hide admin-only tabs
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('suppliers').style.display = 'none';
        document.getElementById('users').style.display = 'none';
        
        // Show products tab for staff
        document.getElementById('products').classList.add('active');
        document.querySelectorAll('.tab-content').forEach(tab => {
            if (tab.id !== 'products') {
                tab.classList.remove('active');
            }
        });
        
        // Hide add/delete buttons for staff
        const addProductBtn = document.getElementById('addProductBtn');
        if (addProductBtn) addProductBtn.style.display = 'none';
    }
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName).classList.add('active');
    
    // Find and activate the corresponding tab button
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        if (btn.textContent.toLowerCase().includes(tabName.toLowerCase()) ||
            btn.getAttribute('onclick')?.includes(tabName)) {
            btn.classList.add('active');
        }
    });
    
    if (tabName === 'dashboard') loadDashboard();
    if (tabName === 'products') loadProducts();
    if (tabName === 'suppliers') loadSuppliers();
    if (tabName === 'transactions') loadTransactions();
    if (tabName === 'users') loadUsers();
    if (tabName === 'reports') loadLowStock();
}

async function handleLogout() {
    try {
        await fetch(`${API_URL}/auth/logout`, { 
            method: 'POST',
            credentials: 'include'
        });
        sessionStorage.removeItem('user');
        window.location.href = '/';
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Dashboard functions
async function loadDashboard() {
    try {
        const response = await fetch(`${API_URL}/dashboard/stats`, {
            credentials: 'include'
        });
        const stats = await response.json();
        
        document.getElementById('totalProducts').textContent = stats.total_products;
        document.getElementById('totalValue').textContent = `$${stats.total_value.toFixed(2)}`;
        document.getElementById('lowStockCount').textContent = stats.low_stock_count;
        
        // Recent activity
        const activityTable = document.getElementById('recentActivityTable');
        if (stats.recent_activity.length === 0) {
            activityTable.innerHTML = '<tr><td colspan="5">No recent activity</td></tr>';
        } else {
            activityTable.innerHTML = stats.recent_activity.map(a => `
                <tr>
                    <td>${a.date}</td>
                    <td>${a.product_name}</td>
                    <td><span class="status-badge ${a.type === 'IN' ? 'status-ok' : 'status-low'}">${a.type}</span></td>
                    <td>${a.quantity}</td>
                    <td>${a.username}</td>
                </tr>
            `).join('');
        }
        
        // Top selling
        const topSellingTable = document.getElementById('topSellingTable');
        if (stats.top_selling.length === 0) {
            topSellingTable.innerHTML = '<tr><td colspan="2">No sales data</td></tr>';
        } else {
            topSellingTable.innerHTML = stats.top_selling.map(p => `
                <tr>
                    <td>${p.product_name}</td>
                    <td>${p.total_sold}</td>
                </tr>
            `).join('');
        }
        
        // Dead stock
        const deadStockTable = document.getElementById('deadStockTable');
        if (stats.dead_stock.length === 0) {
            deadStockTable.innerHTML = '<tr><td colspan="3">✅ No dead stock</td></tr>';
        } else {
            deadStockTable.innerHTML = stats.dead_stock.map(p => `
                <tr>
                    <td>${p.name}</td>
                    <td>${p.quantity}</td>
                    <td>$${(p.price * p.quantity).toFixed(2)}</td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// User management functions
function showAddUserForm() {
    document.getElementById('addUserForm').style.display = 'block';
}

function hideAddUserForm() {
    document.getElementById('addUserForm').style.display = 'none';
}

async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/users`, {
            credentials: 'include'
        });
        const users = await response.json();
        const tbody = document.getElementById('usersTableBody');
        
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No users found</td></tr>';
            return;
        }
        
        tbody.innerHTML = users.map(u => `
            <tr>
                <td>${u.user_id}</td>
                <td>${u.username}</td>
                <td>${u.full_name}</td>
                <td><span class="status-badge ${u.role === 'admin' ? 'status-ok' : 'status-low'}">${u.role}</span></td>
                <td>${u.email}</td>
                <td>${u.created_at}</td>
                <td class="action-buttons">
                    ${u.username !== 'admin' ? `<button class="btn btn-danger" onclick="deleteUser(${u.user_id})">Delete</button>` : '-'}
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function addUser(event) {
    event.preventDefault();
    
    const data = {
        username: document.getElementById('newUsername').value,
        password: document.getElementById('newPassword').value,
        full_name: document.getElementById('newFullName').value,
        email: document.getElementById('newEmail').value,
        role: document.getElementById('newRole').value
    };
    
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        alert(result.message);
        if (result.success) {
            hideAddUserForm();
            event.target.reset();
            loadUsers();
        }
    } catch (error) {
        console.error('Error adding user:', error);
        alert('Error adding user');
    }
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        alert(result.message);
        loadUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

// Include all other functions from app.js

// Products
function showAddProductForm() {
    if (currentUser.role !== 'admin') {
        alert('Only admins can add products');
        return;
    }
    document.getElementById('addProductForm').style.display = 'block';
    loadSuppliersForDropdown();
}

function hideAddProductForm() {
    document.getElementById('addProductForm').style.display = 'none';
}

async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`, {
            credentials: 'include'
        });
        const products = await response.json();
        const tbody = document.getElementById('productsTableBody');
        
        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10">No products found. Add your first product!</td></tr>';
            return;
        }
        
        const canDelete = currentUser.role === 'admin';
        
        tbody.innerHTML = products.map(p => `
            <tr>
                <td>${p.product_id}</td>
                <td>${p.name}</td>
                <td>${p.sku || '-'}</td>
                <td>${p.category || '-'}</td>
                <td>${p.brand || '-'}</td>
                <td>$${p.price ? p.price.toFixed(2) : '0.00'}</td>
                <td>${p.quantity}</td>
                <td>${p.reorder_level}</td>
                <td>${getStockStatus(p.quantity, p.reorder_level)}</td>
                <td class="action-buttons">
                    ${canDelete ? `<button class="btn btn-danger" onclick="deleteProduct(${p.product_id})">Delete</button>` : '-'}
                </td>
            </tr>
        `).join('');
        
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
                    ${canDelete ? `<button class="btn btn-danger" onclick="deleteProduct(${p.product_id})">Delete</button>` : '-'}
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
        sku: document.getElementById('productSKU').value,
        category: document.getElementById('productCategory').value,
        brand: document.getElementById('productBrand')?.value || '',
        price: parseFloat(document.getElementById('productPrice').value),
        quantity: parseInt(document.getElementById('productQuantity').value),
        reorder_level: parseInt(document.getElementById('productReorder').value),
        supplier_id: document.getElementById('productSupplier').value || null,
        barcode: document.getElementById('productBarcode')?.value || '',
        location: document.getElementById('productLocation')?.value || ''
    };
    
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        alert(result.message);
        if (result.success) {
            hideAddProductForm();
            event.target.reset();
            loadProducts();
        }
    } catch (error) {
        console.error('Error adding product:', error);
        alert('Error adding product: ' + error.message);
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
        const response = await fetch(`${API_URL}/suppliers`, {
            credentials: 'include'
        });
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
        const response = await fetch(`${API_URL}/suppliers`, {
            credentials: 'include'
        });
        const suppliers = await response.json();
        const select = document.getElementById('productSupplier');
        
        if (select) {
            select.innerHTML = '<option value="">Select Supplier (Optional)</option>' +
                suppliers.map(s => `<option value="${s.supplier_id}">${s.name}</option>`).join('');
        }
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
        const response = await fetch(`${API_URL}/transactions`, {
            credentials: 'include'
        });
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
        loadProducts(); // Refresh products to show updated quantities
    } catch (error) {
        console.error('Error adding transaction:', error);
        alert('Error adding transaction');
    }
}

async function loadProductsForDropdown() {
    try {
        const response = await fetch(`${API_URL}/products`, {
            credentials: 'include'
        });
        const products = await response.json();
        const select = document.getElementById('transactionProduct');
        
        if (select) {
            select.innerHTML = '<option value="">Select Product</option>' +
                products.map(p => `<option value="${p.product_id}">${p.name} (Stock: ${p.quantity})</option>`).join('');
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Reports
async function loadLowStock() {
    try {
        const response = await fetch(`${API_URL}/products/low-stock`, {
            credentials: 'include'
        });
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
