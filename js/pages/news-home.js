document.addEventListener("DOMContentLoaded", function () {
  const track = document.getElementById("newsTrack");
  const noticiasGrid = document.getElementById("noticiasGrid");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");

  let currentSlide = 0;

  const isInSubfolder = window.location.pathname.includes("/noticias/");
  const jsonPath = isInSubfolder ? "../noticias.json" : "noticias.json";
  const basePath = isInSubfolder ? "../" : "";

  fetch(jsonPath)
    .then((res) => res.json())
    .then((noticias) => {
      if (!Array.isArray(noticias)) return;

      const isMobile = window.innerWidth <= 768;

      // ============
      // CARRUSEL DE INICIO (máx 9 noticias)
      // ============
      if (track) {
        const noticiasCarrusel = noticias.slice(0, 9); // solo las 9 primeras

        if (isMobile) {
          noticiasCarrusel.forEach((noticia) => {
            const card = document.createElement("article");
            card.classList.add("card");

            const imgPath = `${basePath}${noticia.imagen}`;
            const enlaceFinal = noticia.enlace ? `${basePath}${noticia.enlace}` : "";

            card.innerHTML = `
              <div class="thumb" style="background-image:url('${imgPath}'); background-size:cover; background-position:center; aspect-ratio:16/9;"></div>
              <div class="body">
                <h4>${noticia.titulo}</h4>
                <p class="muted">${noticia.descripcion}</p>
                ${enlaceFinal ? `<a class="btn" href="${enlaceFinal}">Ver más</a>` : ''}
              </div>
            `;

            track.appendChild(card);
          });

          if (prevBtn && nextBtn) {
            prevBtn.classList.add("hidden-on-mobile");
            nextBtn.classList.add("hidden-on-mobile");
          }

          track.style.gap = "1rem";
        } else {
          const grupos = [];
          for (let i = 0; i < noticiasCarrusel.length; i += 3) {
            grupos.push(noticiasCarrusel.slice(i, i + 3));
          }

          grupos.forEach((grupo) => {
            const slide = document.createElement("div");
            slide.classList.add("news-slide");

            grupo.forEach((noticia) => {
              const card = document.createElement("article");
              card.classList.add("card");

              const imgPath = `${basePath}${noticia.imagen}`;
              const enlaceFinal = noticia.enlace ? `${basePath}${noticia.enlace}` : "";

              card.innerHTML = `
                <div class="thumb" style="background-image:url('${imgPath}'); background-size:cover; background-position:center; aspect-ratio:16/9;"></div>
                <div class="body">
                  <h4>${noticia.titulo}</h4>
                  <p class="muted">${noticia.descripcion}</p>
                  ${enlaceFinal ? `<a class="btn" href="${enlaceFinal}">Ver más</a>` : ''}
                </div>
              `;

              slide.appendChild(card);
            });

            track.appendChild(slide);
          });

          const totalSlides = grupos.length;

          function updateCarousel() {
            const offset = -100 * currentSlide;
            track.style.transform = `translateX(${offset}%)`;
            prevBtn.disabled = currentSlide === 0;
            nextBtn.disabled = currentSlide === totalSlides - 1;
          }

          prevBtn?.addEventListener("click", () => {
            if (currentSlide > 0) {
              currentSlide--;
              updateCarousel();
            }
          });

          nextBtn?.addEventListener("click", () => {
            if (currentSlide < totalSlides - 1) {
              currentSlide++;
              updateCarousel();
            }
          });

          updateCarousel();
        }
      }

      // ============
      // SECCIÓN noticias.html (mostrar TODAS las noticias)
      // ============
      if (noticiasGrid) {
        noticias.forEach((noticia) => {
          const card = document.createElement("article");
          card.classList.add("card");

          const imgPath = `${basePath}${noticia.imagen}`;
          const enlaceFinal = noticia.enlace ? `${basePath}${noticia.enlace}` : "";

          card.innerHTML = `
            <div class="thumb" style="background-image:url('${imgPath}'); background-size:cover; background-position:center; aspect-ratio:16/9;"></div>
            <div class="body">
              <h4>${noticia.titulo}</h4>
              <p class="muted">${noticia.descripcion}</p>
              ${enlaceFinal ? `<a class="btn" href="${enlaceFinal}">Ver más</a>` : ''}
            </div>
          `;

          noticiasGrid.appendChild(card);
        });
      }
    })
    .catch((error) => {
      console.error("Error cargando noticias.json", error);
    });
});