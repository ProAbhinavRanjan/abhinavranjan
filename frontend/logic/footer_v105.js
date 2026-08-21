/**
 * footer_v105.js — Unified Professional Dynamic Footer Injector
 * Autonomously resolves relative path depths to ensure 100% valid links across all site subdirectories.
 */

(function () {
  function getPathPrefix() {
    const path = window.location.pathname.replace(/\\/g, '/');
    if (path.includes('/frontend/html/moredetails/')) {
      return '../../../';
    }
    if (path.includes('/frontend/html/') || path.includes('/frontend/gallery/') || path.includes('/frontend/lts/') || path.includes('/frontend/blogs/')) {
      return '../../';
    }
    return '';
  }

  function injectFooter() {
    let footerEl = document.getElementById('siteFooter');
    if (!footerEl) {
      footerEl = document.createElement('footer');
      footerEl.id = 'siteFooter';
      document.body.appendChild(footerEl);
    }
    // Always ensure the footer class is applied for styling
    if (!footerEl.classList.contains('footer')) {
      footerEl.classList.add('footer');
    }

    const prefix = getPathPrefix();

    footerEl.innerHTML = `
      <div class="footer-container container">
        <div class="footer-grid">
          <!-- Col 1: Brand & Tagline -->
          <div class="footer-col footer-brand-col">
            <a href="${prefix}index.html" class="footer-logo">AR<span class="dot">.</span></a>
            <p class="footer-desc">
              Building resilient cloud systems, cybersecurity frameworks, and digital architecture.
            </p>
            <div class="footer-socials">
              <a href="https://github.com/DeveloperAbhinav" target="_blank" aria-label="GitHub"><i class="fab fa-github"></i></a>
              <a href="${prefix}frontend/html/socials.html" aria-label="Social Networks"><i class="fas fa-globe"></i></a>
              <a href="${prefix}frontend/html/contact.html" aria-label="Contact"><i class="fas fa-envelope"></i></a>
            </div>
          </div>

          <!-- Col 2: Navigation -->
          <div class="footer-col">
            <h4 class="footer-title">Navigation</h4>
            <ul class="footer-links">
              <li><a href="${prefix}index.html"><i class="fas fa-chevron-right"></i> Home</a></li>
              <li><a href="${prefix}frontend/html/about.html"><i class="fas fa-chevron-right"></i> About</a></li>
              <li><a href="${prefix}frontend/html/projects.html"><i class="fas fa-chevron-right"></i> Projects</a></li>
              <li><a href="${prefix}frontend/html/biography.html"><i class="fas fa-chevron-right"></i> Biography</a></li>
              <li><a href="${prefix}frontend/html/contact.html"><i class="fas fa-chevron-right"></i> Contact</a></li>
            </ul>
          </div>

          <!-- Col 3: Ecosystem -->
          <div class="footer-col">
            <h4 class="footer-title">Ecosystem</h4>
            <ul class="footer-links">
              <li><a href="${prefix}frontend/gallery/index.html"><i class="fas fa-chevron-right"></i> Gallery Archive</a></li>
              <li><a href="${prefix}frontend/lts/index.html"><i class="fas fa-chevron-right"></i> Live Telecast (LTS)</a></li>
              <li><a href="${prefix}frontend/blogs/index.html"><i class="fas fa-chevron-right"></i> Tech Stories Blog</a></li>
              <li><a href="${prefix}frontend/html/winnings.html"><i class="fas fa-chevron-right"></i> Awards & Achievements</a></li>
              <li><a href="${prefix}frontend/html/moredetails/asked-questions.html"><i class="fas fa-chevron-right"></i> FAQ</a></li>
            </ul>
          </div>

          <!-- Col 4: Action Buttons & Copyright -->
          <div class="footer-col footer-action-col">
            <div class="footer-pill-links">
              <a href="${prefix}frontend/html/moredetails/privacy-policy.html" class="footer-pill-btn">Privacy Policy</a>
              <a href="${prefix}frontend/html/moredetails/terms-and-conditions.html" class="footer-pill-btn">Terms & Conditions</a>
              <a href="${prefix}frontend/html/moredetails/glossary.html" class="footer-pill-btn">Glossary</a>
            </div>
            <div class="footer-pill-links-center">
              <a href="${prefix}devend/index.html" class="footer-pill-btn dev-btn"><span class="dev-icon">&gt;_</span> Dev Portal</a>
            </div>
            
            <div class="footer-divider"></div>
            
            <div class="footer-copyright-row">
              <p>© ${new Date().getFullYear()} AR. Abhinav Ranjan. All Rights Reserved.</p>
              <button id="scrollToTopBtn" aria-label="Back to Top" title="Back to Top"><i class="fas fa-arrow-up"></i> Top</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const backBtn = document.getElementById('scrollToTopBtn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooter);
  } else {
    injectFooter();
  }
})();
