document.addEventListener('DOMContentLoaded', () => {
    // Header shadow on scroll
    const header = document.querySelector('.header');
    // passive + chỉ đổi style khi trạng thái thay đổi: cuộn mượt hơn trên điện thoại yếu
    let scrolled = null;
    window.addEventListener('scroll', () => {
        const now = window.scrollY > 10;
        if (now === scrolled) return;
        scrolled = now;
        header.style.boxShadow = now ? '0 4px 15px rgba(0,0,0,0.1)' : '0 2px 10px rgba(0,0,0,0.05)';
    }, { passive: true });

    // Mobile hamburger menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-menu a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Remove active class from all
            document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
            // Add to clicked
            this.classList.add('active');

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
