import Link from "next/link";
import { Nota } from "@/components/ui";
import { BANDEJAS, ESTADOS, exigirAdmin, fecha, type TipoBandeja } from "@/lib/panel";
import { BarraPanel } from "./barra";

const ABIERTOS = ["pendiente", "en_gestion"];
const LIMITE = 50;

type Fila = {
  tipo: TipoBandeja;
  id: string;
  nombre: string;
  creado_en: string;
  estado: string;
  atencion_pronto?: boolean;
};

/** La bandeja (RF-12): lo abierto de los cuatro formularios, lo más viejo primero. */
export default async function Bandeja() {
  const { supabase, nombre } = await exigirAdmin();

  const porTipo = await Promise.all(
    (Object.keys(BANDEJAS) as TipoBandeja[]).map(async (tipo) => {
      const columnas = `id, nombre, creado_en, estado${tipo === "cita" ? ", atencion_pronto" : ""}`;
      const { data, error, count } = await supabase
        .from(BANDEJAS[tipo].tabla)
        .select(columnas, { count: "exact" })
        .in("estado", ABIERTOS)
        .order("creado_en", { ascending: true })
        .limit(LIMITE);
      if (error) throw new Error(`No se pudo leer ${BANDEJAS[tipo].tabla}: ${error.message}`);
      const filas = (data as unknown as Omit<Fila, "tipo">[]).map((f) => ({ ...f, tipo }));
      return { tipo, filas, total: count ?? filas.length };
    }),
  );

  const { count: enCuarentena, error: errorCuarentena } = await supabase
    .from("envios_en_cuarentena")
    .select("id", { count: "exact", head: true })
    .eq("revisado", false);
  if (errorCuarentena) throw new Error(`No se pudo leer la cuarentena: ${errorCuarentena.message}`);

  // Primero quien pidió atención pronto; después, la espera más larga.
  const filas = porTipo
    .flatMap((t) => t.filas)
    .sort(
      (a, b) =>
        Number(!!b.atencion_pronto) - Number(!!a.atencion_pronto) ||
        a.creado_en.localeCompare(b.creado_en),
    );

  return (
    <>
      <BarraPanel nombre={nombre} />
      <h1 className="text-3xl font-extrabold">Bandeja</h1>

      <ul className="mt-6 flex flex-wrap gap-3">
        {porTipo.map(({ tipo, total }) => (
          <li key={tipo} className="rounded-lg border border-borde bg-papel-alto px-4 py-2">
            <span className="font-bold">{total}</span> {BANDEJAS[tipo].plural.toLowerCase()}
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Nota tono="atencion">
          Si una solicitud habla de riesgo para la vida, no esperes su turno: responde de
          inmediato y comparte el <strong className="text-tinta">911</strong> y la{" "}
          <strong className="text-tinta">Línea 147</strong>.
        </Nota>
      </div>

      {filas.length === 0 ? (
        <p className="mt-10 text-lg text-tinta-suave">No hay nada pendiente.</p>
      ) : (
        <ol className="mt-8 divide-y divide-borde border-y border-borde">
          {filas.map((f) => (
            <li key={`${f.tipo}-${f.id}`}>
              <Link
                href={`/panel/solicitudes/${f.tipo}/${f.id}`}
                className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-2 py-4 hover:bg-papel-alto"
              >
                <span className="w-44 shrink-0 text-sm text-tinta-suave">
                  {BANDEJAS[f.tipo].plural}
                </span>
                <span className="font-semibold">{f.nombre}</span>
                {f.atencion_pronto && (
                  <span className="rounded bg-valiente-tenue px-2 py-0.5 text-sm font-semibold text-tinta">
                    Pidió atención pronto
                  </span>
                )}
                <span className="ml-auto text-sm text-tinta-suave">
                  {ESTADOS.find((e) => e.valor === f.estado)?.etiqueta} · {fecha(f.creado_en)}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}

      {porTipo.some((t) => t.total > LIMITE) && (
        <p className="mt-4 text-sm text-tinta-suave">
          Se muestran las {LIMITE} más antiguas de cada tipo. Atiéndelas y aparecerán las demás.
        </p>
      )}

      {!!enCuarentena && (
        <p className="mt-10 text-sm text-tinta-suave">
          {enCuarentena} envío(s) en cuarentena por parecer automáticos. Se revisan como dice
          docs/09-operacion-y-traspaso.md.
        </p>
      )}
    </>
  );
}
