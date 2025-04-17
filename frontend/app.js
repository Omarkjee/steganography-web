const form = document.getElementById('uploadForm');
const postsDiv = document.getElementById('posts');

form.onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const token = localStorage.getItem('token');

  const res = await fetch('https://your-backend-url.onrender.com/api/stego/embed', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });

  const data = await res.json();
  alert(data.message);
  loadPosts();
};

const loadPosts = async () => {
  const res = await fetch('https://your-backend-url.onrender.com/api/stego/posts');
  const posts = await res.json();

  postsDiv.innerHTML = '';
  posts.forEach(p => {
    const img = document.createElement('img');
    img.src = `https://your-backend-url.onrender.com/api/stego/file/${p.filename.split('/').pop()}`;
    img.style.width = '200px';
    postsDiv.appendChild(img);
  });
};

loadPosts();
