# Guía de mantenimiento — Sitio Web Metbus
**Para:** Brian (soporte y mantención)
**Repositorio:** github.com/danielgamflo/metbus

---

## ¿Cómo funciona el sitio?

Sitio estático construido con **Vite**. No tiene backend propio. El contenido dinámico viene de dos fuentes:

| Contenido | Fuente |
|-----------|--------|
| Noticias | `noticias.json` (en el repositorio) |
| Recorridos | S3 de Amazon (`metbus-staging-recorridos.s3.us-east-1.amazonaws.com/recorridos.json`) |

---

## Recorridos

Los recorridos **no se editan en el repositorio**. Se gestionan desde el servidor de Amazon (S3) conectado a Google Sheets. El sitio los consume automáticamente desde esa URL.

No tocar `js/pages/recorridos.js` salvo que cambie la URL del S3.

---

## Cómo publicar una noticia nueva

Las noticias se agregan editando el archivo `noticias.json` en la raíz del proyecto.

### Estructura de una noticia básica

```json
{
  "id": 8,
  "titulo": "Título de la noticia",
  "descripcion": "Descripción corta para el listado",
  "imagen": "assets/images/noticias/2026/portadas/nombre-imagen.jpg",
  "fecha": "2026-03-01",
  "fecha_display": "Marzo 2026",
  "categoria": "EVENTO",
  "enlace": "noticias/noticia.html?id=8",
  "tipo": "basica",
  "portada": "assets/images/noticias/2026/portadas/nombre-imagen.jpg",
  "ubicacion": "Santiago, Chile",
  "contenido_html": "<h3>Título interno</h3><p>Texto de la noticia.</p>"
}
```

### Tipos de noticia

| Tipo | Descripción | Campos extra |
|------|-------------|--------------|
| `basica` | Texto + imagen de portada | — |
| `galeria` | Carrusel de fotos | `carrusel: [ { src, alt } ]` |
| `video` | Video de YouTube + texto | `video_url`, `video_poster` |

> Cualquier tipo puede tener video agregando `video_url` y `video_poster`.

### Pasos para agregar una noticia

1. Abrir `noticias.json`
2. Agregar el nuevo objeto al **inicio** del array (no al final)
3. El `id` debe ser el número mayor existente + 1
4. Subir la imagen de portada en: `assets/images/noticias/YYYY/portadas/`
5. Si tiene galería, subir fotos en: `assets/images/noticias/YYYY/galeria/`
6. Hacer build y subir al servidor

### Reglas de imágenes

- **Portada:** máx 1920px ancho, menos de 300kb
- **Galería:** máx 1200px ancho, menos de 200kb
- Sin espacios ni tildes en los nombres de archivo
- Herramienta para comprimir: [squoosh.app](https://squoosh.app)

---

## Cómo hacer el build

```bash
npm install       # solo la primera vez
npm run build     # genera la carpeta /dist lista para subir
```

La carpeta `dist/` contiene el sitio listo para producción.

---

## Estructura de carpetas clave

```
/assets/images/noticias/YYYY/
  portadas/   → imágenes principales de noticias
  galeria/    → fotos de carrusel

/noticias/
  noticia.html  → template único dinámico (no editar salvo cambios de diseño)

/js/pages/
  noticia.js      → lógica de carga de noticias individuales
  recorridos.js   → lógica de carga de recorridos desde S3

noticias.json     → fuente de datos de noticias
```

---

## Contacto

Ante dudas sobre el código o estructura del proyecto: **Daniel Gamboa**
