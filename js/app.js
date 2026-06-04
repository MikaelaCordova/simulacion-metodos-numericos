/* ==========================================================================
   App.js — Router, Navigation, and Initialization
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Initialize Navigation
    const navbarToggle = document.getElementById('navbar-toggle');
    const navbarMenu = document.getElementById('navbar-menu');
    const navbar = document.getElementById('navbar');

    navbarToggle.addEventListener('click', () => {
        navbarMenu.classList.toggle('open');
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Simple Hash Router
    const routes = {
        '#inicio': { render: HomeModule.render, init: null },
        '#modulo1': { render: Module1.render, init: Module1.init },
        '#modulo2': { render: Module2.render, init: Module2.init },
        '#modulo3': { render: Module3.render, init: Module3.init },
        '#modulo4': { render: Module4.render, init: Module4.init },
        '#modulo5': { render: Module5.render, init: Module5.init },
        '#conclusiones': { render: ConclusionsModule.render, init: null }
    };

    function navigate() {
        let hash = window.location.hash;
        if (!routes[hash]) {
            hash = '#inicio';
            window.location.hash = hash;
            return;
        }

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            }
        });

        // Close mobile menu
        navbarMenu.classList.remove('open');

        // Render content
        const main = document.getElementById('main-content');
        const route = routes[hash];
        
        main.innerHTML = route.render();
        if (route.init) {
            route.init();
        }

        // Scroll to top
        window.scrollTo(0, 0);
    }

    // Listen to hash changes
    window.addEventListener('hashchange', navigate);

    // Initial load
    navigate();

});
