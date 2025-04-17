// Client-side extraction helper
async function extractFromFile(file, s, l, c) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('s', s);
    formData.append('l', l);
    formData.append('c', c);

    const response = await fetch('https://stego-tgu7.onrender.com/api/extract', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) throw new Error('Extraction failed');
    return await response.json();
}

// Event listeners for extraction
document.addEventListener('DOMContentLoaded', () => {
    const extractForm = document.getElementById('extractForm');
    if (!extractForm) return;

    extractForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const file = document.getElementById('stegoFile').files[0];
            const s = parseInt(document.getElementById('extractS').value);
            const l = parseInt(document.getElementById('extractL').value);
            const c = parseInt(document.getElementById('extractMode').value);
            
            const result = await extractFromFile(file, s, l, c);
            document.getElementById('extractedMessage').textContent = result.message;
        } catch (error) {
            alert(error.message);
        }
    });
});