document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("noticiasGrid");
  if (!grid) return;

  const ITEMS_POR_PAGINA = 12;
  let paginaActual = 1;
  let todasLasNoticias = [];

  fetch("noticias.json")
    .then(res => res.json())
    .then(noticias => {
      if (!Array.isArray(noticias)) return;

      // Ordenar por fecha descendente (más reciente primero)
      todasLasNoticias = noticias.slice().sort((a, b) => {
        const fa = a.fecha ? new Date(a.fecha) : new Date(0);
        const fb = b.fecha ? new Date(b.fecha) : new Date(0);
        return fb - fa;
      });

      renderPagina(paginaActual);

      // Buscador
      const input = document.getElementById("buscadorNoticias");
      if (input) {
        input.addEventListener("input", () => {
          const query = input.value.trim().toLowerCase();
          if (query === "") {
            todasLasNoticias = noticias.slice().sort((a, b) => {
              const fa = a.fecha ? new Date(a.fecha) : new Date(0);
              const fb = b.fecha ? new Date(b.fecha) : new Date(0);
              return fb - fa;
            });
          } else {
            todasLasNoticias = noticias.filter(n => {
              return (n.titulo || "").toLowerCase().includes(query) ||
                     (n.descripcion || "").toLowerCase().includes(query) ||
                     (n.categoria || "").toLowerCase().includes(query);
            });
          }
          paginaActual = 1;
          renderPagina(paginaActual);
          document.getElementById("noResultados").style.display =
            todasLasNoticias.length === 0 ? "block" : "none";
        });
      }
    })
    .catch(err => console.error("Error cargando noticias.json", err));

  function renderPagina(pagina) {
    const inicio = (pagina - 1) * ITEMS_POR_PAGINA;
    const fin = inicio + ITEMS_POR_PAGINA;
    const noticiasPagina = todasLasNoticias.slice(inicio, fin);

    // Limpiar grid
    grid.innerHTML = "";

    noticiasPagina.forEach(noticia => {
      const card = document.createElement("article");
      card.classList.add("card");

      const imgPath = noticia.imagen || "assets/images/noticias/news-1.webp";
      const enlace = noticia.enlace || "";

      card.innerHTML = `
        <div class="thumb" style="background-image:url('${imgPath}'); background-size:cover; background-position:center; aspect-ratio:16/9;"></div>
        <div class="body">
          ${noticia.categoria ? `<span class="noticia-tag">${noticia.categoria}</span>` : ""}
          <h4>${noticia.titulo}</h4>
          <p class="muted">${noticia.descripcion}</p>
          ${noticia.fecha_display ? `<span class="noticia-fecha">${noticia.fecha_display}</span>` : ""}
          ${enlace ? `<a class="btn" href="${enlace}">Ver más</a>` : ""}
        </div>
      `;

      grid.appendChild(card);
    });

    renderPaginacion();

    // Scroll suave al inicio del grid al cambiar página
    if (pagina > 1) {
      grid.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function renderPaginacion() {
    const totalPaginas = Math.ceil(todasLasNoticias.length / ITEMS_POR_PAGINA);

    // Remover paginación anterior si existe
    const paginacionAnterior = document.getElementById("noticias-paginacion");
    if (paginacionAnterior) paginacionAnterior.remove();

    if (totalPaginas <= 1) return;

    const nav = document.createElement("nav");
    nav.id = "noticias-paginacion";
    nav.className = "paginacion";
    nav.setAttribute("aria-label", "Paginación de noticias");

    // Botón anterior
    const btnPrev = document.createElement("button");
    btnPrev.className = "paginacion-btn";
    btnPrev.textContent = "‹";
    btnPrev.setAttribute("aria-label", "Página anterior");
    btnPrev.disabled = paginaActual === 1;
    btnPrev.addEventListener("click", () => {
      if (paginaActual > 1) { paginaActual--; renderPagina(paginaActual); }
    });

    nav.appendChild(btnPrev);

    // Números de página
    for (let i = 1; i <= totalPaginas; i++) {
      const btn = document.createElement("button");
      btn.className = "paginacion-btn" + (i === paginaActual ? " active" : "");
      btn.textContent = i;
      btn.setAttribute("aria-label", `Página ${i}`);
      if (i === paginaActual) btn.setAttribute("aria-current", "page");
      btn.addEventListener("click", () => { paginaActual = i; renderPagina(i); });
      nav.appendChild(btn);
    }

    // Botón siguiente
    const btnNext = document.createElement("button");
    btnNext.className = "paginacion-btn";
    btnNext.textContent = "›";
    btnNext.setAttribute("aria-label", "Página siguiente");
    btnNext.disabled = paginaActual === totalPaginas;
    btnNext.addEventListener("click", () => {
      if (paginaActual < totalPaginas) { paginaActual++; renderPagina(paginaActual); }
    });

    nav.appendChild(btnNext);

    // Insertar después del grid
    grid.parentNode.insertBefore(nav, grid.nextSibling);
  }
});
