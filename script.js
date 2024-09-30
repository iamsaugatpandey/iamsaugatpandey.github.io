document.addEventListener('DOMContentLoaded', function() {
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
});


document.addEventListener('DOMContentLoaded', function() {
    const newsBox = document.querySelector('.news-box');
    const newsList = document.querySelector('.news-list');
    let animationPaused = false;
    
    function startNewsAnimation() {
        if (animationPaused) return;
        
        const animationDistance = newsList.scrollHeight - newsBox.clientHeight;
        if (animationDistance > 0) {
            const duration = animationDistance * 0.1; // Adjust this multiplier to change speed
            newsList.style.transition = `transform ${duration}s linear`;
            newsList.style.transform = `translateY(-${animationDistance}px)`;
        }
    }

    function resetAnimation() {
        newsList.style.transition = 'none';
        newsList.style.transform = 'translateY(0)';
        setTimeout(() => startNewsAnimation(), 100);
    }

    // Start the animation
    startNewsAnimation();

    // Reset the animation when it completes
    newsList.addEventListener('transitionend', resetAnimation);

    // Pause animation on hover
    newsBox.addEventListener('mouseenter', function() {
        animationPaused = true;
        newsList.style.transition = 'none';
        const currentTransform = getComputedStyle(newsList).transform;
        newsList.style.transform = currentTransform;
    });

    // Resume animation when not hovering
    newsBox.addEventListener('mouseleave', function() {
        animationPaused = false;
        const currentY = newsList.getBoundingClientRect().top - newsBox.getBoundingClientRect().top;
        newsList.style.transform = `translateY(${currentY}px)`;
        setTimeout(() => startNewsAnimation(), 100);
    });

    // Allow scrolling when paused
    newsBox.addEventListener('wheel', function(e) {
        if (animationPaused) {
            e.preventDefault();
            newsBox.scrollTop += e.deltaY;
        }
    });
});