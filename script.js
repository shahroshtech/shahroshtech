function createPlexus(canvasId, densityDivisor = 10000) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    window.addEventListener('mousemove', function (event) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });

    window.addEventListener('mouseleave', function () {
        mouse.x = null;
        mouse.y = null;
    });

    function init() {
        if (!canvas.parentElement) return;
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        particles = [];
        let numParticles = Math.floor((canvas.width * canvas.height) / densityDivisor);
        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                size: Math.random() * 2 + 1,
                color: Math.random() > 0.5 ? 'rgba(0, 225, 217, 0.7)' : 'rgba(140, 82, 255, 0.7)'
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            if (mouse.x != null) {
                let dx = mouse.x - p.x;
                let dy = mouse.y - p.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    let force = (150 - distance) / 150;
                    p.x -= dx * force * 0.03;
                    p.y -= dy * force * 0.03;
                }
            }

            // Draw Dots
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            // Draw Connections
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.lineWidth = 0.5;
                    let opacity = 0.3 * (1 - dist / 150);
                    ctx.strokeStyle = j % 2 === 0 ? `rgba(0, 225, 217, ${opacity})` : `rgba(140, 82, 255, ${opacity})`;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', init);
    init();
    draw();
}

// Navbar Scroll Effect
const header = document.querySelector('header');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.querySelectorAll('.nav-links a');

if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('bg-white', 'shadow-xl', 'py-3');
            header.classList.remove('bg-transparent', 'py-4');
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.remove('text-white');
                mobileMenuBtn.classList.add('text-gray-900');
            }
            navLinks.forEach(link => {
                if (!link.classList.contains('text-[#00E1D9]')) {
                    link.classList.remove('text-white');
                    link.classList.add('text-gray-900');
                }
            });
        } else {
            header.classList.add('bg-transparent', 'py-4');
            header.classList.remove('bg-white', 'shadow-xl', 'py-3');
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.add('text-white');
                mobileMenuBtn.classList.remove('text-gray-900');
            }
            navLinks.forEach(link => {
                if (!link.classList.contains('text-[#00E1D9]')) {
                    link.classList.add('text-white');
                    link.classList.remove('text-gray-900');
                }
            });
        }
    });
}

// Mobile Side Drawer Toggle
function setupMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('menu-overlay');

    if (menuBtn && mobileMenu && overlay) {
        const toggleMenu = (isOpen) => {
            if (isOpen) {
                mobileMenu.classList.remove('translate-x-full');
                overlay.classList.remove('opacity-0', 'pointer-events-none');
                overlay.classList.add('opacity-100', 'pointer-events-auto');
                // Note: body overflow is NOT set to hidden to allow page scroll as requested
            } else {
                mobileMenu.classList.add('translate-x-full');
                overlay.classList.add('opacity-0', 'pointer-events-none');
                overlay.classList.remove('opacity-100', 'pointer-events-auto');
            }
        };

        menuBtn.addEventListener('click', () => toggleMenu(true));
        if (closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));
        overlay.addEventListener('click', () => toggleMenu(false));

        // Close on link click
        const links = mobileMenu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createPlexus('plexusCanvas');
    createPlexus('heroPlexusCanvas');
    createPlexus('footerPlexusCanvas', 15000);
    setupMobileMenu();
});

