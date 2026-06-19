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
