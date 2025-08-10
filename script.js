document.addEventListener('DOMContentLoaded', function() {
    // Detect if device supports touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Mango hover functionality - improved stability with touch support
    const mangoEmoji = document.getElementById('mango-hover');
    const nameDisplay = document.getElementById('name-display');
    const inlineHeader = document.querySelector('.inline-header');
    
    // Store original content (could be text or HTML with link)
    const originalContent = nameDisplay.innerHTML;
    const originalText = nameDisplay.textContent || nameDisplay.innerText;
    const hasLink = nameDisplay.querySelector('a') !== null;
    
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
                
                const currentText = nameDisplay.textContent || nameDisplay.innerText;
                
                if (currentText.trim() === originalText.trim()) {
                    // Show mango message
                    if (hasLink) {
                        nameDisplay.innerHTML = '<a href="index.html" style="text-decoration: none; color: inherit; cursor: pointer;">You can also call me Mango!</a>';
                    } else {
                        nameDisplay.textContent = 'You can also call me Mango!';
                    }
                    nameDisplay.style.fontSize = '1.8rem';
                    nameDisplay.style.color = '#FF6B35';
                    nameDisplay.style.transition = 'all 0.3s ease';
                    inlineHeader.classList.add('roomy');
                    
                    // Auto revert after 3 seconds on mobile
                    hoverTimeout = setTimeout(() => {
                        nameDisplay.innerHTML = originalContent;
                        nameDisplay.style.fontSize = '';
                        nameDisplay.style.color = '';
                        inlineHeader.classList.remove('roomy');
                    }, 3000);
                } else {
                    // Revert immediately if tapped again
                    nameDisplay.innerHTML = originalContent;
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
                if (hasLink) {
                    nameDisplay.innerHTML = '<a href="index.html" style="text-decoration: none; color: inherit; cursor: pointer;">You can also call me Mango!</a>';
                } else {
                    nameDisplay.textContent = 'You can also call me Mango!';
                }
                nameDisplay.style.fontSize = '1.8rem';
                nameDisplay.style.color = '#FF6B35';
                nameDisplay.style.transition = 'all 0.3s ease';
                // Make room by moving nav below
                inlineHeader.classList.add('roomy');
            });

            mangoEmoji.addEventListener('mouseleave', function() {
                // Set a stable timeout to revert the text
                hoverTimeout = setTimeout(() => {
                    nameDisplay.innerHTML = originalContent;
                    nameDisplay.style.fontSize = '';
                    nameDisplay.style.color = '';
                    inlineHeader.classList.remove('roomy');
                }, 500);
            });

            // Also handle the case when hovering over the changed text
            nameDisplay.addEventListener('mouseenter', function() {
                const currentText = nameDisplay.textContent || nameDisplay.innerText;
                if (currentText.includes('Mango')) {
                    // Clear timeout if hovering over the text itself
                    if (hoverTimeout) {
                        clearTimeout(hoverTimeout);
                    }
                    // Keep nav below while hovered
                    inlineHeader.classList.add('roomy');
                }
            });

            nameDisplay.addEventListener('mouseleave', function() {
                const currentText = nameDisplay.textContent || nameDisplay.innerText;
                if (currentText.includes('Mango')) {
                    // Set timeout to revert
                    hoverTimeout = setTimeout(() => {
                        nameDisplay.innerHTML = originalContent;
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

    // Navigation highlighting based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link');
    
    function updateActiveNavLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.offsetHeight;
            
            // Check if section is in viewport (considering some offset)
            if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
                current = section.getAttribute('id');
            }
        });
        
        // Remove active class from all nav links
        navLinksAll.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current section's nav link
        if (current) {
            const activeLink = document.querySelector(`.nav-link[href="#${current}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    window.addEventListener('load', updateActiveNavLink);    // Pronunciation audio functionality (if audio file exists)
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

    // Background icons dynamic full-screen movement
    const icons = document.querySelectorAll('.bg-icon');
    if (icons.length) {
        let time = 0;
        
        // Give each icon its own random motion parameters for full-screen movement
        icons.forEach((el, index) => {
            // Store original position as starting point
            const rect = el.getBoundingClientRect();
            const computedStyle = getComputedStyle(el);
            
            // Get initial positions from CSS
            let initialTop = parseFloat(computedStyle.top) || 0;
            let initialLeft = parseFloat(computedStyle.left) || 0;
            let initialRight = parseFloat(computedStyle.right) || 0;
            let initialBottom = parseFloat(computedStyle.bottom) || 0;
            
            // Convert percentage positions to pixels if needed
            if (computedStyle.top.includes('%')) {
                initialTop = (parseFloat(computedStyle.top) / 100) * window.innerHeight;
            }
            if (computedStyle.left.includes('%')) {
                initialLeft = (parseFloat(computedStyle.left) / 100) * window.innerWidth;
            }
            if (computedStyle.right.includes('%')) {
                initialRight = (parseFloat(computedStyle.right) / 100) * window.innerWidth;
                initialLeft = window.innerWidth - initialRight - 110; // 110px is icon width
            }
            if (computedStyle.bottom.includes('%')) {
                initialBottom = (parseFloat(computedStyle.bottom) / 100) * window.innerHeight;
                initialTop = window.innerHeight - initialBottom - 110; // Approximate icon height
            }
            
            el.dataset.startX = initialLeft;
            el.dataset.startY = initialTop;
            el.dataset.offsetX = Math.random() * Math.PI * 2;
            el.dataset.offsetY = Math.random() * Math.PI * 2;
            el.dataset.speedX = 0.3 + Math.random() * 0.4; // Slower for full-screen movement
            el.dataset.speedY = 0.2 + Math.random() * 0.3; // Different speeds for variety
            el.dataset.rangeX = 150 + Math.random() * 300; // How far they can move horizontally
            el.dataset.rangeY = 100 + Math.random() * 200; // How far they can move vertically
            
            // Set initial position to absolute for free movement
            el.style.position = 'fixed';
        });

        function animateIcons() {
            time += 0.008; // Slower animation for smoother full-screen movement
            
            icons.forEach((el, index) => {
                const startX = parseFloat(el.dataset.startX);
                const startY = parseFloat(el.dataset.startY);
                const offsetX = parseFloat(el.dataset.offsetX);
                const offsetY = parseFloat(el.dataset.offsetY);
                const speedX = parseFloat(el.dataset.speedX);
                const speedY = parseFloat(el.dataset.speedY);
                const rangeX = parseFloat(el.dataset.rangeX);
                const rangeY = parseFloat(el.dataset.rangeY);
                const depth = parseFloat(el.getAttribute('data-depth') || '0.1');
                
                // Create smooth, large-scale movement patterns
                const baseMovementX = Math.sin(time * speedX + offsetX) * rangeX;
                const baseMovementY = Math.cos(time * speedY + offsetY) * rangeY;
                
                // Add secondary wave for more complex motion
                const secondaryX = Math.sin(time * speedX * 1.3 + offsetX + Math.PI) * (rangeX * 0.3);
                const secondaryY = Math.cos(time * speedY * 0.7 + offsetY + Math.PI) * (rangeY * 0.4);
                
                // Combine movements
                const totalX = startX + baseMovementX + secondaryX;
                const totalY = startY + baseMovementY + secondaryY;
                
                // Add scroll-based parallax effect
                const scrollOffset = window.scrollY * depth * 0.1;
                
                // Ensure icons stay within viewport bounds
                const maxX = window.innerWidth - 110; // Icon width
                const maxY = window.innerHeight - 110; // Icon height
                const constrainedX = Math.max(0, Math.min(maxX, totalX));
                const constrainedY = Math.max(0, Math.min(maxY, totalY + scrollOffset));
                
                // Apply the transformation
                el.style.left = constrainedX + 'px';
                el.style.top = constrainedY + 'px';
                
                // Add subtle rotation for more dynamic feel
                const rotation = Math.sin(time * speedX * 0.5 + offsetX) * 5;
                el.style.transform = `rotate(${rotation}deg)`;
                
                // Vary opacity slightly for depth effect
                const opacityVariation = 0.05 + Math.sin(time * speedY * 0.3 + offsetY) * 0.02;
                el.style.opacity = Math.max(0.08, Math.min(0.12, 0.1 + opacityVariation));
            });
            
            requestAnimationFrame(animateIcons);
        }
        requestAnimationFrame(animateIcons);
        
        // Handle window resize to recalculate starting positions
        window.addEventListener('resize', () => {
            icons.forEach((el, index) => {
                const computedStyle = getComputedStyle(el);
                let initialTop = parseFloat(computedStyle.top) || 0;
                let initialLeft = parseFloat(computedStyle.left) || 0;
                
                // Recalculate based on new window size if using percentages
                if (el.classList.contains('icon-ai')) {
                    initialTop = 0.12 * window.innerHeight;
                    initialLeft = 0.08 * window.innerWidth;
                } else if (el.classList.contains('icon-brain')) {
                    initialTop = window.innerHeight - (0.10 * window.innerHeight) - 110;
                    initialLeft = 0.14 * window.innerWidth;
                } else if (el.classList.contains('icon-chart')) {
                    initialTop = 0.18 * window.innerHeight;
                    initialLeft = window.innerWidth - (0.12 * window.innerWidth) - 110;
                } else if (el.classList.contains('icon-eyes')) {
                    initialTop = window.innerHeight - (0.16 * window.innerHeight) - 110;
                    initialLeft = window.innerWidth - (0.10 * window.innerWidth) - 110;
                } else if (el.classList.contains('icon-human')) {
                    initialTop = 0.46 * window.innerHeight;
                    initialLeft = (window.innerWidth / 2) - 55; // Center horizontally
                }
                
                el.dataset.startX = initialLeft;
                el.dataset.startY = initialTop;
            });
        });
    }
});
