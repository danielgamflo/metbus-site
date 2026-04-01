/**
 * noticia.js — Renderiza artículos de noticias desde noticias.json
 *
 * Uso: agregar un nuevo artículo solo requiere añadir un objeto al JSON.
 * URL de acceso: noticias/noticia.html?id=5
 *
 * Campos requeridos en el JSON:
 *   id, titulo, descripcion, imagen, fecha, fecha_display, categoria, enlace
 *
 * Campos opcionales según tipo:
 *   tipo: "basica" | "galeria" | "video"  (default: "basica")
 *   portada: "assets/..."        — imagen principal (tipo basica o video)
 *   ubicacion: "Santiago, Chile"
 *   contenido_html: "<p>...</p>" — cuerpo completo del artículo en HTML
 *   galeria: [ { src: "/assets/...", alt: "..." } ]   — para tipo galeria
 *   video_url: "https://www.youtube.com/embed/XXX"    — para tipo video
 *   video_poster: "assets/..."                         — imagen previa del video
 */

document.addEventListener("DOMContentLoaded", () => {
  // Leer id desde la URL (?id=5)
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10);

  if (!id) {
    mostrarError("No se especificó un artículo.");
    return;
  }

  fetch("../noticias.json")
    .then(res => res.json())
    .then(noticias => {
      const noticia = noticias.find(n => n.id === id);
      if (!noticia) {
        mostrarError("Artículo no encontrado.");
        return;
      }
      renderNoticia(noticia);
    })
    .catch(() => mostrarError("Error al cargar el artículo."));
});

function renderNoticia(n) {
  const tipo = n.tipo || "basica";

  // Actualizar <title>, meta description y og: dinámicamente
  document.title = `${n.titulo} — Metbus`;
  const setMeta = (sel, attr, val) => { const el = document.querySelector(sel); if (el) el.setAttribute(attr, val); };
  const pageUrl = `https://www.metbus.cl/noticias/noticia.html?id=${n.id}`;
  const imgUrl  = n.portada ? `https://www.metbus.cl/${n.portada}` : 'https://www.metbus.cl/assets/kpi/kpi-poster.webp';
  setMeta('meta[name="description"]',        'content', n.descripcion);
  setMeta('meta[property="og:title"]',       'content', `${n.titulo} — Metbus`);
  setMeta('meta[property="og:description"]', 'content', n.descripcion);
  setMeta('meta[property="og:url"]',         'content', pageUrl);
  setMeta('meta[property="og:image"]',       'content', imgUrl);
  setMeta('meta[name="twitter:card"]',       'content', 'summary_large_image');
  // Inyectar og: tags si no existen aún
  if (!document.querySelector('meta[property="og:title"]')) {
    ['og:title','og:description','og:url','og:image'].forEach(p => {
      const m = document.createElement('meta'); m.setAttribute('property', p);
      document.head.appendChild(m);
    });
    setMeta('meta[property="og:title"]',       'content', `${n.titulo} — Metbus`);
    setMeta('meta[property="og:description"]', 'content', n.descripcion);
    setMeta('meta[property="og:url"]',         'content', pageUrl);
    setMeta('meta[property="og:image"]',       'content', imgUrl);
  }

  // Cabecera: etiqueta, título, fecha, ubicación
  const meta = document.getElementById("noticia-meta");
  if (meta) {
    meta.innerHTML = `
      ${n.categoria ? `<p class="etiqueta">${n.categoria}</p>` : ""}
      <h1 class="titulo">${n.titulo}</h1>
      <div class="meta">
        ${n.fecha_display ? `<span class="fecha">${n.fecha_display}</span>` : ""}
        ${n.ubicacion ? `<span class="ubicacion">${n.ubicacion}</span>` : ""}
      </div>
    `;
  }

  // Renderizar según tipo
  if (tipo === "galeria") {
    renderGaleria(n);
  } else if (tipo === "video") {
    renderVideo(n);
  } else if (tipo === "lightbox") {
    renderLightbox(n);
  } else {
    renderBasica(n);
  }

  // Video disponible para cualquier tipo si tiene video_url
  if (tipo !== "video" && n.video_url) {
    renderVideoBloque(n);
  }

  // Contenido HTML
  const contenidoEl = document.getElementById("noticia-contenido");
  if (contenidoEl && n.contenido_html) {
    contenidoEl.innerHTML = n.contenido_html;
  }

  // Si tiene galería y el tipo no es lightbox, renderizar lightbox al final (debajo del contenido)
  if (tipo !== "lightbox" && Array.isArray(n.galeria) && n.galeria.length > 0) {
    renderLightbox(n, "noticia-galeria-extra");
  }
}

// ——— Tipo: básica (texto + imagen de portada) ———
function renderBasica(n) {
  const portadaEl = document.getElementById("noticia-portada");
  if (portadaEl && n.portada) {
    portadaEl.innerHTML = `
      <div class="imagen">
        <img src="../${n.portada}" alt="${n.titulo}">
      </div>
    `;
  }
}

// ——— Tipo: galería de fotos ———
function renderGaleria(n) {
  const galeriaEl = document.getElementById("noticia-galeria");
  if (!galeriaEl || !Array.isArray(n.carrusel) || n.carrusel.length === 0) return;

  const slides = n.carrusel.map(foto =>
    `<div class="galeria-slide"><img src="../${foto.src}" alt="${foto.alt || ""}"></div>`
  ).join("");

  galeriaEl.innerHTML = `
    <div class="galeria-carrusel">
      <button class="galeria-btn prev galeria-prev" aria-label="Anterior">‹</button>
      <div class="galeria-track-wrapper">
        <div class="galeria-track">${slides}</div>
      </div>
      <button class="galeria-btn next galeria-next" aria-label="Siguiente">›</button>
      <div class="galeria-hint">
        Desliza para ver más
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>
    </div>
  `;

  // Inicializar galería
  initGaleria();
}

function initGaleria() {
  const track = document.querySelector(".galeria-track");
  const prevBtn = document.querySelector(".galeria-prev");
  const nextBtn = document.querySelector(".galeria-next");
  const slides = document.querySelectorAll(".galeria-slide");
  if (!track || !slides.length) return;

  let index = 0;
  const update = () => {
    track.style.transform = `translateX(-${index * slides[0].offsetWidth}px)`;
  };

  const hint = document.querySelector(".galeria-hint");
  const hideHint = () => { if (hint) hint.classList.add("hidden"); };
  track.addEventListener("scroll", hideHint, { once: true });

  prevBtn?.addEventListener("click", () => { if (index > 0) { index--; update(); hideHint(); } });
  nextBtn?.addEventListener("click", () => { if (index < slides.length - 1) { index++; update(); hideHint(); } });
  window.addEventListener("resize", update);
  update();
}

// ——— Tipo: video (preview + lightbox YouTube) ———
function renderVideo(n) {
  const portadaEl = document.getElementById("noticia-portada");
  if (portadaEl && n.portada) {
    portadaEl.innerHTML = `
      <div class="imagen">
        <img src="../${n.portada}" alt="${n.titulo}">
      </div>
    `;
  }

  renderVideoBloque(n);
}

// ——— Bloque de video reutilizable (se puede añadir a cualquier tipo) ———
function renderVideoBloque(n) {
  const videoEl = document.getElementById("noticia-video");
  if (!videoEl || !n.video_url) return;

  const poster = n.video_poster ? `../${n.video_poster}` : "";

  videoEl.innerHTML = `
    <div class="video-preview" data-video="${n.video_url}">
      ${poster ? `<img src="${poster}" alt="Video ${n.titulo}">` : ""}
      <div class="play-button">▶</div>
    </div>
    <div class="video-modal" id="videoModal">
      <div class="video-modal-content">
        <span class="video-close">&times;</span>
        <div class="video-container"></div>
      </div>
    </div>
  `;

  initVideoLightbox();
}

function initVideoLightbox() {
  const preview = document.querySelector(".video-preview");
  const modal = document.getElementById("videoModal");
  const closeBtn = document.querySelector(".video-close");
  const container = document.querySelector(".video-container");
  if (!preview || !modal) return;

  preview.addEventListener("click", () => {
    container.innerHTML = `
      <iframe src="${preview.dataset.video}?autoplay=1&rel=0"
        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    `;
    modal.classList.add("active");
  });

  const close = () => { modal.classList.remove("active"); container.innerHTML = ""; };
  closeBtn?.addEventListener("click", close);
  modal.addEventListener("click", e => { if (e.target === modal) close(); });
}

// ——— Tipo: lightbox (grid de fotos + modal) ———
function renderLightbox(n, containerId = "noticia-galeria") {
  const galeriaEl = document.getElementById(containerId);
  if (!galeriaEl || !Array.isArray(n.galeria) || n.galeria.length === 0) return;

  const thumbs = n.galeria.map((foto, i) =>
    `<div class="foto-lightbox-thumb" data-index="${i}">
      <img src="../${foto.src}" alt="${foto.alt || ""}">
    </div>`
  ).join("");

  galeriaEl.innerHTML = `
    <div class="container">
      <div class="foto-lightbox-grid">${thumbs}</div>
    </div>
    <div class="foto-lightbox-overlay" id="fotoLightbox">
      <button class="foto-lightbox-close" aria-label="Cerrar">&times;</button>
      <button class="foto-lightbox-btn prev" aria-label="Anterior">‹</button>
      <img src="" alt="" id="fotoLightboxImg">
      <button class="foto-lightbox-btn next" aria-label="Siguiente">›</button>
      <span class="foto-lightbox-counter" id="fotoLightboxCounter"></span>
    </div>
  `;

  const fotos = n.galeria;
  let current = 0;

  const overlay  = document.getElementById("fotoLightbox");
  const img      = document.getElementById("fotoLightboxImg");
  const counter  = document.getElementById("fotoLightboxCounter");
  const btnClose = overlay.querySelector(".foto-lightbox-close");
  const btnPrev  = overlay.querySelector(".foto-lightbox-btn.prev");
  const btnNext  = overlay.querySelector(".foto-lightbox-btn.next");

  const show = (i) => {
    current = (i + fotos.length) % fotos.length;
    img.src = "../" + fotos[current].src;
    img.alt = fotos[current].alt || "";
    counter.textContent = `${current + 1} / ${fotos.length}`;
    btnPrev.style.display = fotos.length > 1 ? "" : "none";
    btnNext.style.display = fotos.length > 1 ? "" : "none";
    overlay.classList.add("active");
  };

  const close = () => { overlay.classList.remove("active"); img.src = ""; };

  document.querySelectorAll(".foto-lightbox-thumb").forEach(thumb => {
    thumb.addEventListener("click", () => show(parseInt(thumb.dataset.index)));
  });

  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", () => show(current - 1));
  btnNext.addEventListener("click", () => show(current + 1));
  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
  document.addEventListener("keydown", e => {
    if (!overlay.classList.contains("active")) return;
    if (e.key === "ArrowLeft")  show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
    if (e.key === "Escape")     close();
  });
}

// ——— Error ———
function mostrarError(msg) {
  const main = document.getElementById("noticia-main");
  if (main) {
    main.innerHTML = `
      <div class="container" style="padding:4rem 1rem; text-align:center;">
        <h2 style="color:var(--muted)">${msg}</h2>
        <a class="btn" href="../noticias.html" style="margin-top:1rem">Ver todas las noticias</a>
      </div>
    `;
  }
}
