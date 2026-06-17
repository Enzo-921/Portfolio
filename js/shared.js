const scrollBar = document.querySelector("#scroll-bar");

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

const canvas = document.querySelector("#space-canvas");

if (canvas) {
    const ctx = canvas.getContext("2d");
    let dots = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        dots = Array.from({ length: 65 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 0.8,
            speed: Math.random() * 0.25 + 0.08
        }));
    }

    function drawDots() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        dots.forEach((dot) => {
            dot.y += dot.speed;

            if (dot.y > canvas.height) {
                dot.y = -10;
                dot.x = Math.random() * canvas.width;
            }

            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(34, 34, 34, 0.28)";
            ctx.fill();
        });

        requestAnimationFrame(drawDots);
    }

    window.addEventListener("resize", resizeCanvas);

    resizeCanvas();
    drawDots();
}