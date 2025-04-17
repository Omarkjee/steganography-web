// Utility function for dashboard
function setLoading(formId, isLoading) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const btn = form.querySelector('button[type="submit"]');
    const btnText = btn.querySelector('span:first-child');
    const spinner = btn.querySelector('span:last-child');
    const errorEl = form.querySelector('.error');
    
    btn.disabled = isLoading;
    btnText.classList.toggle('hidden', isLoading);
    spinner.classList.toggle('hidden', !isLoading);
    if (!isLoading) errorEl.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', async () => {
    // Check auth status
    try {
        const response = await fetch('https://stego-tgu7.onrender.com/api/auth/check', {
            credentials: 'include'
        });
        
        if (!response.ok) {
            window.location.href = 'login.html';
            return;
        }
        
        // Load user files
        const files = await fetch('https://stego-tgu7.onrender.com/api/files', {
            credentials: 'include'
        }).then(res => res.json());
        
        // Render files...
    } catch (error) {
        window.location.href = 'login.html';
    }
});

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await fetch('https://stego-tgu7.onrender.com/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
    });
    window.location.href = 'index.html';
});

// File Upload
document.getElementById('uploadForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    setLoading('uploadForm', true);
    
    try {
        const formData = new FormData();
        formData.append('file', e.target.elements.carrierFile.files[0]);
        formData.append('message', e.target.elements.secretMessage.value);
        formData.append('s', parseInt(e.target.elements.startBit.value));
        formData.append('l', parseInt(e.target.elements.periodicity.value));
        formData.append('c', parseInt(e.target.elements.mode.value));
        
        const response = await fetch('https://stego-tgu7.onrender.com/api/files', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Upload failed');
        }
        
        window.location.reload();
    } catch (error) {
        const errorEl = document.getElementById('uploadError');
        errorEl.textContent = error.message;
        errorEl.classList.remove('hidden');
    } finally {
        setLoading('uploadForm', false);
    }
});