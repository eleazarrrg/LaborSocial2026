import type { Metadata } from "next";
import Link from "next/link";
import { BotonCopiar } from "@/components/boton-copiar";
import { Palabras } from "@/components/palabras";
import { Boton, TituloPagina } from "@/components/ui";
import { CONTACTO, DONACIONES, PRECIO_CONSULTA } from "@/lib/contacto";

export const metadata: Metadata = {
  title: "Donar",
  description:
    "Cómo donar a la Fundación REFUVA: Yappy Comercial o transferencia bancaria. Sin formularios y sin registro.",
};

/**
 * Donaciones (módulo 3.1.6, RF-09).
 *
 * SIN MURO. Nada de esta página exige registrarse, llenar un formulario ni
 * dejar un correo. Quien quiere dar dinero tiene que poder hacerlo en el
 * siguiente toque, no en el quinto.
 *
 * ORDEN: primero qué logra el aporte (la gente decide cuánto dar antes de ver
 * cómo), después los datos. Mientras falten los datos de la cuenta se muestra
 * UN solo aviso, no dos cajas punteadas: dos «Pendiente» seguidos se leen como
 * un sitio roto.
 *
 * EL SITIO NO TOCA DATOS DE TARJETA. Nunca. En v1 no hay pasarela de pago:
 * Yappy y transferencia, que es lo que hacen las fundaciones panameñas reales
 * y lo que deja a REFUVA fuera del alcance PCI (ADR-0005).
 *
 * Los datos van en `ajustes` y los edita el panel (3.2.7). Un número de cuenta
 * escrito en el código es un error de diseño: el día que cambie, la fundación
 * tendría que llamarnos.
 */

const EQUIVALENCIAS = [
  {
    monto: PRECIO_CONSULTA,
    logra: "Una sesión de atención psicológica para alguien que no puede pagarla.",
  },
  {
    monto: "B/.50.00",
    logra: "Raciones de comida para una parte de la jornada en la calle.",
  },
  {
    monto: "Lo que puedas",
    logra:
      "La fundación se sostiene con aportes pequeños y constantes, no con uno grande.",
  },
];

export default function Donar() {
  const sinDatos = !DONACIONES.yappy && !DONACIONES.cuenta;

  return (
    <>
      <TituloPagina
        titulo="Dar es directo y rápido."
        entrada="Dos formas de dar, las dos directas a la cuenta de la fundación. No pedimos datos y no guardamos nada tuyo."
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {/* ────────────────────────────────────────── Equivalencias */}
        <section aria-labelledby="equivalencias">
          <h2 id="equivalencias" className="text-3xl font-extrabold sm:text-5xl">
            <Palabras texto="Qué hace tu donación" />
          </h2>
          <dl className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-3">
            {EQUIVALENCIAS.map((e) => (
              <div key={e.monto} className="revelar">
                <dt className="font-display text-4xl leading-none font-extrabold text-fuerte tabular-nums sm:text-6xl">
                  {e.monto}
                </dt>
                <dd className="mt-2.5 leading-relaxed text-tinta-suave">
                  {e.logra}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ─────────────────────────────────────────── Cómo dar */}
        <section aria-labelledby="como-dar" className="mt-14 border-t border-borde-fuerte pt-12">
          <h2 id="como-dar" className="text-3xl font-extrabold sm:text-4xl">
            Cómo dar
          </h2>

          {sinDatos ? (
            <div
              role="status"
              className="mt-8 rounded-2xl border border-borde-fuerte bg-papel-alto p-7 sm:p-8"
            >
              <p className="text-xl font-extrabold">
                Estamos terminando de activar las donaciones.
              </p>
              <p className="mt-3 max-w-[60ch] leading-relaxed text-tinta-suave">
                Los datos de Yappy y de la cuenta bancaria se publican aquí en cuanto
                la fundación los confirme, para que nadie transfiera a una cuenta
                equivocada. Si quieres dar hoy, escríbenos y te los pasamos.
              </p>
              {CONTACTO.correo && (
                <a
                  href={`mailto:${CONTACTO.correo}`}
                  className="mt-4 inline-flex min-h-11 items-center font-bold text-fuerte underline underline-offset-4"
                >
                  {CONTACTO.correo}
                </a>
              )}
            </div>
          ) : (
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {DONACIONES.yappy && (
                <section className="flex flex-col rounded-2xl border border-borde bg-superficie p-7 sm:p-8">
                  <h3 className="font-display text-2xl font-semibold">Yappy Comercial</h3>
                  <p className="mt-3 text-tinta-suave">
                    Desde la app de tu banco, en unos segundos. Es la vía más barata
                    para la fundación: la comisión es mínima y no la pagas tú.
                  </p>
                  <div className="mt-7 flex items-center gap-3 rounded-lg bg-papel-alto px-4 py-3.5">
                    <span className="cifras-alineadas grow font-display text-xl font-semibold">
                      {DONACIONES.yappy}
                    </span>
                    <BotonCopiar valor={DONACIONES.yappy} etiqueta="el alias de Yappy" />
                  </div>
                </section>
              )}

              {DONACIONES.cuenta && (
                <section className="flex flex-col rounded-2xl border border-borde bg-superficie p-7 sm:p-8">
                  <h3 className="font-display text-2xl font-semibold">Transferencia bancaria</h3>
                  <p className="mt-3 text-tinta-suave">
                    Con ACH la transferencia se acredita el mismo día. Si quieres
                    recibo, mándanos el comprobante.
                  </p>
                  <dl className="mt-7 space-y-3">
                    {[
                      ["Banco", DONACIONES.cuenta.banco],
                      ["Tipo de cuenta", DONACIONES.cuenta.tipo],
                      ["Número", DONACIONES.cuenta.numero],
                      ["Titular", DONACIONES.cuenta.titular],
                    ].map(([campo, valor]) => (
                      <div
                        key={campo}
                        className="flex items-center gap-3 rounded-lg bg-papel-alto px-4 py-3"
                      >
                        <div className="grow">
                          <dt className="text-sm text-tinta-suave">{campo}</dt>
                          <dd className="cifras-alineadas font-medium">{valor}</dd>
                        </div>
                        <BotonCopiar valor={valor} etiqueta={campo} />
                      </div>
                    ))}
                  </dl>
                </section>
              )}
            </div>
          )}
        </section>

        {/* ─────────────────────────────────────────────── Confianza */}
        <section className="mt-16 grid gap-10 rounded-2xl bg-papel-alto p-7 sm:p-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Por qué no pedimos tu tarjeta
            </h2>
            <p className="mt-4 leading-relaxed text-tinta-suave">
              Este sitio no procesa, no transmite y no guarda datos de tarjeta.
              Nunca. Yappy y la transferencia van directo del banco de quien dona
              al de la fundación, sin que nosotros toquemos nada por el camino.
            </p>
            <p className="mt-4 leading-relaxed text-tinta-suave">
              Es la decisión más segura para ti y la más barata para REFUVA.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Otras formas de sostener esto
            </h2>
            <p className="mt-4 leading-relaxed text-tinta-suave">
              El dinero no es lo único que hace falta. Un regalo de Navidad para
              un niño, un sábado repartiendo comida, o abrir la puerta de una
              escuela cuentan igual.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Boton href="/participar" variante="secundario">
                Ver todas las formas
              </Boton>
              <Link
                href="/proyectos"
                className="inline-flex min-h-11 items-center px-2 py-3.5 font-semibold text-fuerte decoration-2 underline-offset-4 hover:underline"
              >
                Ver los proyectos →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
