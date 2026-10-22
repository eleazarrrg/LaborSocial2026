/**
 * Una hoja de contactos con las fotos de una carpeta, con su nombre y sus medidas, para revisarlas
 * de un vistazo antes de aceptarlas (rostros, marcas, texto, orientación).
 *
 *   node scripts/hoja-de-contactos.mjs contenido-provisional/candidatas salida.png
 */
import { readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const [carpeta, salida = "hoja.png"] = process.argv.slice(2);
if (!carpeta) {
  console.error("Uso: node scripts/hoja-de-contactos.mjs <carpeta> [salida.png]");
  process.exit(1);
}

const ANCHO = 520;
const ALTO = 330;
const COLUMNAS = 3;
const archivos = readdirSync(carpeta).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

const celdas = [];
for (const [i, f] of archivos.entries()) {
  const img = sharp(join(carpeta, f));
  const { width = 0, height = 0 } = await img.metadata();
  const miniatura = await img.resize(ANCHO, ALTO, { fit: "cover" }).jpeg({ quality: 80 }).toBuffer();
  const etiqueta = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${ANCHO}" height="34"><rect width="100%" height="100%" fill="#111"/><text x="8" y="22" font-family="Arial" font-size="15" fill="#fff">${f.replace(/[<&]/g, "")}  ${width}x${height}</text></svg>`,
  );
  const celda = await sharp({ create: { width: ANCHO, height: ALTO + 34, channels: 3, background: "#111" } })
    .composite([{ input: miniatura, top: 0, left: 0 }, { input: etiqueta, top: ALTO, left: 0 }])
    .png()
    .toBuffer();
  celdas.push({ input: celda, left: (i % COLUMNAS) * (ANCHO + 8), top: Math.floor(i / COLUMNAS) * (ALTO + 34 + 8) });
}

const filas = Math.ceil(archivos.length / COLUMNAS);
await sharp({
  create: { width: COLUMNAS * (ANCHO + 8), height: filas * (ALTO + 42), channels: 3, background: "#222" },
})
  .composite(celdas)
  .png()
  .toFile(salida);
console.log(`${archivos.length} fotos en ${salida}`);
