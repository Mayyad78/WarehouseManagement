// Authentication JavaScript
const API_BASE_URL = '/api';

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

        // Get response text first
        const responseText = await response.text();
        console.log('Login response status:', response.status);
        console.log('Login response text:', responseText);

        if (!response.ok) {
            // Try to parse as JSON for error message
            let errorMsg = 'Login failed. Please try again.';
            try {
                const errorData = JSON.parse(responseText);
                errorMsg = errorData.message || errorMsg;
            } catch (e) {
                errorMsg = responseText || errorMsg;
            }
            throw new Error(errorMsg);
        }

        // Parse successful response
        const authResponse = JSON.parse(responseText);
        console.log('Parsed auth response:', authResponse);

        // Store authentication data
        localStorage.setItem('authToken', authResponse.token);
        localStorage.setItem('currentUser', JSON.stringify(authResponse.user));

        console.log('Token stored:', authResponse.token);
        console.log('User stored:', authResponse.user);

        // Redirect to main application
        window.location.href = '/';

    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = error.message || 'Login failed. Please try again.';
        errorMessage.style.display = 'block';
    } finally {
        // Reset button state
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
    }
}