const themeToggle = document.getElementById("themeToggle");
const navButtons = document.querySelectorAll(".nav-button");
const views = document.querySelectorAll(".view");
const portfolioContainer = document.querySelector(".portfolio");

function setTheme(isLight) {
    document.body.classList.toggle("light-theme", isLight);

    if (themeToggle) {
        themeToggle.textContent = isLight ? "🌑 Dark theme" : "☀️ Light theme";
        themeToggle.setAttribute("aria-pressed", String(isLight));
        themeToggle.setAttribute(
            "aria-label",
            isLight ? "Switch to dark theme" : "Switch to light theme"
        );
    }
}

function updatePortfolioMode() {
    const activeView = document.querySelector(".view.active");

    if (activeView && activeView.id === "cvView" && portfolioContainer) {
        portfolioContainer.classList.add("ide-mode");
    } else if (portfolioContainer) {
        portfolioContainer.classList.remove("ide-mode");
    }
}

const savedTheme = localStorage.getItem("portfolio-theme");
const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
setTheme(savedTheme ? savedTheme === "light" : prefersLight);

updatePortfolioMode();

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const isLight = !document.body.classList.contains("light-theme");
        localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
        setTheme(isLight);
    });
}

navButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const targetId = button.dataset.view;

        views.forEach((view) => {
            view.classList.toggle("active", view.id === targetId);
        });

        navButtons.forEach((navButton) => {
            const isActive = navButton === button;
            navButton.classList.toggle("active", isActive);
            navButton.setAttribute("aria-pressed", String(isActive));
        });

        updatePortfolioMode();
    });
});

const imageModal = document.getElementById("imageModal");
const modalImage = imageModal?.querySelector("img");
const modalCloseButton = imageModal?.querySelector(".modal-close");
const modalPrevButton = imageModal?.querySelector(".modal-prev");
const modalNextButton = imageModal?.querySelector(".modal-next");

let currentGalleryButtons = [];
let currentImageIndex = 0;
let lastFocusedButton = null;

function showModalImage(index) {
    if (!modalImage || currentGalleryButtons.length === 0) return;

    currentImageIndex =
        (index + currentGalleryButtons.length) % currentGalleryButtons.length;

    const image = currentGalleryButtons[currentImageIndex].querySelector("img");
    if (!image) return;

    modalImage.src = image.src;
    modalImage.alt = image.alt;

    const hasMultipleImages = currentGalleryButtons.length > 1;
    if (modalPrevButton) modalPrevButton.hidden = !hasMultipleImages;
    if (modalNextButton) modalNextButton.hidden = !hasMultipleImages;
}

function openImageModal(galleryButtons, index, clickedButton) {
    if (!imageModal) return;

    currentGalleryButtons = galleryButtons;
    lastFocusedButton = clickedButton;

    showModalImage(index);
    imageModal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    modalCloseButton?.focus();
}

function closeImageModal() {
    if (!imageModal || !modalImage) return;

    imageModal.classList.remove("is-open");
    modalImage.src = "";
    modalImage.alt = "";
    document.body.style.overflow = "";

    lastFocusedButton?.focus();
    currentGalleryButtons = [];
}

document.querySelectorAll(".project-gallery").forEach((gallery) => {
    const buttons = [...gallery.querySelectorAll(".gallery-image")];

    buttons.forEach((button, index) => {
        button.addEventListener("click", () => {
            openImageModal(buttons, index, button);
        });
    });
});

modalPrevButton?.addEventListener("click", () => {
    showModalImage(currentImageIndex - 1);
});

modalNextButton?.addEventListener("click", () => {
    showModalImage(currentImageIndex + 1);
});

modalCloseButton?.addEventListener("click", closeImageModal);

imageModal?.addEventListener("click", (event) => {
    if (event.target === imageModal) closeImageModal();
});

document.addEventListener("keydown", (event) => {
    if (!imageModal?.classList.contains("is-open")) return;

    if (event.key === "Escape") closeImageModal();
    if (event.key === "ArrowLeft") showModalImage(currentImageIndex - 1);
    if (event.key === "ArrowRight") showModalImage(currentImageIndex + 1);
});