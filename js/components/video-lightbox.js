document.addEventListener("DOMContentLoaded", () => {
  const preview = document.querySelector(".video-preview");
  const modal = document.getElementById("videoModal");
  const closeBtn = document.querySelector(".video-close");
  const container = document.querySelector(".video-container");

  if (!preview) return;

  preview.addEventListener("click", () => {
    const videoSrc = preview.dataset.video;

    container.innerHTML = `
      <iframe 
        src="${videoSrc}?autoplay=1&rel=0" 
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen>
      </iframe>
    `;

    modal.classList.add("active");
  });

  function closeModal() {
    modal.classList.remove("active");
    container.innerHTML = ""; // detiene el video
  }

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
});