document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector(".galeria-track");
  const prevBtn = document.querySelector(".galeria-prev");
  const nextBtn = document.querySelector(".galeria-next");
  const slides = document.querySelectorAll(".galeria-slide");

  let index = 0;

  function updateCarousel() {
    const width = slides[0].offsetWidth;
    track.style.transform = `translateX(-${index * width}px)`;
  }

  prevBtn.addEventListener("click", () => {
    if (index > 0) {
      index--;
      updateCarousel();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (index < slides.length - 1) {
      index++;
      updateCarousel();
    }
  });

  window.addEventListener("resize", updateCarousel);

  // Inicializar en carga
  updateCarousel();
});