// Authentication JavaScript
const API_BASE_URL = '/api';

// Global variables
let currentUser = null;
let authToken = null;

// Initialize authentication
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
        authToken = token;
        verifyToken();
    }
});

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const loginData = {
        username: formData.get('username').trim(),
        password: formData.get('password')
    };

    const loginBtn = document.getElementById('loginBtn');
    const errorMessage = document.getElementById('errorMessage');
    
    try {
        // Show loading state
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        errorMessage.style.display = 'none';

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        const authResponse = await response.json();
        
        // Store authentication data
        authToken = authResponse.token;
        currentUser = authResponse.user;
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Redirect to main application
        window.location.href = '/';
        
    } catch (error) {
        errorMessage.textContent = error.message || 'Login failed. Please try again.';
        errorMessage.style.display = 'block';
    } finally {
        // Reset button state
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
    }
}

// Verify token validity
async function verifyToken() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            // Token is valid, redirect to main app
            window.location.href = '/';
        } else {
            // Token is invalid, clear storage
            clearAuthData();
        }
    } catch (error) {
        console.error('Token verification failed:', error);
        clearAuthData();
    }
}

// Clear authentication data
function clearAuthData() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
}

// Logout function
function logout() {
    clearAuthData();
    window.location.href = '/login.html';
}

// Get authentication headers for API calls
function getAuthHeaders() {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    return headers;
}

// Check if user has required role
function hasRole(requiredRoles) {
    if (!currentUser) {
        return false;
    }
    
    if (Array.isArray(requiredRoles)) {
        return requiredRoles.includes(currentUser.role);
    }
    
    return currentUser.role === requiredRoles;
}

// Check if user can perform admin actions
function canManageCategories() {
    return hasRole(['SuperAdmin', 'Admin']);
}

// Check if user can view data
function canViewData() {
    return hasRole(['SuperAdmin', 'Admin', 'Manager', 'Staff']);
}
