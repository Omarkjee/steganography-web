const form = document.getElementById('uploadForm');
const token = localStorage.getItem('token');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const res = await fetch('https://stego-tgu7.onrender.com/api/stego/embed', {
    method: 'POST',
    headers: { Authorization: token },
    body: formData
  });
  const data = await res.json();
  document.getElementById('output').innerHTML = res.ok
    ? `<a href="${data.url}" target="_blank">View Modified File</a>`
    : data.message;
});
