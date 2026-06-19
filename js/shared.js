const scrollBar = document.querySelector("#scroll-bar");
const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = themeToggle ? themeToggle.querySelector("i") : null;

function readSavedTheme() {
    try {
        return localStorage.getItem("portfolio-theme");
    } catch {
        return null;
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem("portfolio-theme", theme);
    } catch {
        return;
    }
}

function getInitialTheme() {
    const savedTheme = readSavedTheme();

    if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
    root.dataset.theme = theme;

    if (!themeToggle || !themeIcon) {
        return;
    }

    const isDark = theme === "dark";

    themeToggle.setAttribute("aria-label", isDark ? "Passer au mode clair" : "Passer au mode sombre");
    themeToggle.setAttribute("title", isDark ? "Passer au mode clair" : "Passer au mode sombre");
    themeIcon.classList.toggle("fa-moon", !isDark);
    themeIcon.classList.toggle("fa-sun", isDark);
}

applyTheme(getInitialTheme());

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";

        saveTheme(nextTheme);
        applyTheme(nextTheme);
    });
}

function updateScrollBar() {
    const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = pageHeight > 0 ? (window.scrollY / pageHeight) * 100 : 0;

    scrollBar.style.width = `${scrollProgress}%`;
}

window.addEventListener("scroll", updateScrollBar);
updateScrollBar();

const navBurger = document.querySelector(".nav-burger");
const navLinks = document.querySelector(".nav-links");

if (navBurger && navLinks) {
    navBurger.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("is-open");

        navBurger.classList.toggle("is-open", isOpen);
        navBurger.setAttribute("aria-expanded", String(isOpen));
    });
}

const revealElements = document.querySelectorAll(
    ".hero-content, .hero-visual, .about-text, .about-cards, .featured-card, .page-hero .container, .project-card, .skill-category, .skill-card, .cv-side, .cv-block, .contact-card"
);

function initRevealAnimations() {
    if (!revealElements.length) {
        return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => element.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14 });

    revealElements.forEach((element, index) => {
        element.classList.add("reveal");
        element.style.transitionDelay = `${(index % 3) * 80}ms`;
        observer.observe(element);
    });
}

initRevealAnimations();

const canvas = document.querySelector("#space-canvas");

if (canvas) {
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let particles = [];

    function particleCount() {
        const area = window.innerWidth * window.innerHeight;
        return Math.min(180, Math.max(85, Math.round(area / 7800)));
    }

    function createParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: 0.6 + Math.random() * 1.8,
            speedX: 0.025 + Math.random() * 0.12,
            speedY: 0.01 + Math.random() * 0.06,
            depth: 0.25 + Math.random() * 0.75,
            opacity: 0.22 + Math.random() * 0.58,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.008 + Math.random() * 0.018,
            driftX: 0,
            driftY: 0
        };
    }

    function resizeCanvas() {
        pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * pixelRatio);
        canvas.height = Math.floor(height * pixelRatio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        particles = Array.from({ length: particleCount() }, createParticle);
    }

    function particleColor(opacity) {
        const darkTheme = root.dataset.theme === "dark";

        return darkTheme
            ? `rgba(247, 244, 238, ${opacity})`
            : `rgba(34, 34, 34, ${opacity * 0.72})`;
    }

    function glowColor(opacity) {
        const darkTheme = root.dataset.theme === "dark";

        return darkTheme
            ? `rgba(209, 168, 160, ${opacity})`
            : `rgba(156, 147, 132, ${opacity * 0.7})`;
    }

    function drawParticle(particle) {
        const twinkle = 0.72 + Math.sin(particle.twinkle) * 0.28;
        const opacity = particle.opacity * twinkle;
        const radius = particle.radius * (0.7 + particle.depth * 0.6);

        if (radius > 1.2) {
            const gradient = ctx.createRadialGradient(
                particle.x,
                particle.y,
                0,
                particle.x,
                particle.y,
                radius * 4
            );

            gradient.addColorStop(0, glowColor(opacity * 0.32));
            gradient.addColorStop(1, glowColor(0));
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, radius * 4, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = particleColor(opacity);
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    function moveParticle(particle) {
        const centerX = width / 2;
        const centerY = height / 2;
        const mouseX = width ? (mouse.x - centerX) / centerX : 0;
        const mouseY = height ? (mouse.y - centerY) / centerY : 0;
        const parallax = (1 - particle.depth) * 0.26;

        particle.driftX += (mouseX * parallax - particle.driftX) * 0.035;
        particle.driftY += (mouseY * parallax - particle.driftY) * 0.035;
        particle.x += particle.speedX + particle.driftX;
        particle.y += particle.speedY + particle.driftY;
        particle.twinkle += particle.twinkleSpeed;

        if (particle.x > width + 8) {
            particle.x = -8;
            particle.y = Math.random() * height;
        }

        if (particle.y > height + 8) {
            particle.y = -8;
            particle.x = Math.random() * width;
        }

        if (particle.x < -8) {
            particle.x = width + 8;
        }

        if (particle.y < -8) {
            particle.y = height + 8;
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((particle) => {
            if (!reduceMotion) {
                moveParticle(particle);
            }

            drawParticle(particle);
        });

        if (!reduceMotion) {
            requestAnimationFrame(drawParticles);
        }
    }

    document.addEventListener("mousemove", (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    window.addEventListener("resize", resizeCanvas);

    resizeCanvas();
    drawParticles();
}
