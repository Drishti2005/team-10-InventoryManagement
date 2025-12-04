const API_URL = 'http://localhost:5000/api';

async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });
        
        const result = await response.json();
        
        console.log('Login result:', result);
        
        if (result.success) {
            sessionStorage.setItem('user', JSON.stringify(result));
            console.log('Login successful, redirecting to dashboard');

            window.location.href = '/dashboard';
        } else {
            errorMessage.textContent = result.message;
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = 'An error occurred. Please try again.';
        errorMessage.style.display = 'block';
    }
}
