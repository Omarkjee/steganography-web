document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const [username, password] = Array.from(e.target.elements).map(el => el.value);
    
    const response = await fetch('https://stego-tgu7.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
    });
    
    if (response.ok) window.location.href = 'dashboard.html';
    else alert('Login failed');
});

document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const [username, password] = Array.from(e.target.elements).map(el => el.value);
    
    const response = await fetch('https://stego-tgu7.onrender.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    
    if (response.ok) window.location.href = 'login.html';
    else alert('Registration failed');
});

document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await fetch('https://stego-tgu7.onrender.com/api/logout', { credentials: 'include' });
    window.location.href = 'index.html';
});