import { notFound } from "next/navigation";
import { z } from "zod";
import { Nota } from "@/components/ui";
import { BANDEJAS, ESTADOS, esTipoBandeja, exigirAdmin, fecha, type TipoBandeja } from "@/lib/panel";
import {
  AREAS_VOLUNTARIADO,
  CONTACTO_PREFERIDO,
  FORMAS_ENTREGA,
  MODALIDADES,
} from "@/lib/opciones";
import { accionCambiarEstado } from "../../../acciones";
import { BarraPanel } from "../../../barra";

type Opcion = { readonly valor: string; readonly etiqueta: string };
const etiqueta = (lista: readonly Opcion[]) => (v: unknown) =>
  lista.find((o) => o.valor === v)?.etiqueta ?? String(v);

/** Qué se muestra de cada formulario, en orden, con su nombre legible. */
const CAMPOS: Record<TipoBandeja, [string, string, ((v: unknown) => string)?][]> = {
  cita: [
    ["contacto_preferido", "Prefiere que le escriban por", etiqueta(CONTACTO_PREFERIDO)],
    ["modalidad", "Modalidad", etiqueta(MODALIDADES)],
    ["motivo", "Sobre qué quiere hablar"],
    ["disponibilidad", "Disponibilidad"],
    ["atencion_pronto", "Pidió atención pronto", (v) => (v ? "Sí" : "No")],
  ],
  voluntariado: [
    [
      "areas_interes",
      "Áreas",
      (v) => (Array.isArray(v) ? v.map(etiqueta(AREAS_VOLUNTARIADO)).join(", ") : String(v)),
    ],
    ["otra_area", "Otra área"],
    ["disponibilidad", "Disponibilidad"],
    ["experiencia", "Algo que debamos saber"],
  ],
  padrinos: [
    ["cantidad_ninos", "Cuántos niños o niñas apadrina"],
    ["forma_entrega", "Entrega del regalo", etiqueta(FORMAS_ENTREGA)],
    ["comentario", "Comentario"],
  ],
  contacto: [
    ["asunto", "Asunto"],
    ["mensaje", "Mensaje"],
  ],
};

const AVISOS: Record<string, { tono: "neutro" | "atencion"; texto: string }> = {
  guardado: { tono: "neutro", texto: "Estado guardado. Queda en la bitácora con tu nombre." },
  "no-guardado": {
    tono: "atencion",
    texto: "No se pudo guardar el estado. Recarga la página e inténtalo otra vez.",
  },
};

export default async function Detalle({
  params,
  searchParams,
}: {
  params: Promise<{ tipo: string; id: string }>;
  searchParams: Promise<{ aviso?: string }>;
}) {
  const { tipo, id } = await params;
  const { aviso } = await searchParams;
  if (!esTipoBandeja(tipo) || !z.uuid().safeParse(id).success) notFound();

  const { supabase, nombre } = await exigirAdmin();
  const bandeja = BANDEJAS[tipo];

  const { data, error } = await supabase.from(bandeja.tabla).select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`No se pudo leer la solicitud: ${error.message}`);
  if (!data) notFound();
  const fila = data as Record<string, unknown>;

  // Quién vio qué y cuándo (RNF-12). Sin ese rastro, la solicitud no se muestra.
  const { error: errorBitacora } = await supabase.from("bitacora").insert({
    accion: "ver_solicitud",
    entidad: bandeja.tabla,
    entidad_id: id,
    resumen: `Vio: ${bandeja.singular.toLowerCase()}`,
  });
  if (errorBitacora) throw new Error(`No se pudo registrar la consulta: ${errorBitacora.message}`);

  const correo = typeof fila.correo === "string" ? fila.correo : null;
  const telefono = typeof fila.telefono === "string" ? fila.telefono : null;
  const textoAviso = aviso ? AVISOS[aviso] : undefined;

  return (
    <>
      <BarraPanel nombre={nombre} />
      <p className="text-sm text-tinta-suave">
        {bandeja.singular} · recibida el {fecha(String(fila.creado_en))}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold">{String(fila.nombre)}</h1>

      {textoAviso && (
        <div className="mt-6">
          <Nota tono={textoAviso.tono}>{textoAviso.texto}</Nota>
        </div>
      )}

      <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-[14rem_1fr]">
        <dt className="font-semibold">Correo</dt>
        <dd>
          {correo ? (
            <a href={`mailto:${correo}`} className="text-fuerte underline underline-offset-2">
              {correo}
            </a>
          ) : (
            "—"
          )}
        </dd>
        <dt className="font-semibold">Teléfono</dt>
        <dd>
          {telefono ? (
            <a
              href={`tel:${telefono.replace(/[^\d+]/g, "")}`}
              className="text-fuerte underline underline-offset-2"
            >
              {telefono}
            </a>
          ) : (
            "—"
          )}
        </dd>
        {CAMPOS[tipo].map(([campo, nombreCampo, formato]) => (
          <div key={campo} className="contents">
            <dt className="font-semibold">{nombreCampo}</dt>
            <dd className="whitespace-pre-line">
              {fila[campo] == null || fila[campo] === ""
                ? "—"
                : formato
                  ? formato(fila[campo])
                  : String(fila[campo])}
            </dd>
          </div>
        ))}
      </dl>

      <form
        action={accionCambiarEstado}
        className="mt-10 flex flex-wrap items-end gap-4 border-t border-borde pt-8"
      >
        <input type="hidden" name="tipo" value={tipo} />
        <input type="hidden" name="id" value={id} />
        <div>
          <label htmlFor="estado" className="block font-semibold">
            Estado
          </label>
          <select
            id="estado"
            name="estado"
            defaultValue={String(fila.estado)}
            className="mt-2 min-h-11 rounded-lg border border-borde-control bg-superficie px-3"
          >
            {ESTADOS.map((e) => (
              <option key={e.valor} value={e.valor}>
                {e.etiqueta}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="min-h-11 rounded-lg bg-fuerte px-6 font-semibold text-papel hover:bg-marca"
        >
          Guardar estado
        </button>
      </form>

      {typeof fila.atendida_en === "string" && (
        <p className="mt-4 text-sm text-tinta-suave">Cerrada el {fecha(fila.atendida_en)}.</p>
      )}
    </>
  );
}
