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
    swapExcalidrawImages(theme);
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

    swapExcalidrawImages(
        html.classList.contains("dark") ? "dark" : "light"
    );
});

function swapExcalidrawImages(theme) {
    document.querySelectorAll("img").forEach(img => {
        if (!img.src.includes(".excalidraw.")) return;

        if (theme === "dark") {
            img.src = img.src.replace(".light.svg", ".dark.svg");
        } else {
            img.src = img.src.replace(".dark.svg", ".light.svg");
        }
    });
}
