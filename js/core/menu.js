// Menú Mobile — overlay desde arriba

(function () {
  const btn  = document.querySelector('.hamburger-btn');
  const menu = document.querySelector('.mobile-menu');
  if (!btn || !menu) return;

  // Detectar si estamos en subcarpeta /noticias/
  const base = window.location.pathname.includes('/noticias/') ? '../' : '';

  // Inyectar estructura del menú
  menu.innerHTML = `
    <div class="mmo-inner">
      <div class="mmo-top">
        <button class="mmo-close" aria-label="Cerrar menú">
          <span>Cerrar</span>
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="2" y1="2" x2="20" y2="20" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <line x1="20" y1="2" x2="2" y2="20" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <nav class="mmo-nav" aria-label="Menú móvil">
        <ul>
          <li><a href="${base}index.html">Home</a></li>
          <li><a href="${base}recorridos.html">Recorridos</a></li>
          <li><a href="${base}quienes-somos.html">Quienes Somos</a></li>
          <li><a href="${base}noticias.html">Noticias</a></li>
          <li><a href="${base}sostenibilidad.html">Sostenibilidad</a></li>
          <li><a href="${base}mesa-de-ayuda.html">Mesa de Ayuda</a></li>
        </ul>
      </nav>

      <div class="mmo-search">
        <div class="mmo-search-wrap">
          <svg class="mmo-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input class="mmo-search-input" type="search" placeholder="Buscar en el sitio…" autocomplete="off" spellcheck="false">
        </div>
        <div class="mmo-search-results" hidden></div>
      </div>

      <div class="mmo-contact">
        <span class="mmo-contact-label">Contacto</span>
        <span>Moneda 1640, Santiago Chile</span>
        <span>(+56) 2 2817 7904</span>
        <a href="mailto:atencion.clientes@metbus.cl">atencion.clientes@metbus.cl</a>
      </div>

      <div class="mmo-logo">
        <img src="${base}assets/logo/metbuslogo.svg" alt="Metbus" width="120">
      </div>
    </div>
  `;

  const closeBtn    = menu.querySelector('.mmo-close');
  const searchInput = menu.querySelector('.mmo-search-input');
  const resultsBox  = menu.querySelector('.mmo-search-results');

  // Páginas estáticas del sitio
  const staticPages = [
    { titulo: 'Home',          descripcion: 'Página principal de Metbus',           enlace: `${base}index.html` },
    { titulo: 'Recorridos',    descripcion: 'Consulta las rutas y recorridos',       enlace: `${base}recorridos.html` },
    { titulo: 'Quiénes Somos', descripcion: 'Historia y misión de Metbus',           enlace: `${base}quienes-somos.html` },
    { titulo: 'Noticias',      descripcion: 'Últimas novedades de Metbus',           enlace: `${base}noticias.html` },
    { titulo: 'Sostenibilidad',descripcion: 'Compromiso ambiental y social',         enlace: `${base}sostenibilidad.html` },
    { titulo: 'Mesa de Ayuda', descripcion: 'Soporte y atención al cliente',         enlace: `${base}mesa-de-ayuda.html` },
  ];

  let newsData = null;

  // Cargar noticias una sola vez al abrir
  function loadNewsData() {
    if (newsData !== null) return Promise.resolve();
    return fetch(`${base}noticias.json`)
      .then(r => r.json())
      .then(data => { newsData = data; })
      .catch(() => { newsData = []; });
  }

  function renderResults(query) {
    const q = query.trim().toLowerCase();
    if (q.length < 2) { resultsBox.hidden = true; resultsBox.innerHTML = ''; return; }

    const all = [
      ...staticPages.map(p => ({ titulo: p.titulo, descripcion: p.descripcion, enlace: p.enlace })),
      ...(newsData || []).map(n => ({ titulo: n.titulo, descripcion: n.descripcion, enlace: `${base}${n.enlace}` })),
    ];

    const matches = all
      .filter(item => item.titulo.toLowerCase().includes(q) || item.descripcion.toLowerCase().includes(q))
      .slice(0, 7);

    if (!matches.length) {
      resultsBox.innerHTML = `<div class="mmo-no-results">Sin resultados para "${query}"</div>`;
    } else {
      resultsBox.innerHTML = matches.map(item => `
        <a class="mmo-result-item" href="${item.enlace}">
          <span class="mmo-result-title">${item.titulo}</span>
          <span class="mmo-result-desc">${item.descripcion}</span>
        </a>
      `).join('');
    }
    resultsBox.hidden = false;
  }

  searchInput.addEventListener('input', () => renderResults(searchInput.value));

  // Open / Close
  const openMenu = () => {
    menu.classList.add('active');
    btn.classList.add('active');
    menu.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    loadNewsData();
  };

  const closeMenu = () => {
    menu.classList.remove('active');
    btn.classList.remove('active');
    menu.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    // Limpiar búsqueda al cerrar
    searchInput.value = '';
    resultsBox.hidden = true;
    resultsBox.innerHTML = '';
  };

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    menu.classList.contains('active') ? closeMenu() : openMenu();
  });

  closeBtn.addEventListener('click', (e) => { e.preventDefault(); closeMenu(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
})();

/* ===========================
   Header background on scroll
=========================== */
const header = document.getElementById('siteHeader');
if (header) {
  const onScroll = () => {
    (window.scrollY > 10)
      ? header.classList.add('scrolled')
      : header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ===========================
   Slider de video con cross-fade sin “flash”
   Robusto para que SIEMPRE reproduzca el slide activo
=========================== */
(function () {
  const slider = document.getElementById('heroSlider');
  if (!slider) return; // ← ESTA LÍNEA SALVA TODO
  const slides = Array.from(slider.querySelectorAll('.slide'));
  const intervalMs = 6500;       // tiempo por slide
  const SEEK_F     = 0.06;       // adelanto para evitar mostrar frame 0
  const XFADE      = 350;        // ms de solapamiento en el crossfade
  let current = slides.findIndex(slide => slide.classList.contains('active'));
if (current === -1) current = 0;
  let timer;

  function whenReady(video, cb) {
    if (!video) return;
    if (video.readyState >= 2) cb();
    else video.addEventListener('loadeddata', cb, { once: true });
  }

  function playSafe(video) {
    if (!video) return;
    video.muted = true;
    video.setAttribute('muted','');  // iOS/Safari
    video.playsInline = true;
    video.autoplay = true;

    const tryPlay = () => {
      const p = video.play();
      if (p && typeof p.then === 'function') {
        p.catch(() => {
          setTimeout(() => { video.play().catch(()=>{}); }, 120);
        });
      }
    };
    tryPlay();
    if (video.readyState < 2) {
      video.addEventListener('canplay', tryPlay, { once:true });
      video.addEventListener('loadeddata', tryPlay, { once:true });
      video.addEventListener('canplaythrough', tryPlay, { once:true });
    }
  }

  function loadVideo(video) {
    if (!video || video.dataset.loaded) return;
    const mp4  = video.dataset.srcMp4;

    if (mp4) {
      const s = document.createElement('source');
      s.src = mp4; s.type = 'video/mp4';
      video.appendChild(s);
    }

    video.muted = true;
    video.setAttribute('muted','');
    video.playsInline = true;
    video.autoplay = true;
    video.dataset.loaded = '1';

    const slide = video.closest('.slide');
    slide?.classList.add('is-loading');
    video.addEventListener('loadeddata', () => { slide?.classList.remove('is-loading'); }, { once: true });
    video.addEventListener('playing', () => { video.removeAttribute('poster'); }, { once: true });

    video.load();
  }

  function cueVideo(video) {
    if (!video) return;
    whenReady(video, () => {
      try { video.currentTime = SEEK_F; } catch (_) {}
      video.pause();
    });
  }

  function prime() {
    const v0 = slides[0]?.querySelector('video');
    if (v0) { loadVideo(v0); cueVideo(v0); }
    const v1 = slides[1]?.querySelector('video');
    if (v1) { loadVideo(v1); cueVideo(v1); }
  }

  function startFirst() {
    const v0 = slides[0]?.querySelector('video');
    if (!v0) return;
    loadVideo(v0);
    cueVideo(v0);
    playSafe(v0);
  }

  /* Parallax */
  function resetParallaxOnAll() {
    slides.forEach(s => {
      const v = s.querySelector('video');
      if (v) v.style.transform = 'translateY(0) scale(1.05)';
    });
  }
  function parallaxTick() {
    const active = slides[current];
    const vid = active?.querySelector('video');
    if (!vid) return;
    const rect = slider.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const progress = Math.max(0, Math.min(1, rect.top / vh));
    const translate = progress * 20;
    vid.style.transform = `translateY(${translate}px) scale(1.05)`;
  }

  function go(n) {
    if (n === current) return;

    const prevIdx   = current;
    const prevSlide = slides[prevIdx];
    const nextSlide = slides[n];
    const prevVid   = prevSlide?.querySelector('video');
    const nextVid   = nextSlide?.querySelector('video');

    loadVideo(nextVid);
    cueVideo(nextVid);

    prevSlide?.classList.add('leaving');
    prevSlide?.classList.remove('active');

    nextSlide?.classList.add('active');
    nextSlide.offsetHeight; // 👈 fuerza reflow
    playSafe(nextVid);
    whenReady(nextVid, () => playSafe(nextVid));

    setTimeout(() => {
      if (prevVid) {
        prevVid.pause();
        try { prevVid.currentTime = 0; } catch (_) {}
      }
      prevSlide?.classList.remove('leaving');
      playSafe(nextVid);
    }, XFADE + 40);

    const afterIdx = (n + 1) % slides.length;
    const afterVid = slides[afterIdx]?.querySelector('video');
    if (afterVid) { loadVideo(afterVid); cueVideo(afterVid); }

    current = n;
    resetParallaxOnAll();
    parallaxTick();
  }

  function next(){ go((current + 1) % slides.length); }
  function start(){ stop(); timer = setInterval(next, intervalMs); }
  function stop(){ if (timer) clearInterval(timer); }

  document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); });

  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const applyPref = () => { media.matches ? stop() : start(); };
  media.addEventListener?.('change', applyPref);

  prime();
  startFirst();
  if (!media.matches) start();

  if (!media.matches) {
    window.addEventListener('scroll', parallaxTick, { passive: true });
    parallaxTick();
  }
})();

/* ===========================
   KPIs: lazy background video + contadores + reveal en cascada
=========================== */
(function(){
  const bgVideo = document.getElementById('kpiBgVideo');
  // Lazy-load del video de fondo
  if (bgVideo) {
    const src = bgVideo.dataset.srcMp4;
    if ('IntersectionObserver' in window && src) {
      const vObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const s = document.createElement('source');
            s.src = src; s.type = 'video/mp4';
            bgVideo.appendChild(s);
            bgVideo.load();
            bgVideo.play().catch(()=>{});
            obs.unobserve(e.target);
          }
        });
      }, { rootMargin:'150px 0px' });
      vObs.observe(bgVideo);
    } else if (src) {
      const s = document.createElement('source');
      s.src = src; s.type = 'video/mp4';
      bgVideo.appendChild(s);
      bgVideo.load();
      bgVideo.play().catch(()=>{});
    }
  }

  // Contadores
  const counters = Array.from(document.querySelectorAll('.count'));
  let counted = false;

  function animateCount(el, to, { duration=1400, prefix='', suffix='' } = {}){
    const start = performance.now();
    const from = 0;
    const isInt = Number.isInteger(to);

    function frame(now){
      const t = Math.min(1, (now - start) / duration);
      // easing out-cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const val = from + (to - from) * eased;
      el.textContent = `${prefix}${isInt ? Math.round(val) : val.toFixed(1)}${suffix}`;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // Reveal en cascada + disparo de contadores al entrar en viewport
  const kpiCards = Array.from(document.querySelectorAll('.kpi.reveal'));
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger para reveal
          kpiCards.forEach((card, i) => {
            setTimeout(() => card.classList.add('in'), i * 160);
          });

          if (!counted) {
            counters.forEach((el, i) => {
              const to = Number(el.dataset.to || '0');
              const prefix = el.dataset.prefix || '';
              const suffix = el.dataset.suffix || '';
              setTimeout(() => {
                animateCount(el, to, { duration: 1400 + i*150, prefix, suffix });
              }, i * 120);
            });
            counted = true;
          }
          observer.disconnect();
        }
      });
    }, { threshold: 0.25 });
    if (kpiCards[0]) obs.observe(kpiCards[0]);
  } else {
    // Fallback sin IO
    kpiCards.forEach((c,i)=> setTimeout(()=> c.classList.add('in'), i*160));
    if (!counted) {
      counters.forEach((el, i) => {
        const to = Number(el.dataset.to || '0');
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        setTimeout(() => {
          animateCount(el, to, { duration: 1400 + i*150, prefix, suffix });
        }, i * 120);
      });
      counted = true;
    }
  }
})();

/* ===========================
   Sistema de noticias dinámico
=========================== */
function loadNews() {
  // Datos de noticias directamente en JavaScript (temporal)
  const news = [
    {
      "id": 1,
      "title": "Certificación ISO 39001",
      "description": "Implementamos mejoras continuas para la seguridad vial.",
      "image": "assets/images/noticias/news-1.webp"
    },
    {
      "id": 2,
      "title": "Nueva Flota de Buses Eléctricos", 
      "description": "Incorporamos 50 nuevos buses eléctricos para mejorar el servicio.",
      "image": "assets/images/noticias/news-2.webp"
    },
    {
      "id": 3,
      "title": "Ampliación de Rutas Sustentables",
      "description": "Nuevas rutas con tecnología limpia para Santiago.",
      "image": "assets/images/noticias/news-3.webp"
    }
  ];
  
  // Encontrar el contenedor
  const container = document.getElementById('newsContainer');
  if (!container) return;
  
  // Generar el HTML
  const newsHTML = news.map(item => `
    <article class="card">
      <div class="thumb">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
      </div>
      <div class="body">
        <h4>${item.title}</h4>
        <p class="muted">${item.description}</p>
      </div>
    </article>
  `).join('');
  
  // Colocar las noticias
  container.innerHTML = newsHTML;
}

loadNews();
