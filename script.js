document.addEventListener('DOMContentLoaded', function () {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    /* ============ Footer year ============ */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ============ Announcement bar dismiss ============ */
    const announceBar = document.getElementById('announce-bar');
    const announceClose = document.getElementById('announce-close');
    if (announceBar && announceClose) {
        if (sessionStorage.getItem('announceDismissed') === '1') {
            announceBar.classList.add('is-hidden');
        }
        announceClose.addEventListener('click', () => {
            announceBar.classList.add('is-hidden');
            sessionStorage.setItem('announceDismissed', '1');
        });
    }

    /* ============ Mobile nav toggle ============ */
    const navToggle = document.getElementById('nav-toggle');
    const siteNav = document.getElementById('site-nav');
    if (navToggle && siteNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = siteNav.classList.toggle('mobile-open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
        siteNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                siteNav.classList.remove('mobile-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ============ Scrollspy: header nav + side rail ============ */
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const railItems = document.querySelectorAll('.rail-dots li');

    function setActive(id) {
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
        railItems.forEach(item => {
            item.classList.toggle('is-active', item.dataset.target === id);
        });
    }

    if (sections.length) {
        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) setActive(entry.target.id);
            });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

        sections.forEach(section => spyObserver.observe(section));
    }

    /* ============ Smooth scroll for in-page anchors ============ */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.length < 2) return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ============ Reveal-on-scroll ============ */
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        revealEls.forEach((el, i) => {
            el.style.transitionDelay = `${Math.min(i % 6, 5) * 0.06}s`;
            // Arm the hidden starting state only once JS is confirmed running,
            // so no-JS / slow-JS visitors always see full content.
            el.classList.add('reveal-armed');
            revealObserver.observe(el);
            // Safety net: force-reveal if the observer never fires (e.g. odd
            // layout timing) so content can never get stuck invisible.
            setTimeout(() => el.classList.add('in-view'), 2500);
        });
    }

    /* ============ Publication filtering ============ */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const publications = document.querySelectorAll('.publication-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            publications.forEach(pub => {
                const categories = pub.getAttribute('data-categories');
                if (filter === 'all' || (categories && categories.includes(filter))) {
                    pub.style.display = 'grid';
                    pub.style.opacity = '0';
                    requestAnimationFrame(() => { pub.style.opacity = '1'; });
                } else {
                    pub.style.display = 'none';
                }
            });
        });
    });

    /* ============ Contact form (Formspree) ============ */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const action = contactForm.getAttribute('action');

            if (!action || action.includes('YOUR_FORM_ID')) {
                formStatus.textContent = 'Form isn\'t connected yet — please email spandey2@furman.edu directly.';
                formStatus.className = 'form-status error';
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            formStatus.textContent = 'Sending…';
            formStatus.className = 'form-status';

            try {
                const response = await fetch(action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    formStatus.textContent = 'Thanks! Your message has been sent — I\'ll reply soon.';
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                } else {
                    formStatus.textContent = 'Something went wrong. Please try emailing spandey2@furman.edu instead.';
                    formStatus.className = 'form-status error';
                }
            } catch (err) {
                formStatus.textContent = 'Network error. Please try emailing spandey2@furman.edu instead.';
                formStatus.className = 'form-status error';
            } finally {
                submitBtn.disabled = false;
            }
        });
    }

    /* ============ Profile picture hover cycle ============ */
    const profilePhoto = document.getElementById('profile-photo');
    const profileImages = ['Self/Me5.JPG', 'Self/Me3.JPG', 'Self/Me4.JPG'];
    let currentImageIndex = 1;
    let hoverInterval;

    if (profilePhoto && !isTouchDevice) {
        profilePhoto.addEventListener('mouseenter', function () {
            hoverInterval = setInterval(() => {
                currentImageIndex = (currentImageIndex + 1) % profileImages.length;
                profilePhoto.src = profileImages[currentImageIndex];
            }, 500);
        });
        profilePhoto.addEventListener('mouseleave', function () {
            clearInterval(hoverInterval);
            currentImageIndex = 1;
            profilePhoto.src = profileImages[currentImageIndex];
        });
    }

    /* ============ Scroll-to-top button ============ */
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        scrollToTopBtn.classList.toggle('visible', window.pageYOffset > 500);
    });

    /* ============ Fade-in page load ============ */
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});
