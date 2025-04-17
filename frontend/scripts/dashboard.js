document.addEventListener('DOMContentLoaded', async () => {
    const userFiles = document.getElementById('userFiles');
    
    const response = await fetch('https://stego-tgu7.onrender.com/api/files', {
        credentials: 'include'
    });
    const files = await response.json();
    
    files.forEach(file => {
        const card = document.createElement('div');
        card.className = 'file-card';
        card.innerHTML = `
            <h3>${file.original_name}</h3>
            <a href="https://stego-tgu7.onrender.com/api/files/${file.id}" download>Download</a>
            <p>Uploaded: ${new Date(file.created_at).toLocaleDateString()}</p>
        `;
        userFiles.appendChild(card);
    });
});

document.getElementById('uploadForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
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
    
    if (response.ok) window.location.reload();
    else alert('Upload failed');
});