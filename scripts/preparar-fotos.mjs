/**
 * Prepara las fotos de referencia del manifiesto (contenido-provisional/fotos.json): las baja de
 * Unsplash si no están, las reduce a 2000 px de ancho y las guarda en contenido-provisional/fotos/.
 *
 *   node scripts/preparar-fotos.mjs
 *
 * Las originales de 2400 px quedan en contenido-provisional/candidatas/ (no se versionan). Las que
 * salen de aquí son las que sube `npm run sembrar`. Son fotos de referencia: ver docs/fotos-referencia.md.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const RAIZ = "contenido-provisional";
const manifiesto = JSON.parse(readFileSync(join(RAIZ, "fotos.json"), "utf8"));
mkdirSync(join(RAIZ, "candidatas"), { recursive: true });
mkdirSync(join(RAIZ, "fotos"), { recursive: true });

for (const f of manifiesto) {
  const original = join(RAIZ, "candidatas", `${f.origen}.jpg`);
  if (!existsSync(original)) {
    const r = await fetch(`https://unsplash.com/photos/${f.origen}/download?force=true&w=2400`, { redirect: "follow" });
    if (!r.ok || !(r.headers.get("content-type") ?? "").startsWith("image/")) {
      throw new Error(`No se pudo bajar ${f.origen}: ${r.status} ${r.headers.get("content-type")}`);
    }
    writeFileSync(original, Buffer.from(await r.arrayBuffer()));
  }

  let img = sharp(original);
  if (f.recorte?.arriba) {
    const { width = 0, height = 0 } = await img.metadata();
    const arriba = Math.round(height * f.recorte.arriba);
    img = sharp(await img.extract({ left: 0, top: arriba, width, height: height - arriba }).toBuffer());
  }
  // Una foto vertical pasa a 3:2 horizontal, centrada en `recorte.foco` (de 0 a 1, a lo alto).
  if (f.recorte?.horizontal) {
    const { width = 0, height = 0 } = await img.metadata();
    const alto = Math.round((width * 2) / 3);
    const arriba = Math.min(Math.max(Math.round(height * f.recorte.foco - alto / 2), 0), height - alto);
    img = sharp(await img.extract({ left: 0, top: arriba, width, height: alto }).toBuffer());
  }
  const salida = join(RAIZ, "fotos", f.archivo);
  const info = await img
    .resize({ width: 2000, withoutEnlargement: true })
    .jpeg({ quality: 80, progressive: true, mozjpeg: true })
    .toFile(salida);
  console.log(`${f.archivo.padEnd(34)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}
