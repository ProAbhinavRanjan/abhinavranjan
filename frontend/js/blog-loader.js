// blog-loader.js
// This script fetches blog metadata from assets/data/blogs.json and populates the blog list.
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('blogList');
  if (!container) return;
  fetch('../assets/data/blogs.json')
    .then(res => res.json())
    .then(blogs => {
      if (!Array.isArray(blogs)) return;
      blogs.forEach(blog => {
        const article = document.createElement('article');
        article.className = 'blog-card';
        const title = document.createElement('h3');
        title.textContent = blog.title || 'Untitled';
        const excerpt = document.createElement('p');
        excerpt.textContent = blog.excerpt || '';
        const link = document.createElement('a');
        link.href = `blog-article.html?id=${blog.id}`;
        link.textContent = 'Read more';
        article.appendChild(title);
        article.appendChild(excerpt);
        article.appendChild(link);
        container.appendChild(article);
      });
    })
    .catch(err => console.error('Failed to load blogs', err));
});
