# CLAUDE.md — Metbus Web

Sitio web corporativo de Metbus, empresa de transporte público en Santiago de Chile.
Proyecto real en desarrollo activo. Frontend estático con Vite, sin frameworks.

---

## Stack

- **Entorno:** Vite (`npm run dev` / `npm run build`)
- **CSS:** Vanilla CSS con variables en `:root`
- **JS:** Vanilla JS modular, sin frameworks
- **Tipografía:** Google Fonts → Outfit
- **Contenido dinámico:** `noticias.json` (sin backend)
- **Servidor local alternativo:** `node server.js`
- **Optimización de imágenes:** `sharp` (devDependency)

---

## Estructura de carpetas

```
/assets/           → imágenes, íconos, media
  /images/noticias/YYYY/
    /portadas/     → imagen principal de cada noticia (máx 1920px, 300kb)
    /galeria/      → imágenes de carrusel/galería (máx 1200px, 200kb)

/_staging/         → zona de entrada para imágenes nuevas (no se sube al repo)

/components/       → HTML reutilizable
  footer.html
  historia.html

/css/
  style.css        → estilos globales
  /components/     → estilos de componentes reutilizables
    foto-lightbox.css
    video-lightbox.css
    noticia-multimedia.css
  /pages/          → estilos específicos por página (vacío aún)
  /base/           → reset, variables, tipografía (vacío aún)
  /layout/         → grid, flex, estructura (vacío aún)
  mesa-de-ayuda.css
  noticia_individual.css
  noticias.css
  quienes-somos.css
  recorridos.css
  sostenibilidad.css

/js/
  /core/           → lógica global
    header.js
    menu.js
    dark-mode.js
  /components/     → lógica reutilizable
    video-lightbox.js
    flota-modal.js
    galeria.js
  /pages/          → lógica específica por página
    hero.js
    kpis.js
    news-home.js
    news.js
    noticia.js
    noticias-grid.js
    recorridos.js

/scripts/
  imagen.js        → optimiza y mueve imágenes desde _staging/ a su carpeta final

/noticias/
  noticia.html     → template dinámico único (carga contenido por ?id=)
  noticia_01.html … noticia_04.html  → páginas estáticas antiguas (no usar como modelo)

index.html
noticias.html
quienes-somos.html
recorridos.html
sostenibilidad.html
mesa-de-ayuda.html
noticias.json
recorridos.json
vite.config.js
server.js
```

---

## Reglas de código

### NUNCA
- Romper la estructura de carpetas definida arriba
- Mezclar lógica global (`/core`) con lógica de página (`/pages`)
- Sobrescribir estilos en `style.css` sin entender el cascade existente
- Usar rutas absolutas (`/`) donde corresponden relativas (`../`)
- Crear páginas HTML individuales por noticia — el sistema es dinámico (`noticia.html?id=X`)

### SIEMPRE
- Respetar rutas relativas según el nivel de carpeta del archivo que las usa
- Mantener separación de responsabilidades entre `core / components / pages`
- Usar `body` con clase específica para aplicar estilos por página (ej. `<body class="page-noticias">`)
- Clases en kebab-case: `noticia-multimedia`, `hero-section`, etc.
- HTML semántico (`<section>`, `<article>`, `<nav>`, `<main>`, etc.)
- Indentación con espacios (consistente en todo el proyecto)

---

## Sistema de noticias

- Fuente de datos: `noticias.json`
- Un solo template dinámico: `noticias/noticia.html` — carga contenido por `?id=`
- Tres tipos de noticia: `basica` | `galeria` | `video`
- `noticia.js` carga la noticia por `id` desde `noticias.json`
- `noticias-grid.js` renderiza el listado paginado en `noticias.html`
- `news-home.js` renderiza las noticias destacadas en `index.html`
- El campo `video_url` y `video_poster` funcionan en **cualquier tipo** de noticia, no solo en `video`

### Convenciones de imágenes
- Portada: `assets/images/noticias/YYYY/portadas/nombre.jpg` → máx 1920px, 300kb
- Galería: `assets/images/noticias/YYYY/galeria/nombre.jpg` → máx 1200px, 200kb
- ⚠️ Nunca usar espacios ni tildes en nombres de archivo
- Fotos verticales → solo para galería, nunca para portada o poster

### Flujo para agregar una noticia nueva
1. Guardar imágenes en `_staging/`
2. Correr `/nueva-noticia` — el skill guía campo por campo y procesa las imágenes automáticamente
3. El script `scripts/imagen.js` verifica peso, comprime si es necesario y mueve a la carpeta correcta

---

## Bugs conocidos

| # | Descripción | Archivo involucrado |
|---|-------------|-------------------|
| 1 | Dark mode toggle no aparece en el nav aunque el JS y HTML existen | `dark-mode.js`, `style.css`, HTML de cada página |
| 2 | Convoy de buses salta a la mitad tras 3-4 vueltas (error acumulado en `translateX`) | `.historia-section` en `style.css` |
| 3 | Rutas relativas se rompen en subcarpetas (`/noticias/`) | Cualquier archivo dentro de `/noticias/` |
| 4 | CSS cascade genera overrides inesperados entre `style.css` y CSS de página | Verificar especificidad antes de editar CSS global |
| 5 | Fetch de componentes HTML puede fallar según nivel de carpeta | `header.js`, cualquier loader de componentes |

---

## Pendientes

1. **Panel web para noticias** — Formulario en el navegador para publicar sin tocar código ni JSON (+ Google Sheets como fuente de datos)
2. **URLs con slugs** — Cambiar de `?id=14` a `/noticias/inauguracion-terminal-pudahuel`
3. **Paginación responsive** — 8 noticias en móvil, 12 en desktop (`noticias-grid.js`)
4. **Editor de texto enriquecido** — Integrado en el panel web (tipo Word)

---

## Comandos útiles

```bash
npm run dev       # servidor de desarrollo Vite
npm run build     # build para producción
npm run preview   # previsualizar el build
node server.js    # servidor local alternativo

# Optimizar imagen antes de publicar:
npm run imagen assets/images/noticias/2026/portadas/foto.jpg
```
