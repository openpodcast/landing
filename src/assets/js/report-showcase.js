document.addEventListener("DOMContentLoaded", function () {
  const showcase = document.getElementById("product");
  const previewButton = document.getElementById("reportPreviewButton");
  const previewImage = document.getElementById("reportPreviewImage");
  const pageButtons = Array.from(document.querySelectorAll(".report-page-btn"));
  const themeButtons = Array.from(document.querySelectorAll(".theme-btn"));
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const closeButton = document.getElementById("closeModal");

  if (
    !showcase ||
    !previewButton ||
    !previewImage ||
    !pageButtons.length ||
    !themeButtons.length ||
    !modal ||
    !modalImage ||
    !closeButton
  ) {
    return;
  }

  let activePage =
    pageButtons.find((button) => button.getAttribute("aria-pressed") === "true") ||
    pageButtons[0];
  let activeTheme =
    themeButtons.find((button) => button.getAttribute("aria-pressed") === "true") ||
    themeButtons[0];
  let lastFocusedElement = null;

  function updatePreview() {
    const theme = activeTheme.dataset.color;
    const filePrefix = theme === "orange" ? "yellow" : theme;
    const fileNumber = activePage.dataset.file;
    const alt = activePage.dataset.alt;

    previewImage.src = `/reports/thumbs/${filePrefix}-${fileNumber}.jpg`;
    previewImage.dataset.fullSrc = `/reports/${filePrefix}-${fileNumber}.jpg`;
    previewImage.alt = alt;
    previewButton.setAttribute("aria-label", activePage.dataset.expandLabel);

    pageButtons.forEach((button) => {
      const isActive = button === activePage;
      button.setAttribute("aria-pressed", String(isActive));
      button.classList.toggle("border-blue-600", isActive);
      button.classList.toggle("bg-blue-50", isActive);
      button.classList.toggle("shadow-sm", isActive);
      button.classList.toggle("border-gray-200", !isActive);
      button.classList.toggle("bg-white", !isActive);
    });

    themeButtons.forEach((button) => {
      const isActive = button === activeTheme;
      button.setAttribute("aria-pressed", String(isActive));
      button.classList.toggle("ring-2", isActive);
      button.classList.toggle("ring-gray-900", isActive);
      button.classList.toggle("ring-offset-2", isActive);
    });
  }

  pageButtons.forEach((button, index) => {
    button.addEventListener("click", function () {
      activePage = button;
      updatePreview();
    });

    button.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex = (index + direction + pageButtons.length) % pageButtons.length;
      pageButtons[nextIndex].focus();
      pageButtons[nextIndex].click();
    });
  });

  themeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      activeTheme = button;
      updatePreview();
    });
  });

  previewButton.addEventListener("click", function () {
    lastFocusedElement = document.activeElement;
    modalImage.src = previewImage.dataset.fullSrc || previewImage.src;
    modalImage.alt = previewImage.alt;
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    closeButton.focus();
  });

  closeButton.addEventListener("click", closeModal);
  modal.addEventListener("click", function (event) {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });

  function closeModal() {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  updatePreview();
});
