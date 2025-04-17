document.addEventListener('DOMContentLoaded', async () => {
    const gallery = document.getElementById('gallery');
    
    const response = await fetch('https://stego-tgu7.onrender.com/api/files');
    const files = await response.json();
    
    files.forEach(file => {
        const card = document.createElement('div');
        card.className = 'file-card';
        card.innerHTML = `
            <h3>${file.original_name}</h3>
            <a href="https://stego-tgu7.onrender.com/api/files/${file.id}" download>Download</a>
            <p>Uploaded: ${new Date(file.created_at).toLocaleDateString()}</p>
        `;
        gallery.appendChild(card);
    });
});