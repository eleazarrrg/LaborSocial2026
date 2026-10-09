import Link from "next/link";
import type { ServerProps } from "payload";
import { esAdmin } from "../acceso";

/**
 * Lo primero que ve la administración al entrar al panel (RF-12): lo pendiente de las cuatro
 * bandejas en una sola lista, primero quien pidió atención pronto y después la espera más larga.
 *
 * Se lee con overrideAccess porque el panel ya exigió sesión y segundo factor para llegar aquí, y
 * esta vista se muestra solo a administración. Son listas: no dejan rastro de «vio» en la bitácora.
 */

const BANDEJAS = [
  { slug: "solicitudes-cita", nombre: "Cita", plural: "citas" },
  { slug: "inscripciones-voluntariado", nombre: "Voluntariado", plural: "voluntariado" },
  { slug: "inscripciones-padrinos", nombre: "Padrinos", plural: "padrinos" },
  { slug: "mensajes-contacto", nombre: "Contacto", plural: "contacto" },
] as const;

const ABIERTOS = ["pendiente", "en_gestion"];
const LIMITE = 30;

// «8 oct 2026, 7:26 p. m.»: con el mes en letras, porque es-PA escribe 10/08 para el 8 de octubre.
const fecha = new Intl.DateTimeFormat("es-PA", {
  timeZone: "America/Panama",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

type Fila = {
  slug: string;
  tipo: string;
  id: number | string;
  nombre: string;
  estado: string;
  creado: string;
  pronto: boolean;
};

export async function ResumenBandeja({ payload, user }: ServerProps) {
  if (!esAdmin(user)) return null;

  const porTipo = await Promise.all(
    BANDEJAS.map(async (b) => {
      const { docs, totalDocs } = await payload.find({
        collection: b.slug,
        overrideAccess: true,
        depth: 0,
        limit: LIMITE,
        sort: "createdAt",
        where: { estado: { in: ABIERTOS } },
      });
      const filas: Fila[] = docs.map((d) => {
        const doc = d as unknown as Record<string, unknown>;
        return {
          slug: b.slug,
          tipo: b.nombre,
          id: doc.id as number,
          nombre: String(doc.nombre),
          estado: String(doc.estado),
          creado: String(doc.createdAt),
          pronto: doc.atencionPronto === true,
        };
      });
      const { totalDocs: sinAviso } = await payload.count({
        collection: b.slug,
        overrideAccess: true,
        where: { avisoEnviado: { equals: false } },
      });
      return { ...b, total: totalDocs, filas, sinAviso };
    }),
  );

  const { totalDocs: enCuarentena } = await payload.count({
    collection: "cuarentena",
    overrideAccess: true,
    where: { revisado: { equals: false } },
  });

  const filas = porTipo
    .flatMap((t) => t.filas)
    .sort((a, b) => Number(b.pronto) - Number(a.pronto) || a.creado.localeCompare(b.creado));

  return (
    <section className="resumen-bandeja" aria-labelledby="resumen-bandeja-titulo">
      <h2 id="resumen-bandeja-titulo">Pendiente de atender</h2>

      <ul className="resumen-bandeja__conteos">
        {porTipo.map((t) => (
          <li key={t.slug}>
            <Link href={`/admin/collections/${t.slug}`}>
              <strong>{t.total}</strong> {t.plural}
            </Link>
          </li>
        ))}
      </ul>

      <p className="resumen-bandeja__crisis" role="note">
        Si una solicitud habla de riesgo para la vida, no esperes su turno: responde de inmediato y
        comparte el <strong>911</strong> y la <strong>Línea 147</strong> (también por WhatsApp,
        6694-2747).
      </p>

      {filas.length === 0 ? (
        <p>No hay nada pendiente.</p>
      ) : (
        <ol className="resumen-bandeja__lista">
          {filas.map((f) => (
            <li key={`${f.slug}-${f.id}`}>
              <Link href={`/admin/collections/${f.slug}/${f.id}`}>
                <span className="resumen-bandeja__tipo">{f.tipo}</span>
                <span className="resumen-bandeja__nombre">{f.nombre}</span>
                {f.pronto && <span className="resumen-bandeja__pronto">Pidió atención pronto</span>}
                <span className="resumen-bandeja__fecha">
                  {f.estado === "en_gestion" ? "En gestión · " : ""}
                  {fecha.format(new Date(f.creado))}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}

      {porTipo.some((t) => t.sinAviso > 0) && (
        <p className="resumen-bandeja__nota">
          {porTipo.reduce((n, t) => n + t.sinAviso, 0)} solicitud(es) sin aviso por correo. Están
          guardadas; revisa la configuración de correo si el número sigue subiendo (docs/09 §5.0.4).
        </p>
      )}

      {enCuarentena > 0 && (
        <p className="resumen-bandeja__nota">
          <Link href="/admin/collections/cuarentena">
            {enCuarentena} envío(s) en cuarentena por parecer automáticos
          </Link>
          . Revísalos por si alguno era una persona.
        </p>
      )}
    </section>
  );
}
