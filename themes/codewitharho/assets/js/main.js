import "./fontawesome"
import "./lucide"

const html = document.documentElement;

function setTheme(theme) {
    if (theme === "dark") {
        html.classList.add("dark");
    } else {
        html.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
    swapThemedImages(theme);
    setGiscusTheme(theme);
}

document.addEventListener("DOMContentLoaded", () => {
    const stored = localStorage.getItem("theme");

    if (stored) {
        setTheme(stored);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
    }

    const toggle = document.getElementById("theme-toggle");

    toggle?.addEventListener("click", () => {
        const isDark = html.classList.contains("dark");
        setTheme(isDark ? "light" : "dark");
    });

    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const iconMenuOpen = document.getElementById("icon-menu-open");
    const iconMenuClose = document.getElementById("icon-menu-close");

    menuToggle?.addEventListener("click", () => {
        const isOpen = !mobileMenu.classList.contains("hidden");
        mobileMenu.classList.toggle("hidden");
        iconMenuOpen.classList.toggle("hidden");
        iconMenuClose.classList.toggle("hidden");
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
    });

    swapThemedImages(
        html.classList.contains("dark") ? "dark" : "light"
    );
});

const themedImagePattern = /\.(light|dark)\.(avif|jpg|jpeg|png|svg|webp)$/i;

function swapThemedImages(theme) {
    document.querySelectorAll("img").forEach(img => {
        if (!themedImagePattern.test(img.src)) return;

        if (theme === "dark") {
            img.src = img.src.replace(/\.light\.(avif|jpg|jpeg|png|svg|webp)$/i, ".dark.$1");
        } else {
            img.src = img.src.replace(/\.dark\.(avif|jpg|jpeg|png|svg|webp)$/i, ".light.$1");
        }
    });
}
