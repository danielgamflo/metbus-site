/**
 * imagen.js — Busca una imagen en _staging/, la optimiza si es necesario
 * y la mueve a la carpeta correcta dentro de assets/images/noticias/
 *
 * Uso:
 *   node scripts/imagen.js <archivo> <portada|galeria> <año>
 *
 * Ejemplos:
 *   node scripts/imagen.js evento.jpg portada 2026
 *   node scripts/imagen.js foto-1.jpg galeria 2026
 *
 * Límites automáticos:
 *   portada → máx 300kb, máx 1920px ancho
 *   galeria → máx 200kb, máx 1200px ancho
 */

const fs    = require("fs");
const path  = require("path");
const sharp = require("sharp");

const [,, archivo, tipo, anio] = process.argv;

if (!archivo || !tipo || !anio) {
  console.error("\n  Uso: node scripts/imagen.js <archivo> <portada|galeria> <año>\n");
  process.exit(1);
}

if (!["portada", "galeria"].includes(tipo)) {
  console.error(`\n  Tipo inválido: "${tipo}". Usa "portada" o "galeria".\n`);
  process.exit(1);
}

const raiz     = path.resolve(__dirname, "..");
const staging  = path.join(raiz, "_staging", archivo);
const maxKB    = tipo === "galeria" ? 200 : 300;
const maxAncho = tipo === "galeria" ? 1200 : 1920;
const carpeta  = tipo === "galeria" ? "galeria" : "portadas";
const destDir  = path.join(raiz, "assets", "images", "noticias", anio, carpeta);
const destino  = path.join(destDir, archivo);
const rutaJSON = `assets/images/noticias/${anio}/${carpeta}/${archivo}`;

// Verificar que existe en _staging/
if (!fs.existsSync(staging)) {
  console.error(`\n  No se encontró "${archivo}" en _staging/`);
  console.error(`  Guarda la imagen en: _staging/${archivo}\n`);
  process.exit(1);
}

const pesoOriginalKB = Math.round(fs.statSync(staging).size / 1024);

console.log(`\n  Archivo : ${archivo}`);
console.log(`  Tipo    : ${tipo}  |  Límite: ${maxKB}kb, ${maxAncho}px`);
console.log(`  Peso    : ${pesoOriginalKB}kb`);

// Crear carpeta destino si no existe
fs.mkdirSync(destDir, { recursive: true });

const procesar = pesoOriginalKB > maxKB;

if (!procesar) {
  // Solo mover, sin comprimir
  fs.copyFileSync(staging, destino);
  fs.unlinkSync(staging);
  console.log(`  ✓ Dentro del límite — movida sin comprimir.`);
  console.log(`\n  Ruta JSON: "${rutaJSON}"\n`);
  process.exit(0);
}

// Comprimir y mover
console.log(`  Comprimiendo...`);

const tmpPath = destino + ".tmp";

sharp(staging)
  .resize({ width: maxAncho, withoutEnlargement: true })
  .jpeg({ quality: 82, progressive: true })
  .toFile(tmpPath)
  .then(() => {
    fs.renameSync(tmpPath, destino);
    fs.unlinkSync(staging);
    const pesoFinalKB = Math.round(fs.statSync(destino).size / 1024);
    console.log(`  ✓ Comprimida: ${pesoOriginalKB}kb → ${pesoFinalKB}kb`);
    console.log(`\n  Ruta JSON: "${rutaJSON}"\n`);
  })
  .catch(err => {
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    console.error(`\n  Error al comprimir: ${err.message}\n`);
    process.exit(1);
  });
