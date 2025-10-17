// Global variables
let items = [];
let categories = [];
let subCategories = [];
let currentItemId = null;
let isEditMode = false;

// API Configuration
const ITEMS_API_URL = '/api/items';
const CATEGORIES_API_URL = '/api/categories';
const SUBCATEGORIES_API_URL = '/api/subcategories';

// Auth helper functions
function canManageCategories() {
    const user = localStorage.getItem('currentUser');
    if (!user) return true;
    try {
        const userData = JSON.parse(user);
        return userData.role === 1 || userData.role === 2;
    } catch (e) {
        return true;
    }
}

function logout() {
    localStorage.clear();
    window.location.href = '/login.html';
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
});

function checkAuthentication() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');

    if (!token || !user) {
        window.location.href = '/login.html';
        return;
    }

    window.authToken = token;
    window.currentUser = user ? JSON.parse(user) : null;

    initializeApp();
}

function initializeApp() {
    showUserInfo();
    updateUIForUserRole();
    loadData();
}

function showUserInfo() {
    if (window.currentUser) {
        document.getElementById('userInfo').style.display = 'flex';
        document.getElementById('userName').textContent = window.currentUser.fullName;
        document.getElementById('userRole').textContent = window.currentUser.role;
    }
}

function updateUIForUserRole() {
    const addItemBtn = document.getElementById('addItemBtn');
    if (canManageCategories()) {
        addItemBtn.style.display = 'inline-flex';
    } else {
        addItemBtn.style.display = 'none';
    }
}

function getAuthHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('authToken');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

async function parseResponse(response) {
    const text = await response.text();
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch (e) {
        return text;
    }
}

// Load all data
async function loadData() {
    await Promise.all([
        loadCategories(),
        loadSubCategories(),
        loadItems()
    ]);
}

// API Functions
async function loadCategories() {
    try {
        const response = await fetch(CATEGORIES_API_URL, { headers: getAuthHeaders() });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        categories = await parseResponse(response) || [];
        populateCategoryFilters();
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function loadSubCategories() {
    try {
        const response = await fetch(SUBCATEGORIES_API_URL, { headers: getAuthHeaders() });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        subCategories = await parseResponse(response) || [];
    } catch (error) {
        console.error('Error loading subcategories:', error);
    }
}

async function loadItems() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const itemsGrid = document.getElementById('itemsGrid');
    const emptyState = document.getElementById('emptyState');

    try {
        loadingSpinner.style.display = 'block';
        itemsGrid.style.display = 'none';
        emptyState.style.display = 'none';

        const response = await fetch(ITEMS_API_URL, { headers: getAuthHeaders() });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        items = await parseResponse(response) || [];
        displayItems(items);
        updateStats();

        if (items.length === 0) {
            emptyState.style.display = 'block';
        } else {
            itemsGrid.style.display = 'grid';
        }
    } catch (error) {
        console.error('Error loading items:', error);
        showToast('Failed to load items', 'error');
        emptyState.style.display = 'block';
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

async function createItem(itemData) {
    try {
        const response = await fetch(ITEMS_API_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(itemData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMsg = `HTTP error! status: ${response.status}`;
            try {
                const errorData = JSON.parse(errorText);
                errorMsg = errorData.message || errorData.title || errorMsg;
            } catch (e) {
                errorMsg = errorText || errorMsg;
            }
            throw new Error(errorMsg);
        }

        return await parseResponse(response);
    } catch (error) {
        console.error('Error creating item:', error);
        throw error;
    }
}

async function updateItem(id, itemData) {
    try {
        const response = await fetch(`${ITEMS_API_URL}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ ...itemData, id: id })
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMsg = `HTTP error! status: ${response.status}`;
            try {
                const errorData = JSON.parse(errorText);
                errorMsg = errorData.message || errorData.title || errorMsg;
            } catch (e) {
                errorMsg = errorText || errorMsg;
            }
            throw new Error(errorMsg);
        }

        return await parseResponse(response);
    } catch (error) {
        console.error('Error updating item:', error);
        throw error;
    }
}

async function deleteItem(id) {
    try {
        const response = await fetch(`${ITEMS_API_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return true;
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
    }
}

// UI Functions
function displayItems(itemsToShow) {
    const itemsGrid = document.getElementById('itemsGrid');

    if (itemsToShow.length === 0) {
        itemsGrid.innerHTML = '';
        return;
    }

    itemsGrid.innerHTML = itemsToShow.map(item => `
        <div class="item-card ${item.isLowStock ? 'low-stock' : ''}">
            <div class="item-image">
                ${item.imageUrl ?
        `<img src="${item.imageUrl}" alt="${escapeHtml(item.name)}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">` :
        `<div class="no-image"><i class="fas fa-box"></i></div>`
    }
                ${item.isLowStock ? '<span class="badge badge-warning">Low Stock</span>' : ''}
                ${item.needsReorder ? '<span class="badge badge-danger">Reorder</span>' : ''}
            </div>
            <div class="item-info">
                <h3>${escapeHtml(item.name)}</h3>
                <p class="item-sku">SKU: ${escapeHtml(item.sku)}</p>
                <p class="item-category">
                    <i class="fas fa-folder"></i> ${escapeHtml(item.categoryName)}
                    ${item.subCategoryName ? ` / ${escapeHtml(item.subCategoryName)}` : ''}
                </p>
                <div class="item-details">
                    <div class="detail">
                        <span class="label">Price:</span>
                        <span class="value price">$${item.price.toFixed(2)}</span>
                    </div>
                    <div class="detail">
                        <span class="label">Stock:</span>
                        <span class="value ${item.isLowStock ? 'text-warning' : ''}">${item.quantityInStock} ${item.unitOfSale}</span>
                    </div>
                    ${item.brand ? `<div class="detail"><span class="label">Brand:</span><span class="value">${escapeHtml(item.brand)}</span></div>` : ''}
                    ${item.location ? `<div class="detail"><span class="label">Location:</span><span class="value">${escapeHtml(item.location)}</span></div>` : ''}
                </div>
                <span class="item-status ${item.isActive ? 'status-active' : 'status-inactive'}">
                    ${item.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>
            <div class="item-actions">
                <button class="btn btn-sm btn-primary" onclick="editItem(${item.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger" onclick="showDeleteModal(${item.id}, '${escapeHtml(item.name)}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function updateStats() {
    const totalItems = items.filter(i => i.isActive).length;
    const lowStock = items.filter(i => i.isActive && i.isLowStock).length;
    const reorder = items.filter(i => i.isActive && i.needsReorder).length;
    const totalValue = items.filter(i => i.isActive).reduce((sum, i) => sum + (i.totalValue || 0), 0);

    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('lowStockCount').textContent = lowStock;
    document.getElementById('reorderCount').textContent = reorder;
    document.getElementById('totalValue').textContent = `$${totalValue.toFixed(2)}`;
}

function filterItems() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryId = document.getElementById('categoryFilter').value;
    const subCategoryId = document.getElementById('subCategoryFilter').value;
    const status = document.getElementById('statusFilter').value;

    let filtered = items;

    if (searchTerm) {
        filtered = filtered.filter(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.sku.toLowerCase().includes(searchTerm) ||
            (item.barcode && item.barcode.toLowerCase().includes(searchTerm)) ||
            (item.description && item.description.toLowerCase().includes(searchTerm))
        );
    }

    if (categoryId) {
        filtered = filtered.filter(item => item.categoryId == categoryId);
    }

    if (subCategoryId) {
        filtered = filtered.filter(item => item.subCategoryId == subCategoryId);
    }

    if (status === 'active') {
        filtered = filtered.filter(item => item.isActive);
    } else if (status === 'inactive') {
        filtered = filtered.filter(item => !item.isActive);
    } else if (status === 'lowstock') {
        filtered = filtered.filter(item => item.isLowStock);
    } else if (status === 'reorder') {
        filtered = filtered.filter(item => item.needsReorder);
    }

    displayItems(filtered);
}

function populateCategoryFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const itemCategory = document.getElementById('itemCategory');

    categories.forEach(cat => {
        if (cat.isActive) {
            categoryFilter.innerHTML += `<option value="${cat.id}">${escapeHtml(cat.name)}</option>`;
            itemCategory.innerHTML += `<option value="${cat.id}">${escapeHtml(cat.name)}</option>`;
        }
    });
}

function loadSubCategoriesForCategory() {
    const categoryId = document.getElementById('itemCategory').value;
    const subCategorySelect = document.getElementById('itemSubCategory');

    subCategorySelect.innerHTML = '<option value="">None</option>';

    if (categoryId) {
        const filtered = subCategories.filter(sc => sc.categoryId == categoryId && sc.isActive);
        filtered.forEach(sc => {
            subCategorySelect.innerHTML += `<option value="${sc.id}">${escapeHtml(sc.name)}</option>`;
        });
    }
}

// Modal Functions
function showAddItemModal() {
    isEditMode = false;
    currentItemId = null;

    document.getElementById('modalTitle').textContent = 'Add New Item';
    document.getElementById('submitBtn').innerHTML = '<i class="fas fa-save"></i> Save Item';
    document.getElementById('itemForm').reset();
    document.getElementById('itemActive').checked = true;

    showModal();
}

function editItem(id) {
    const item = items.find(i => i.id === id);
    if (!item) return;

    isEditMode = true;
    currentItemId = id;

    document.getElementById('modalTitle').textContent = 'Edit Item';
    document.getElementById('submitBtn').innerHTML = '<i class="fas fa-save"></i> Update Item';

    // Populate form fields
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemSKU').value = item.sku;
    document.getElementById('itemDescription').value = item.description || '';
    document.getElementById('itemCategory').value = item.categoryId;
    loadSubCategoriesForCategory();
    document.getElementById('itemSubCategory').value = item.subCategoryId || '';
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemCostPrice').value = item.costPrice || '';
    document.getElementById('itemUnit').value = getUnitValue(item.unitOfSale);
    document.getElementById('itemQuantity').value = item.quantityInStock;
    document.getElementById('itemMinStock').value = item.minimumStockLevel;
    document.getElementById('itemMaxStock').value = item.maximumStockLevel || '';
    document.getElementById('itemReorder').value = item.reorderPoint;
    document.getElementById('itemBarcode').value = item.barcode || '';
    document.getElementById('itemBrand').value = item.brand || '';
    document.getElementById('itemSupplier').value = item.supplier || '';
    document.getElementById('itemWeight').value = item.weight || '';
    document.getElementById('itemDimensions').value = item.dimensions || '';
    document.getElementById('itemExpiry').value = item.expiryDate ? item.expiryDate.split('T')[0] : '';
    document.getElementById('itemLocation').value = item.location || '';
    document.getElementById('itemImage').value = item.imageUrl || '';
    document.getElementById('itemNotes').value = item.notes || '';
    document.getElementById('itemActive').checked = item.isActive;

    showModal();
}

function getUnitValue(unitName) {
    const units = {
        'Piece': 1, 'Kilogram': 2, 'Gram': 3, 'Liter': 4, 'Milliliter': 5,
        'Meter': 6, 'Box': 7, 'Pack': 8, 'Carton': 9, 'Dozen': 10,
        'Set': 11, 'Pair': 12, 'Bundle': 13, 'Roll': 14, 'Sheet': 15
    };
    return units[unitName] || 1;
}

function showModal() {
    document.getElementById('itemModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('itemModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function showDeleteModal(id, name) {
    currentItemId = id;
    document.getElementById('deleteItemName').textContent = name;
    document.getElementById('deleteModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('show');
    document.body.style.overflow = 'auto';
    currentItemId = null;
}

// Form Handling
async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const itemData = {
        name: formData.get('name').trim(),
        sku: formData.get('sku').trim(),
        description: formData.get('description')?.trim() || null,
        categoryId: parseInt(formData.get('categoryId')),
        subCategoryId: formData.get('subCategoryId') ? parseInt(formData.get('subCategoryId')) : null,
        price: parseFloat(formData.get('price')),
        costPrice: formData.get('costPrice') ? parseFloat(formData.get('costPrice')) : null,
        unitOfSale: parseInt(formData.get('unitOfSale')),
        quantityInStock: parseInt(formData.get('quantityInStock')),
        minimumStockLevel: parseInt(formData.get('minimumStockLevel')),
        maximumStockLevel: formData.get('maximumStockLevel') ? parseInt(formData.get('maximumStockLevel')) : null,
        reorderPoint: parseInt(formData.get('reorderPoint')),
        barcode: formData.get('barcode')?.trim() || null,
        brand: formData.get('brand')?.trim() || null,
        supplier: formData.get('supplier')?.trim() || null,
        weight: formData.get('weight') ? parseFloat(formData.get('weight')) : null,
        dimensions: formData.get('dimensions')?.trim() || null,
        expiryDate: formData.get('expiryDate') || null,
        location: formData.get('location')?.trim() || null,
        imageUrl: formData.get('imageUrl')?.trim() || null,
        notes: formData.get('notes')?.trim() || null,
        isActive: formData.get('isActive') === 'on'
    };

    try {
        if (isEditMode) {
            await updateItem(currentItemId, itemData);
            showToast('Item updated successfully!', 'success');
        } else {
            await createItem(itemData);
            showToast('Item created successfully!', 'success');
        }

        closeModal();
        await loadItems();
    } catch (error) {
        showToast(error.message || 'An error occurred while saving the item', 'error');
    }
}

async function confirmDelete() {
    if (!currentItemId) return;

    try {
        await deleteItem(currentItemId);
        showToast('Item deleted successfully!', 'success');
        closeDeleteModal();
        await loadItems();
    } catch (error) {
        showToast(error.message || 'An error occurred while deleting the item', 'error');
    }
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };

    toast.innerHTML = `
        <div class="toast-content">
            <i class="toast-icon ${iconMap[type]}"></i>
            <span>${escapeHtml(message)}</span>
        </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => toast.remove(), 5000);
    toast.addEventListener('click', () => toast.remove());
}

// Close modals when clicking outside
document.addEventListener('click', function(event) {
    const itemModal = document.getElementById('itemModal');
    const deleteModal = document.getElementById('deleteModal');

    if (event.target === itemModal) {
        closeModal();
    }

    if (event.target === deleteModal) {
        closeDeleteModal();
    }
});

// Close modals with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
        closeDeleteModal();
    }
});