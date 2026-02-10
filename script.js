// Load stored theme
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Theme toggler (works even though it's an <a>)
  const btn = document.getElementById('toggleTheme');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault(); // stops jumping to top because href="#"
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
});
