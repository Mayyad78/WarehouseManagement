// Global variables
let categories = [];
let subCategories = [];
let currentCategoryId = null;
let currentSubCategoryId = null;
let isEditMode = false;
let isSubCategoryEditMode = false;

// API Configuration
const CATEGORIES_API_URL = '/api/categories';
const SUB_CATEGORIES_API_URL = '/api/subcategories';

// Auth helper functions - MUST BE GLOBAL
function canManageCategories() {
    const user = localStorage.getItem('currentUser');
    if (!user) return true; // Allow access for testing
    try {
        const userData = JSON.parse(user);
        return userData.role === 1 || userData.role === 2; // SuperAdmin or Admin
    } catch (e) {
        return true;
    }
}

function canViewData() {
    return true;
}

function hasRole(roles) {
    const user = localStorage.getItem('currentUser');
    if (!user) return true;
    try {
        const userData = JSON.parse(user);
        if (Array.isArray(roles)) {
            return roles.includes(userData.role);
        }
        return userData.role === roles;
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
    // Check authentication first
    checkAuthentication();
});

// Check authentication and initialize app
function checkAuthentication() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');

    if (!token || !user) {
        // Redirect to login if not authenticated
        window.location.href = '/login.html';
        return;
    }
    
    // Set global variables
    window.authToken = token;
    window.currentUser = user ? JSON.parse(user) : null;

    // Initialize the application
    initializeApp();
}

// Initialize the main application
function initializeApp() {
    // Show user info
    showUserInfo();

    // Show/hide buttons based on user role
    updateUIForUserRole();

    // Load data
    loadCategories();
    loadSubCategories();
}

// Show user information in header
function showUserInfo() {
    if (window.currentUser) {
        document.getElementById('userInfo').style.display = 'flex';
        document.getElementById('userName').textContent = window.currentUser.fullName;
        document.getElementById('userRole').textContent = window.currentUser.role;
    }
}

// Update UI based on user role
function updateUIForUserRole() {
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const addSubCategoryBtn = document.getElementById('addSubCategoryBtn');

    if (canManageCategories()) {
        addCategoryBtn.style.display = 'inline-flex';
        addSubCategoryBtn.style.display = 'inline-flex';
    } else {
        addCategoryBtn.style.display = 'none';
        addSubCategoryBtn.style.display = 'none';
    }
}

// Helper function to get auth headers
function getAuthHeaders() {
    const headers = {
        'Content-Type': 'application/json'
    };

    const token = localStorage.getItem('authToken');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}

// Helper function to parse response safely
async function parseResponse(response) {
    const text = await response.text();
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch (e) {
        return text;
    }
}

// Category API Functions
async function fetchCategories() {
    try {
        const response = await fetch(CATEGORIES_API_URL, {
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await parseResponse(response) || [];
    } catch (error) {
        console.error('Error fetching categories:', error);
        showToast('Failed to load categories', 'error');
        throw error;
    }
}

async function createCategory(categoryData) {
    try {
        const response = await fetch(CATEGORIES_API_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(categoryData)
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
        console.error('Error creating category:', error);
        throw error;
    }
}

async function updateCategory(id, categoryData) {
    try {
        const response = await fetch(`${CATEGORIES_API_URL}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ ...categoryData, id: id })
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
        console.error('Error updating category:', error);
        throw error;
    }
}

async function deleteCategory(id) {
    try {
        const response = await fetch(`${CATEGORIES_API_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
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

        return true;
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
}

// SubCategory API Functions
async function fetchSubCategories() {
    try {
        const response = await fetch(SUB_CATEGORIES_API_URL, {
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await parseResponse(response) || [];
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        showToast('Failed to load subcategories', 'error');
        throw error;
    }
}

async function createSubCategory(subCategoryData) {
    try {
        const response = await fetch(SUB_CATEGORIES_API_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(subCategoryData)
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
        console.error('Error creating subcategory:', error);
        throw error;
    }
}

async function updateSubCategory(id, subCategoryData) {
    try {
        const response = await fetch(`${SUB_CATEGORIES_API_URL}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ ...subCategoryData, id: id })
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
        console.error('Error updating subcategory:', error);
        throw error;
    }
}

async function deleteSubCategory(id) {
    try {
        const response = await fetch(`${SUB_CATEGORIES_API_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
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

        return true;
    } catch (error) {
        console.error('Error deleting subcategory:', error);
        throw error;
    }
}

// UI Functions
async function loadCategories() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const categoriesGrid = document.getElementById('categoriesGrid');
    const emptyState = document.getElementById('emptyState');

    try {
        loadingSpinner.style.display = 'block';
        categoriesGrid.style.display = 'none';
        emptyState.style.display = 'none';

        categories = await fetchCategories();
        displayCategories(categories);

        if (categories.length === 0) {
            emptyState.style.display = 'block';
            categoriesGrid.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            categoriesGrid.style.display = 'grid';
        }
    } catch (error) {
        emptyState.style.display = 'block';
        categoriesGrid.style.display = 'none';
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

function displayCategories(categoriesToShow) {
    const categoriesGrid = document.getElementById('categoriesGrid');

    if (categoriesToShow.length === 0) {
        categoriesGrid.innerHTML = '';
        return;
    }

    categoriesGrid.innerHTML = categoriesToShow.map(category => `
        <div class="category-card">
            <div class="category-header">
                <div>
                    <div class="category-name">${escapeHtml(category.name)}</div>
                    <span class="category-status ${category.isActive ? 'status-active' : 'status-inactive'}">
                        ${category.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>
            ${category.description ? `<div class="category-description">${escapeHtml(category.description)}</div>` : ''}
            <div class="category-meta">
                <span><i class="fas fa-calendar"></i> Created: ${formatDate(category.createdAt)}</span>
                ${category.updatedAt ? `<span><i class="fas fa-edit"></i> Updated: ${formatDate(category.updatedAt)}</span>` : ''}
            </div>
            <div class="category-actions">
                <button class="btn btn-primary btn-sm" onclick="editCategory(${category.id})">
                    <i class="fas fa-edit"></i>
                    Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="showDeleteModal(${category.id}, '${escapeHtml(category.name)}')">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

function filterCategories() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;

    let filteredCategories = categories;

    // Filter by search term
    if (searchTerm) {
        filteredCategories = filteredCategories.filter(category =>
            category.name.toLowerCase().includes(searchTerm) ||
            (category.description && category.description.toLowerCase().includes(searchTerm))
        );
    }

    // Filter by status
    if (statusFilter !== 'all') {
        const isActive = statusFilter === 'active';
        filteredCategories = filteredCategories.filter(category => category.isActive === isActive);
    }

    displayCategories(filteredCategories);
}

// SubCategory UI Functions
async function loadSubCategories() {
    try {
        subCategories = await fetchSubCategories();
        displaySubCategories(subCategories);

        if (subCategories.length > 0) {
            document.getElementById('subcategoriesSection').style.display = 'block';
        } else {
            document.getElementById('subcategoriesSection').style.display = 'none';
        }
    } catch (error) {
        document.getElementById('subcategoriesSection').style.display = 'none';
    }
}

function displaySubCategories(subCategoriesToShow) {
    const subCategoriesGrid = document.getElementById('subcategoriesGrid');

    if (subCategoriesToShow.length === 0) {
        subCategoriesGrid.innerHTML = '<p class="text-muted">No subcategories found.</p>';
        return;
    }

    subCategoriesGrid.innerHTML = subCategoriesToShow.map(subCategory => `
        <div class="subcategory-card">
            <div class="category-header">
                <div>
                    <div class="category-name">${escapeHtml(subCategory.name)}</div>
                    <span class="category-status ${subCategory.isActive ? 'status-active' : 'status-inactive'}">
                        ${subCategory.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>
            <div class="category-description">
                <strong>Parent:</strong> ${escapeHtml(subCategory.category.name)}
            </div>
            ${subCategory.description ? `<div class="category-description">${escapeHtml(subCategory.description)}</div>` : ''}
            <div class="category-meta">
                <span><i class="fas fa-calendar"></i> Created: ${formatDate(subCategory.createdAt)}</span>
                ${subCategory.updatedAt ? `<span><i class="fas fa-edit"></i> Updated: ${formatDate(subCategory.updatedAt)}</span>` : ''}
            </div>
            <div class="category-actions">
                <button class="btn btn-primary btn-sm" onclick="editSubCategory(${subCategory.id})">
                    <i class="fas fa-edit"></i>
                    Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="showDeleteSubCategoryModal(${subCategory.id}, '${escapeHtml(subCategory.name)}')">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Modal Functions
function showAddCategoryModal() {
    isEditMode = false;
    currentCategoryId = null;

    document.getElementById('modalTitle').textContent = 'Add New Category';
    document.getElementById('submitBtn').innerHTML = '<i class="fas fa-save"></i> Save Category';
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryActive').checked = true;

    clearFormErrors();
    showModal();
}

function editCategory(id) {
    const category = categories.find(c => c.id === id);
    if (!category) return;

    isEditMode = true;
    currentCategoryId = id;

    document.getElementById('modalTitle').textContent = 'Edit Category';
    document.getElementById('submitBtn').innerHTML = '<i class="fas fa-save"></i> Update Category';

    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryDescription').value = category.description || '';
    document.getElementById('categoryActive').checked = category.isActive;

    clearFormErrors();
    showModal();
}

function showModal() {
    document.getElementById('categoryModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('categoryModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function showDeleteModal(id, name) {
    currentCategoryId = id;
    document.getElementById('deleteCategoryName').textContent = name;
    document.getElementById('deleteModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('show');
    document.body.style.overflow = 'auto';
    currentCategoryId = null;
}

// SubCategory Modal Functions
function showAddSubCategoryModal() {
    isSubCategoryEditMode = false;
    currentSubCategoryId = null;

    document.getElementById('subCategoryModalTitle').textContent = 'Add New SubCategory';
    document.getElementById('subCategorySubmitBtn').innerHTML = '<i class="fas fa-save"></i> Save SubCategory';
    document.getElementById('subCategoryForm').reset();
    document.getElementById('subCategoryActive').checked = true;

    // Populate category dropdown
    populateCategoryDropdown();

    clearSubCategoryFormErrors();
    showSubCategoryModal();
}

function editSubCategory(id) {
    const subCategory = subCategories.find(sc => sc.id === id);
    if (!subCategory) return;

    isSubCategoryEditMode = true;
    currentSubCategoryId = id;

    document.getElementById('subCategoryModalTitle').textContent = 'Edit SubCategory';
    document.getElementById('subCategorySubmitBtn').innerHTML = '<i class="fas fa-save"></i> Update SubCategory';

    document.getElementById('subCategoryName').value = subCategory.name;
    document.getElementById('subCategoryDescription').value = subCategory.description || '';
    document.getElementById('subCategoryActive').checked = subCategory.isActive;

    // Populate category dropdown and select current category
    populateCategoryDropdown(subCategory.categoryId);

    clearSubCategoryFormErrors();
    showSubCategoryModal();
}

function showSubCategoryModal() {
    document.getElementById('subCategoryModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeSubCategoryModal() {
    document.getElementById('subCategoryModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function populateCategoryDropdown(selectedCategoryId = null) {
    const categorySelect = document.getElementById('subCategoryCategory');
    categorySelect.innerHTML = '<option value="">Select a category</option>';

    categories.forEach(category => {
        if (category.isActive) {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            if (selectedCategoryId && category.id === selectedCategoryId) {
                option.selected = true;
            }
            categorySelect.appendChild(option);
        }
    });
}

function showDeleteSubCategoryModal(id, name) {
    currentSubCategoryId = id;
    document.getElementById('deleteCategoryName').textContent = name;
    document.getElementById('deleteModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Form Handling
async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const categoryData = {
        name: formData.get('name').trim(),
        description: formData.get('description').trim(),
        isActive: formData.get('isActive') === 'on'
    };

    // Validation
    if (!validateForm(categoryData)) {
        return;
    }

    try {
        if (isEditMode) {
            await updateCategory(currentCategoryId, categoryData);
            showToast('Category updated successfully!', 'success');
        } else {
            await createCategory(categoryData);
            showToast('Category created successfully!', 'success');
        }

        closeModal();
        await loadCategories();
    } catch (error) {
        showToast(error.message || 'An error occurred while saving the category', 'error');
    }
}

function validateForm(data) {
    let isValid = true;
    clearFormErrors();

    if (!data.name) {
        showFieldError('nameError', 'Category name is required');
        isValid = false;
    } else if (data.name.length > 100) {
        showFieldError('nameError', 'Category name must be 100 characters or less');
        isValid = false;
    }

    if (data.description && data.description.length > 500) {
        showFieldError('descriptionError', 'Description must be 500 characters or less');
        isValid = false;
    }

    return isValid;
}

function showFieldError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.classList.remove('show');
        element.textContent = '';
    });
}

// SubCategory Form Handling
async function handleSubCategorySubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const subCategoryData = {
        name: formData.get('name').trim(),
        description: formData.get('description').trim(),
        categoryId: parseInt(formData.get('categoryId')),
        isActive: formData.get('isActive') === 'on'
    };

    // Validation
    if (!validateSubCategoryForm(subCategoryData)) {
        return;
    }

    try {
        if (isSubCategoryEditMode) {
            await updateSubCategory(currentSubCategoryId, subCategoryData);
            showToast('SubCategory updated successfully!', 'success');
        } else {
            await createSubCategory(subCategoryData);
            showToast('SubCategory created successfully!', 'success');
        }

        closeSubCategoryModal();
        await loadSubCategories();
    } catch (error) {
        showToast(error.message || 'An error occurred while saving the subcategory', 'error');
    }
}

function validateSubCategoryForm(data) {
    let isValid = true;
    clearSubCategoryFormErrors();

    if (!data.name) {
        showSubCategoryFieldError('subCategoryNameError', 'SubCategory name is required');
        isValid = false;
    } else if (data.name.length > 100) {
        showSubCategoryFieldError('subCategoryNameError', 'SubCategory name must be 100 characters or less');
        isValid = false;
    }

    if (!data.categoryId) {
        showSubCategoryFieldError('subCategoryCategoryError', 'Please select a parent category');
        isValid = false;
    }

    if (data.description && data.description.length > 500) {
        showSubCategoryFieldError('subCategoryDescriptionError', 'Description must be 500 characters or less');
        isValid = false;
    }

    return isValid;
}

function showSubCategoryFieldError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearSubCategoryFormErrors() {
    const errorElements = document.querySelectorAll('#subCategoryModal .error-message');
    errorElements.forEach(element => {
        element.classList.remove('show');
        element.textContent = '';
    });
}

async function confirmDelete() {
    if (currentCategoryId) {
        try {
            // Check if category has subcategories
            const categorySubCategories = subCategories.filter(sc => sc.categoryId === currentCategoryId);

            if (categorySubCategories.length > 0) {
                showToast(`Cannot delete category. It has ${categorySubCategories.length} subcategory(ies). Please delete the subcategories first.`, 'error');
                closeDeleteModal();
                return;
            }

            await deleteCategory(currentCategoryId);
            showToast('Category deleted successfully!', 'success');
            closeDeleteModal();
            await loadCategories();
        } catch (error) {
            showToast(error.message || 'An error occurred while deleting the category', 'error');
        }
    } else if (currentSubCategoryId) {
        try {
            await deleteSubCategory(currentSubCategoryId);
            showToast('SubCategory deleted successfully!', 'success');
            closeDeleteModal();
            await loadSubCategories();
        } catch (error) {
            showToast(error.message || 'An error occurred while deleting the subcategory', 'error');
        }
    }
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
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

    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);

    // Click to dismiss
    toast.addEventListener('click', () => {
        toast.remove();
    });
}

// Close modals when clicking outside
document.addEventListener('click', function(event) {
    const categoryModal = document.getElementById('categoryModal');
    const subCategoryModal = document.getElementById('subCategoryModal');
    const deleteModal = document.getElementById('deleteModal');

    if (event.target === categoryModal) {
        closeModal();
    }

    if (event.target === subCategoryModal) {
        closeSubCategoryModal();
    }

    if (event.target === deleteModal) {
        closeDeleteModal();
    }
});

// Close modals with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
        closeSubCategoryModal();
        closeDeleteModal();
    }
});

///end of the file