document.addEventListener('DOMContentLoaded', function() {
    // Detect if device supports touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Mango hover functionality - improved stability with touch support
    const mangoEmoji = document.getElementById('mango-hover');
    const nameDisplay = document.getElementById('name-display');
    const inlineHeader = document.querySelector('.inline-header');
    const originalName = nameDisplay.textContent;
    let hoverTimeout = null;

    if (mangoEmoji && nameDisplay && inlineHeader) {
        if (isTouchDevice) {
            // Touch device: use click/tap instead of hover
            mangoEmoji.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Clear any existing timeout
                if (hoverTimeout) {
                    clearTimeout(hoverTimeout);
                }
                
                if (nameDisplay.textContent === originalName) {
                    // Show mango message
                    nameDisplay.textContent = 'You can also call me Mango!';
                    nameDisplay.style.fontSize = '1.8rem';
                    nameDisplay.style.color = '#FF6B35';
                    nameDisplay.style.transition = 'all 0.3s ease';
                    inlineHeader.classList.add('roomy');
                    
                    // Auto revert after 3 seconds on mobile
                    hoverTimeout = setTimeout(() => {
                        nameDisplay.textContent = originalName;
                        nameDisplay.style.fontSize = '';
                        nameDisplay.style.color = '';
                        inlineHeader.classList.remove('roomy');
                    }, 3000);
                } else {
                    // Revert immediately if tapped again
                    nameDisplay.textContent = originalName;
                    nameDisplay.style.fontSize = '';
                    nameDisplay.style.color = '';
                    inlineHeader.classList.remove('roomy');
                }
            });
        } else {
            // Desktop: use hover
            mangoEmoji.addEventListener('mouseenter', function() {
                // Clear any existing timeout
                if (hoverTimeout) {
                    clearTimeout(hoverTimeout);
                }
                
                // Show mango message immediately
                nameDisplay.textContent = 'You can also call me Mango!';
                nameDisplay.style.fontSize = '1.8rem';
                nameDisplay.style.color = '#FF6B35';
                nameDisplay.style.transition = 'all 0.3s ease';
                // Make room by moving nav below
                inlineHeader.classList.add('roomy');
            });

            mangoEmoji.addEventListener('mouseleave', function() {
                // Set a stable timeout to revert the text
                hoverTimeout = setTimeout(() => {
                    nameDisplay.textContent = originalName;
                    nameDisplay.style.fontSize = '';
                    nameDisplay.style.color = '';
                    inlineHeader.classList.remove('roomy');
                }, 500);
            });

            // Also handle the case when hovering over the changed text
            nameDisplay.addEventListener('mouseenter', function() {
                if (nameDisplay.textContent === 'You can also call me Mango!') {
                    // Clear timeout if hovering over the text itself
                    if (hoverTimeout) {
                        clearTimeout(hoverTimeout);
                    }
                    // Keep nav below while hovered
                    inlineHeader.classList.add('roomy');
                }
            });

            nameDisplay.addEventListener('mouseleave', function() {
                if (nameDisplay.textContent === 'You can also call me Mango!') {
                    // Set timeout to revert
                    hoverTimeout = setTimeout(() => {
                        nameDisplay.textContent = originalName;
                        nameDisplay.style.fontSize = '';
                        nameDisplay.style.color = '';
                        inlineHeader.classList.remove('roomy');
                    }, 500);
                }
            });
        }
    }

    // Publication filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const publications = document.querySelectorAll('.publication-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Toggle active class on buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show/hide publications based on filter
            publications.forEach(pub => {
                const categories = pub.getAttribute('data-categories');
                if (filter === 'all' || (categories && categories.includes(filter))) {
                    pub.style.display = 'grid';
                    // Add fade-in animation
                    pub.style.opacity = '0';
                    setTimeout(() => {
                        pub.style.opacity = '1';
                    }, 100);
                } else {
                    pub.style.display = 'none';
                }
            });
        });
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 40;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Pronunciation audio functionality (if audio file exists)
    const pronunciationIcon = document.querySelector('.pronunciation-icon');
    if (pronunciationIcon) {
        pronunciationIcon.addEventListener('click', function() {
            const audio = new Audio('pronouce.m4a');
            audio.play().catch(e => console.log('Audio playback failed:', e));
        });
    }

    // Add scroll-to-top functionality
    let scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: var(--shadow-medium);
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    `;

    document.body.appendChild(scrollToTopBtn);

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });

    // Add animation on scroll for publication items
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe publication items for scroll animation
    publications.forEach(pub => {
        pub.style.opacity = '0';
        pub.style.transform = 'translateY(20px)';
        pub.style.transition = 'all 0.6s ease';
        observer.observe(pub);
    });

    // Add hover effect for social icons
    const socialIcons = document.querySelectorAll('.social-icons a');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.1)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Active navigation highlighting based on scroll position
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.pageYOffset + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink && scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                navLink.classList.add('active');
            }
        });
    });

    // Add loading animation
    document.body.style.opacity = '0';
    window.addEventListener('load', () => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    });

    // Remove old SVG parallax if present
    const oldShapes = document.querySelectorAll('.bg-shape');
    if (oldShapes.length) {
        oldShapes.forEach(s => s.style.display = 'none');
    }

    // Background icons very slow motion
    const icons = document.querySelectorAll('.bg-icon');
    if (icons.length) {
        icons.forEach(el => {
            const base = getComputedStyle(el).transform;
            el.dataset.baseTransform = base && base !== 'none' ? base : '';
        });

        const lerp = (a, b, t) => a + (b - a) * t;
        let time = 0;
        
        // Give each icon its own random motion parameters
        icons.forEach((el, index) => {
            el.dataset.offsetX = Math.random() * Math.PI * 2;
            el.dataset.offsetY = Math.random() * Math.PI * 2;
            el.dataset.speedX = 0.8 + Math.random() * 0.4; // Random speed between 0.8 and 1.2
            el.dataset.speedY = 0.6 + Math.random() * 0.6; // Random speed between 0.6 and 1.2
        });

        function animateIcons() {
            time += 0.012; // faster animation
            icons.forEach((el, index) => {
                const depth = parseFloat(el.getAttribute('data-depth') || '0.1');
                const offsetX = parseFloat(el.dataset.offsetX);
                const offsetY = parseFloat(el.dataset.offsetY);
                const speedX = parseFloat(el.dataset.speedX);
                const speedY = parseFloat(el.dataset.speedY);
                
                // Random circular/orbital motion for each icon
                const px = Math.sin(time * speedX + offsetX) * 40 * depth;
                const py = Math.cos(time * speedY + offsetY) * 35 * depth;
                
                // Add some vertical drift based on scroll
                const scrollDrift = window.scrollY * 0.02 * depth;
                
                const base = el.dataset.baseTransform || '';
                el.style.transform = `${base} translate(${px}px, ${py + scrollDrift}px)`;
            });
            requestAnimationFrame(animateIcons);
        }
        requestAnimationFrame(animateIcons);
    }
});
