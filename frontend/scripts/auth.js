// Utility function to toggle loading state
function setLoading(formId, isLoading) {
    const btn = document.querySelector(`#${formId} button[type="submit"]`);
    const btnText = btn.querySelector('span:first-child');
    const spinner = btn.querySelector('span:last-child');
    const errorEl = document.querySelector(`#${formId} .error`);
    
    btn.disabled = isLoading;
    btnText.classList.toggle('hidden', isLoading);
    spinner.classList.toggle('hidden', !isLoading);
    if (!isLoading) errorEl.classList.add('hidden');
}

// Login Form
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    setLoading('loginForm', true);
    
    try {
        const formData = {
            username: e.target.elements[0].value,
            password: e.target.elements[1].value
        };
        
        const response = await fetch('https://stego-tgu7.onrender.com/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            credentials: 'include'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }
        
        window.location.href = 'dashboard.html';
    } catch (error) {
        const errorEl = document.getElementById('loginError');
        errorEl.textContent = error.message;
        errorEl.classList.remove('hidden');
    } finally {
        setLoading('loginForm', false);
    }
});

// Registration Form
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    setLoading('registerForm', true);
    
    try {
        const formData = {
            username: e.target.elements[0].value,
            password: e.target.elements[1].value
        };
        
        const response = await fetch('https://stego-tgu7.onrender.com/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }
        
        alert('Registration successful! Please login.');
        window.location.href = 'login.html';
    } catch (error) {
        const errorEl = document.getElementById('registerError');
        errorEl.textContent = error.message;
        errorEl.classList.remove('hidden');
    } finally {
        setLoading('registerForm', false);
    }
});