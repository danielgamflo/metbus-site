# Nueva Noticia

Crea una nueva noticia para el sitio web de Metbus.

## Cómo funciona el sistema de noticias

El sitio usa **un solo archivo dinámico** (`noticias/noticia.html`) que carga el contenido desde `noticias.json` según el `?id=` en la URL. **No se crean páginas HTML nuevas.** Solo se agrega la entrada al JSON.

## Estructura de carpetas de imágenes

```
assets/images/noticias/YYYY/
  portadas/    → imagen principal de la noticia
  galeria/     → imágenes del carrusel o galería
```

Los videos son siempre enlaces embed de YouTube — no hay archivos de video locales.

## Pasos

1. Lee `noticias.json` para obtener el mayor `id` existente y calcular el siguiente (`id + 1`).

2. Pregunta al usuario los campos de texto primero:

```
id:            [calculado automáticamente]
titulo:        ""
descripcion:   ""   → descripción corta para el listado/cards
fecha:         ""   → formato YYYY-MM-DD
fecha_display: ""   → ej: Marzo 2026
categoria:     ""   → ej: INSTITUCIONAL, OPERACIONES, SOSTENIBILIDAD, EVENTO, PERSONAS
tipo:          ""   → basica | galeria | video
ubicacion:     ""   → ej: Santiago, Chile
contenido_html:""   → el texto de la noticia (o "placeholder" para completar después)
```

3. Luego pide las imágenes **una por una**. Para cada imagen:
   - Pide solo el nombre del archivo (ej: `evento-lanzamiento.jpg`)
   - Recuerda al usuario que debe tenerla en la carpeta `_staging/` del proyecto
   - Ejecuta el script: `node scripts/imagen.js <archivo> <portada|galeria> <año>`
   - Muestra el resultado (peso original, peso final, ruta JSON)
   - Usa la ruta que devuelve el script para el campo correspondiente en el JSON

   Campos de imagen según tipo:
   - **Siempre:** portada (imagen principal)
   - **tipo = galeria:** imágenes del carrusel (pedir una por una)
   - **tipo = video:** poster del video (imagen previa)

4. Si tipo = video, pide también:
   ```
   video_url: ""  → URL embed de YouTube (ej: https://www.youtube.com/embed/XXXX)
   ```

5. Construye la entrada JSON completa y agrégala al **inicio** del array en `noticias.json`:
   - `enlace` → `noticias/noticia.html?id=X`
   - Omitir campos vacíos o que no apliquen al tipo

6. Confirma al usuario que todo quedó guardado y muestra el enlace para ver la noticia:
   `http://localhost:5173/noticias/noticia.html?id=X`

## Reglas

- El `id` debe ser el mayor `id` existente en `noticias.json` + 1
- La nueva entrada va al **inicio** del array (no al final)
- Nunca crear archivos HTML por noticia
- No inventar contenido — dejar placeholders claros (ej: `[TEXTO DE LA NOTICIA]`)
- Si el script de imagen falla, avisar al usuario y continuar con la ruta manual
