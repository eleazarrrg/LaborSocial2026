import type { Metadata } from "next";
import Link from "next/link";
import { BotonCopiar } from "@/components/boton-copiar";
import { Boton, Nota, TituloPagina } from "@/components/ui";
import { DONACIONES, PRECIO_CONSULTA } from "@/lib/contacto";

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
  return (
    <>
      <TituloPagina
        titulo="Sin formularios. Sin registro."
        entrada="Dos formas de dar, las dos directas a la cuenta de la fundación. No pedimos datos y no guardamos nada tuyo."
      />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* ─────────────────────────────────────────────── Yappy */}
          <section className="flex flex-col rounded-2xl border border-borde bg-superficie p-7 sm:p-8">
            <h2 className="font-display text-2xl font-semibold">
              Yappy Comercial
            </h2>
            <p className="mt-3 text-tinta-suave">
              Desde la app de tu banco, en unos segundos. Es la vía más barata
              para la fundación: la comisión es mínima y no la pagas tú.
            </p>

            <div className="mt-7 grow">
              {DONACIONES.yappy ? (
                <div className="flex items-center gap-3 rounded-lg bg-papel-alto px-4 py-3.5">
                  <span className="cifras-alineadas grow font-display text-xl font-semibold">
                    {DONACIONES.yappy}
                  </span>
                  <BotonCopiar
                    valor={DONACIONES.yappy}
                    etiqueta="el alias de Yappy"
                  />
                </div>
              ) : (
                <Nota tono="atencion">
                  <strong className="text-tinta">Pendiente.</strong> Yappy
                  Comercial exige una cuenta comercial en Banco General a nombre
                  de la fundación, con Banca en Línea Comercial activa. Es el
                  trámite que hay que empezar antes que ninguna otra cosa.
                </Nota>
              )}
            </div>
          </section>

          {/* ──────────────────────────────────────── Transferencia */}
          <section className="flex flex-col rounded-2xl border border-borde bg-superficie p-7 sm:p-8">
            <h2 className="font-display text-2xl font-semibold">
              Transferencia bancaria
            </h2>
            <p className="mt-3 text-tinta-suave">
              Con ACH la transferencia se acredita el mismo día. Si quieres
              recibo, mándanos el comprobante.
            </p>

            <div className="mt-7 grow">
              {DONACIONES.cuenta ? (
                <dl className="space-y-3">
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
              ) : (
                <Nota tono="atencion">
                  <strong className="text-tinta">Pendiente.</strong> Banco, tipo
                  de cuenta, número y titular, exactamente como figuran en el
                  banco. Una letra distinta en el titular hace que el banco
                  rechace la transferencia.
                </Nota>
              )}
            </div>
          </section>
        </div>

        {/* ────────────────────────────────────────── Equivalencias */}
        <section
          aria-labelledby="equivalencias"
          className="mt-16 border-t border-borde-fuerte pt-14"
        >
          <h2 id="equivalencias" className="text-3xl font-semibold sm:text-4xl">
            Qué hace tu donación
          </h2>
          <dl className="mt-9 grid gap-x-8 gap-y-9 sm:grid-cols-3">
            {EQUIVALENCIAS.map((e) => (
              <div key={e.monto}>
                <dt className="cifras-alineadas font-display text-2xl font-semibold text-fuerte sm:text-3xl">
                  {e.monto}
                </dt>
                <dd className="mt-2.5 leading-relaxed text-tinta-suave">
                  {e.logra}
                </dd>
              </div>
            ))}
          </dl>
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
                className="inline-flex items-center px-2 py-3.5 font-semibold text-fuerte decoration-2 underline-offset-4 hover:underline"
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
