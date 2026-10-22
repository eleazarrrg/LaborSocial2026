/**
 * Prueba del CMS: quién puede qué, qué ve el público y qué reglas se cumplen. Crea usuarios y
 * contenido de prueba, por eso SOLO corre contra una base local y vacía:
 *
 *   DATABASE_URL=postgres://postgres:local@127.0.0.1:5433/refuva_prueba npm run probar-cms
 *
 * (Crea la base antes y córrele `npx payload migrate`.) Sale con código 1 si algo falla.
 */
import { getPayload } from "payload";
import config from "../src/payload.config";
import { eventosProximos, noticiaPorSlug, noticiasPublicadas, proyectoPorCodigo, proyectosActivos } from "../src/payload/lecturaPublica";

if (!/@(127\.0\.0\.1|localhost)[:/]/.test(process.env.DATABASE_URL ?? "")) {
  console.error("Esta prueba crea datos: solo corre contra una base local (127.0.0.1 o localhost).");
  process.exit(1);
}

const payload = await getPayload({ config });
let fallas = 0;
const ok = (c: boolean, t: string) => { console.log(`${c ? "OK   " : "FALLA"} ${t}`); if (!c) fallas++; };
const falla = async (t: string, f: () => Promise<unknown>, contiene?: string) => {
  try { await f(); ok(false, `${t} (debía rechazarse)`); }
  catch (e) { const m = String((e as Error).message); ok(!contiene || m.toLowerCase().includes(contiene.toLowerCase()), `${t} → ${m.slice(0, 80)}`); }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const A: any = payload;

const admin = await A.create({ collection: "usuarios", overrideAccess: true, context: { primeraCuenta: true }, data: { email: "a@t.co", nombre: "Admin", password: "Prueba-Local-2026" } });
const editor = await A.create({ collection: "usuarios", overrideAccess: true, data: { email: "e@t.co", nombre: "Editora", password: "Prueba-Local-2026", rol: "editor", activo: true } });
const sesion = (u: object) => ({ user: { ...u, collection: "usuarios", _strategy: "totp" }, overrideAccess: false });
const comoAdmin = sesion(admin), comoEditor = sesion(editor);

// Quien no pasó el segundo factor no entra a nada
await falla("editora SIN código del teléfono no puede crear", () => A.create({ collection: "proyectos", user: { ...editor, collection: "usuarios" }, overrideAccess: false, data: { codigo: "x", nombre: "Prueba", nombreCorto: "P", resumen: "Un resumen lo bastante largo para validar." } }));
await falla("el público no lee noticias por la API", () => A.find({ collection: "noticias", overrideAccess: false }));

// Imágenes
await falla("imagen sin texto alternativo", () => A.create({ collection: "medios", filePath: "public/marca/institucional-recortado.png", ...comoEditor, data: {} }), "alt");
await falla("foto con menores sin consentimiento", () => A.create({ collection: "medios", filePath: "public/marca/institucional-recortado.png", ...comoEditor, data: { alt: "Niños en la fiesta", requiereConsentimiento: true } }), "consentimiento");
const foto = await A.create({ collection: "medios", filePath: "public/marca/institucional-recortado.png", ...comoEditor, data: { alt: "Árbol de la Fundación REFUVA" } });
ok(!!foto.id && !!foto.width, `imagen válida guardada (${foto.width}x${foto.height}), con miniatura: ${!!foto.sizes?.miniatura?.url}`);
await falla("editora no puede borrar imágenes", () => A.delete({ collection: "medios", id: foto.id, ...comoEditor }));
ok((await A.find({ collection: "medios", overrideAccess: false })).docs.length === 1, "el público SÍ ve las imágenes");

// Noticias
await falla("noticia con «cometió suicidio»", () => A.create({ collection: "noticias", ...comoEditor, draft: true, data: { titulo: "Alguien cometió suicidio ayer en la zona", resumen: "x".repeat(30) } }), "guía de salud mental");
const n = await A.create({ collection: "noticias", ...comoEditor, draft: true, data: { titulo: "¡Se abre la convocatoria de Navidad 2026!" } });
ok(n.slug === "se-abre-la-convocatoria-de-navidad-2026", `slug automático: ${n.slug}`);
ok((await noticiasPublicadas(payload)).docs.length === 0, "el sitio NO ve el borrador");
await falla("publicar sin resumen", () => A.update({ collection: "noticias", id: n.id, ...comoEditor, data: { _status: "published" } }));
const pub = await A.update({ collection: "noticias", id: n.id, ...comoEditor, data: { resumen: "Hasta el 15 de diciembre puedes inscribirte para apadrinar a un niño.", portada: foto.id, _status: "published" } });
ok(!!pub.publicadoEn, `fecha de publicación automática: ${pub.publicadoEn}`);
ok((await noticiasPublicadas(payload)).docs.length === 1, "el sitio ve la noticia publicada");
ok((await noticiaPorSlug(payload, n.slug) as { portada?: { alt?: string } } | null)?.portada?.alt === "Árbol de la Fundación REFUVA", "la ficha trae la portada con su texto alternativo");
const cambio = await A.update({ collection: "noticias", id: n.id, ...comoEditor, data: { titulo: "Otro título distinto por completo", slug: "otro-slug" } });
ok(cambio.slug === n.slug, `el slug NO cambia tras publicar: ${cambio.slug}`);
await A.update({ collection: "noticias", id: n.id, ...comoEditor, draft: true, data: { resumen: "Un borrador nuevo que todavía no se publica ni se ve." } });
ok((await noticiasPublicadas(payload)).docs[0].resumen.startsWith("Hasta el 15"), "editar un borrador NO cambia lo publicado");
const versiones = await A.findVersions({ collection: "noticias", where: { parent: { equals: n.id } }, overrideAccess: true });
ok(versiones.totalDocs >= 2, `historial de versiones (${versiones.totalDocs})`);
await A.delete({ collection: "noticias", id: n.id, ...comoEditor, trash: true });
ok((await noticiasPublicadas(payload)).docs.length === 0, "tras la papelera, el sitio ya no la ve");

// Eventos
await falla("evento que termina antes de empezar", () => A.create({ collection: "eventos", ...comoEditor, draft: true, data: { titulo: "Jornada de voluntariado", fechaInicio: "2026-11-14T15:00:00Z", fechaFin: "2026-11-14T10:00:00Z" } }), "terminar antes");
const ev = async (titulo: string, ini: string) => A.create({ collection: "eventos", ...comoEditor, data: { titulo, resumen: "Un evento de la fundación con resumen suficiente.", fechaInicio: ini, _status: "published" } });
await ev("Evento pasado de ejemplo", "2026-09-01T15:00:00Z");
await ev("Evento futuro de ejemplo", "2026-12-19T15:00:00Z");
const prox = await eventosProximos(payload, { ahora: new Date("2026-10-22T00:00:00Z") });
ok(prox.docs.length === 1 && prox.docs[0].titulo === "Evento futuro de ejemplo", `el evento vencido no se lista (${prox.docs.map((d: { titulo: string }) => d.titulo).join(", ")})`);

// Proyectos
const p = await A.create({ collection: "proyectos", ...comoAdmin, data: { codigo: "historias-que-sanan", tipo: "proyecto", nombre: "Historias que Sanan", nombreCorto: "Historias", resumen: "Escritura terapéutica para personas que quieren contar lo que viven.", bloqueCrisis: true } });
ok(p.bloqueCrisis === true, "proyecto creado con bloque de crisis");
const e2 = await A.update({ collection: "proyectos", id: p.id, ...comoEditor, data: { bloqueCrisis: false, nombreCorto: "Historias que Sanan" } });
ok(e2.bloqueCrisis === true && e2.nombreCorto === "Historias que Sanan", `la edición cambia el texto pero NO quita el bloque de crisis (bloque=${e2.bloqueCrisis})`);
ok((await proyectoPorCodigo(payload, "proyecto", "historias-que-sanan"))?.nombreCorto === "Historias que Sanan", "el sitio lo encuentra por su dirección web");
const a2 = await A.update({ collection: "proyectos", id: p.id, ...comoAdmin, data: { bloqueCrisis: false } });
ok(a2.bloqueCrisis === false, "la administración sí puede quitarlo");
await A.update({ collection: "proyectos", id: p.id, ...comoAdmin, data: { activo: false } });
ok((await proyectosActivos(payload)).docs.length === 0, "un proyecto oculto no se ve en el sitio");
await falla("proyecto con dirección web inválida", () => A.create({ collection: "proyectos", ...comoAdmin, data: { codigo: "Mala Dirección", tipo: "proyecto", nombre: "Prueba", nombreCorto: "P", resumen: "Un resumen suficientemente largo para pasar." } }), "Dirección web");

console.log(fallas ? `\n${fallas} FALLA(S)` : "\nTODO OK");
process.exit(fallas ? 1 : 0);
