document.addEventListener('DOMContentLoaded', function() {
    // Publication filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const publications = document.querySelectorAll('.publication');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Toggle active class on buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show/hide publications based on filter
            publications.forEach(pub => {
                if (filter === 'all' || pub.getAttribute('data-categories').includes(filter)) {
                    pub.style.display = 'block';
                } else {
                    pub.style.display = 'none';
                }
            });
        });
    });

    // Pronunciation audio functionality
    const pronunciationIcon = document.querySelector('.pronunciation-icon');
    if (pronunciationIcon) {
        pronunciationIcon.addEventListener('click', function() {
            const audio = new Audio('pronouce.m4a');
            audio.play().catch(e => console.log('Audio playback failed:', e));
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.sidebar nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll-to-top functionality
    const scrollToTop = document.createElement('button');
    scrollToTop.innerHTML = '↑';
    scrollToTop.style.cssText = `
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
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        display: none;
    `;

    document.body.appendChild(scrollToTop);

    scrollToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTop.style.display = 'block';
            scrollToTop.style.opacity = '1';
        } else {
            scrollToTop.style.opacity = '0';
            setTimeout(() => {
                if (window.pageYOffset <= 300) {
                    scrollToTop.style.display = 'none';
                }
            }, 300);
        }
    });

    // Research interests interactive functionality
    const researchItems = document.querySelectorAll('.research-item');
    researchItems.forEach(item => {
        item.addEventListener('click', function() {
            // Close all other items
            researchItems.forEach(otherItem => {
                if (otherItem !== this) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            this.classList.toggle('active');
        });
    });

    // Ecosystem diagram interactions
    const ecosystemNodes = document.querySelectorAll('.ecosystem-node');
    const connectionLines = document.querySelectorAll('.connection-line');
    const ecosystemDescription = document.getElementById('ecosystem-description');
    
    // Store the original description
    const originalDescription = ecosystemDescription.textContent;
    
    // Node descriptions
    const nodeDescriptions = {
        'researcher': 'My research bridges human cognition, AI technologies, and data visualization to create more effective and trustworthy visual communication tools.',
        'human-vision': 'Understanding how humans perceive and process visual information is fundamental to creating effective data visualizations that align with cognitive capabilities.',
        'ai-models': 'Leveraging cutting-edge AI and computer vision models to automatically analyze, understand, and enhance data visualizations for better human comprehension.',
        'visualizations': 'Creating and studying data visualizations that effectively communicate complex information while maintaining accuracy and preventing misinterpretation.',
        'culture': 'Investigating how cultural background influences visualization interpretation and designing inclusive visual representations that work across diverse populations.',
        'literacy': 'Measuring and improving people\'s ability to read, understand, and critically evaluate data visualizations in our increasingly data-driven world.',
        'trust': 'Studying the factors that build or erode user trust in data visualizations and developing frameworks to create more trustworthy visual representations.'
    };
    
    ecosystemNodes.forEach(node => {
        node.addEventListener('mouseenter', function() {
            const nodeType = this.getAttribute('data-node');
            
            // Update description
            if (nodeDescriptions[nodeType]) {
                ecosystemDescription.textContent = nodeDescriptions[nodeType];
            }
            
            // Highlight relevant connections
            connectionLines.forEach(line => {
                line.style.opacity = '0.2';
            });
            
            // Add visual feedback
            this.style.transform = this.style.transform.includes('scale') ? 
                this.style.transform.replace(/scale\([^)]*\)/, 'scale(1.3)') : 
                this.style.transform + ' scale(1.3)';
        });
        
        node.addEventListener('mouseleave', function() {
            // Reset description to original
            ecosystemDescription.textContent = originalDescription;
            
            // Reset all connections
            connectionLines.forEach(line => {
                line.style.opacity = '';
            });
            
            // Reset transform
            const nodeType = this.getAttribute('data-node');
            if (nodeType === 'researcher') {
                this.style.transform = 'translate(-50%, -50%) scale(1.2)';
            } else {
                this.style.transform = this.style.transform.replace(/scale\([^)]*\)/, '');
            }
        });
    });
});