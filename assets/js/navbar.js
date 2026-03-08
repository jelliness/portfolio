// ═══════════════════════════════════════════
//   NAVBAR COMPONENT
// ═══════════════════════════════════════════

const Navbar = (() => {
  function getNavHTML(activePage = '') {
    const pages = [
      { href: '../index.html', label: 'Dashboard' },
      { href: 'projects.html', label: 'Projects' },
      { href: 'experience.html', label: 'Experience' },
      { href: 'skills.html', label: 'Skills' },
      { href: 'blog.html', label: 'Blog' },
      { href: 'about.html', label: 'About' },
    ];
    const isIndex = activePage === 'index';
    const base = isIndex ? '' : '../';
    const links = pages.map(p => {
      const href = isIndex ? (p.href === '../index.html' ? '#' : `pages/${p.href}`) : p.href;
      const active = activePage && p.label.toLowerCase() === activePage ? 'style="color:var(--accent-cyan)"' : '';
      return `<a href="${href}" ${active}>${p.label}</a>`;
    });

    return `
    <nav class="nav" id="main-nav">
      <div class="nav-logo" onclick="location.href='${isIndex ? '#' : '../index.html'}'">
        JAK<span>M</span>
      </div>
      <ul class="nav-links">
        ${links.map(l => `<li>${l}</li>`).join('')}
        <li><a href="#" class="nav-cta contact-trigger">Contact</a></li>
      </ul>
      <button class="nav-hamburger" id="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </nav>
    <div class="mobile-nav" id="mobile-nav">
      <button class="mobile-nav-close" id="mobile-close">✕</button>
      ${links.map(l => l).join('')}
      <a href="#" class="contact-trigger" style="color:var(--accent-cyan)">Contact</a>
    </div>
    `;
  }

  function init(activePage = '') {
    const placeholder = document.getElementById('nav-placeholder');
    if (placeholder) {
      placeholder.innerHTML = getNavHTML(activePage);
    }

    // Scroll shadow
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('main-nav');
      if (nav) nav.style.background = window.scrollY > 40 ? 'rgba(4,5,13,0.95)' : 'rgba(4,5,13,0.7)';
    });

    // Mobile menu
    document.addEventListener('click', e => {
      if (e.target.id === 'hamburger' || e.target.closest('#hamburger')) {
        document.getElementById('mobile-nav')?.classList.add('open');
      }
      if (e.target.id === 'mobile-close' || e.target.closest('#mobile-close')) {
        document.getElementById('mobile-nav')?.classList.remove('open');
      }
      if (e.target.id === 'mobile-nav') {
        document.getElementById('mobile-nav')?.classList.remove('open');
      }
    });

    // Initialize contact form if available
    if (window.ContactForm) {
      window.ContactForm.init();
    }
  }

  return { init, getNavHTML };
})();

export default Navbar;
