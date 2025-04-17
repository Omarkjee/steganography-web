
document.addEventListener('DOMContentLoaded', () => {
    const extractForm = document.getElementById('extractForm');
    if (!extractForm) return;

    extractForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const fileInput = document.getElementById('stegoFile');
        const s = parseInt(document.getElementById('extractS').value);
        const l = parseInt(document.getElementById('extractL').value);
        const c = parseInt(document.getElementById('extractMode').value);

        formData.append('file', fileInput.files[0]);
        formData.append('s', s);
        formData.append('l', l);
        formData.append('c', c);

        const response = await fetch('https://stego-tgu7.onrender.com/api/extract', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            document.getElementById('extractedMessage').textContent = result.message;
        } else {
            alert('Extraction failed');
        }
    });
});