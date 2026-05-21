(function () {
  const logoSrc = '/CSCLogo01.png';
  const investmentsLogoSrc = '/CSCInvestmentsLogo.png';
  const contactEmail = 'cookservicescompany@gmail.com';
  const year = new Date().getFullYear();
  const path = window.location.pathname.replace(/\/index\.html$/, '/');

  function pageLink(href, label, extraAttrs = '') {
    const normalizedHref = href === '/' ? '/' : href.replace(/\/index\.html$/, '/');
    const isCurrent = path === normalizedHref || (href.startsWith('#') && window.location.hash === href);
    return `<a href="${href}" ${isCurrent ? 'aria-current="page"' : ''} ${extraAttrs}>${label}</a>`;
  }

  const headerMount = document.getElementById('csc-site-header');
  if (headerMount) {
    headerMount.innerHTML = `
      <a class="csc-skip-link" href="#main">Skip to content</a>
      <header class="csc-site-header">
        <div class="csc-shell csc-header-inner">
          <a class="csc-brand" href="/" aria-label="Cook Services Company home">
            <img class="csc-brand-mark" src="${logoSrc}" alt="Cook Services Company logo" loading="eager">
            <span class="csc-brand-text">
              <span class="csc-brand-name">Cook Services Company, LLC</span>
              <span class="csc-brand-tagline">Private Investment · Venture Development · Portfolio Operations</span>
            </span>
          </a>
          <button class="csc-nav-toggle" type="button" aria-expanded="false" aria-controls="csc-primary-nav">Menu</button>
          <nav class="csc-nav" id="csc-primary-nav" aria-label="Primary navigation">
            ${pageLink('/', 'Home')}
            ${pageLink('/#portfolio', 'Portfolio')}
            ${pageLink('/investors/', 'Investors')}
            ${pageLink('/#contact', 'Contact')}
            ${pageLink('/terms/', 'Terms')}
            ${pageLink('/privacy/', 'Privacy')}
          </nav>
        </div>
      </header>
    `;
  }

  const footerMount = document.getElementById('csc-site-footer');
  if (footerMount) {
    footerMount.innerHTML = `
      <footer class="csc-site-footer">
        <div class="csc-shell">
          <div class="csc-footer-grid">
            <div class="csc-footer-brand">
              <a href="/" aria-label="Cook Services Company home">
                <img class="csc-footer-investments-logo" src="${investmentsLogoSrc}" alt="CSC Investments logo" loading="lazy">
              </a>
              <div>
                <div class="csc-footer-title">Cook Services Company, LLC</div>
                <span class="csc-footer-subtitle">Private Investment. Venture Development. Portfolio Operations.</span>
              </div>
            </div>
            <div class="csc-footer-links" aria-label="Footer links">
              <a href="/investors/">CSC Investments</a>
              <a href="https://www.livingwordbibles.com" target="_blank" rel="noopener">Living Word Bibles</a>
              <a href="https://www.quickhire.agency" target="_blank" rel="noopener">QuickHire™</a>
              <a href="https://www.cgnnews.net" target="_blank" rel="noopener">CGN News</a>
              <a href="/terms/">Terms of Service</a>
              <a href="/privacy/">Privacy Policy</a>
              <a href="/#contact">Contact</a>
            </div>
            <div class="csc-footer-contact">
              <strong>Cook Services Company, LLC</strong><br>
              Market Square Center<br>
              151 N. Delaware Street, Suite 122<br>
              Indianapolis, IN 46204<br>
              <a href="tel:+13174421437">(317) 442-1437</a><br>
              <a href="mailto:${contactEmail}">${contactEmail}</a>
            </div>
          </div>
          <div class="csc-footer-bottom">
            Copyright © ${year} Cook Services Company, LLC. All Rights Reserved.
          </div>
        </div>
      </footer>
    `;
  }

  document.addEventListener('click', function (event) {
    const toggle = event.target.closest('.csc-nav-toggle');
    const navLink = event.target.closest('.csc-nav a');

    if (toggle) {
      const isOpen = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      return;
    }

    if (navLink && document.body.classList.contains('nav-open')) {
      document.body.classList.remove('nav-open');
      const navToggle = document.querySelector('.csc-nav-toggle');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }
  });
})();
