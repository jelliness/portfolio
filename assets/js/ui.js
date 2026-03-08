// ═══════════════════════════════════════════
//   UI UTILITIES
// ═══════════════════════════════════════════

const UI = (() => {

  // Toast notification
  function toast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const t = document.createElement('div');
    t.className = `toast ${type === 'error' ? 'error' : ''}`;
    t.textContent = message;
    document.body.appendChild(t);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => t.classList.add('show'));
    });
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 400);
    }, 3000);
  }

  // Scroll reveal
  function initScrollReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => observer.observe(el));
  }

  // Format date
  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  // Escape HTML
  function esc(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  // Confirm dialog
  function confirm(message) {
    return window.confirm(message);
  }

  // Skeleton loader
  function skeleton(count = 3) {
    return Array(count).fill(0).map(() => `
      <div class="card shimmer" style="min-height:160px;pointer-events:none"></div>
    `).join('');
  }

  return { toast, initScrollReveal, formatDate, esc, confirm, skeleton };
})();

export default UI;
