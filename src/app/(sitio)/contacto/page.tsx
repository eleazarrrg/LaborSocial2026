import type { Metadata } from "next";
import Link from "next/link";
import { FormularioContacto } from "@/components/formularios/form-contacto";
import { Enlace, Instagram, WhatsApp } from "@/components/iconos";
import { Nota, TituloPagina } from "@/components/ui";
import { AlternativaWhatsApp } from "@/components/alternativa-whatsapp";
import { ajustes, enlaceWhatsapp, whatsappVisible } from "@/lib/ajustes";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escribe a la Fundación REFUVA: formulario, WhatsApp, correo e Instagram. Si necesitas ayuda ahora, usa los números de crisis.",
};

export default async function Contacto() {
  const a = await ajustes();
  const chat = enlaceWhatsapp(a.whatsapp);
  return (
    <>
      <TituloPagina
        titulo="Escríbenos."
        entrada="Para cualquier cosa que no sea pedir una cita ni inscribirse a algo. Si necesitas ayuda ahora, usa los números de crisis."
      />

      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        <div className="min-w-0 max-w-2xl">
          <FormularioContacto alternativa={<AlternativaWhatsApp texto="Escríbenos por WhatsApp" />} />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <section className="rounded-xl border border-borde bg-superficie p-6">
            <h2 className="font-display text-lg font-semibold">Otros canales</h2>
            <dl className="mt-5 space-y-5 text-sm">
              <div>
                <dt className="font-semibold">WhatsApp</dt>
                <dd className="mt-1">
                  {chat ? (
                    <a
                      href={chat}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 font-semibold text-fuerte underline underline-offset-2"
                    >
                      <WhatsApp className="size-5" />
                      <span className="cifras-alineadas">{whatsappVisible(a.whatsapp)}</span>
                      <span className="sr-only"> (se abre en otra pestaña)</span>
                    </a>
                  ) : (
                    <span className="text-tinta-suave">Pendiente de confirmar.</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Correo</dt>
                <dd className="mt-1 text-tinta-suave">
                  {a.correo ?? "Pendiente: la fundación va a estrenar dominio propio."}
                </dd>
              </div>
              {a.instagram && (
                <div>
                  <dt className="font-semibold">Instagram</dt>
                  <dd className="mt-1">
                    <a
                      href={a.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 font-semibold text-fuerte underline underline-offset-2"
                    >
                      <Instagram className="size-5" />
                      {a.instagramUsuario ?? "Ver la cuenta"}
                      <span className="sr-only"> (se abre en otra pestaña)</span>
                    </a>
                  </dd>
                </div>
              )}
              {a.otrasRedes.map((r) => (
                <div key={r.url}>
                  <dt className="font-semibold">{r.nombre}</dt>
                  <dd className="mt-1">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 font-semibold text-fuerte underline underline-offset-2"
                    >
                      <Enlace className="size-5" />
                      Ver la cuenta
                      <span className="sr-only"> de {r.nombre} (se abre en otra pestaña)</span>
                    </a>
                  </dd>
                </div>
              ))}
              <div>
                <dt className="font-semibold">Dirección</dt>
                <dd className="mt-1 text-tinta-suave">
                  {a.direccion ?? "Pendiente de confirmar."}
                </dd>
              </div>
              {a.horario && (
                <div>
                  <dt className="font-semibold">Horario</dt>
                  <dd className="mt-1 text-tinta-suave">{a.horario}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="rounded-xl bg-fuerte p-6 text-papel">
            <h2 className="font-display text-lg font-semibold">
              ¿Necesitas ayuda ahora?
            </h2>
            <p className="mt-2 text-sm opacity-85">
              Este formulario no es un canal de emergencia.
            </p>
            <Link
              href="/ayuda-en-crisis"
              className="mt-4 inline-block font-semibold underline underline-offset-4"
            >
              Ver los números que contestan →
            </Link>
          </section>

          <Nota>
            El mapa se añade cuando la fundación confirme si hay una dirección
            publicable. Se cargará solo si lo pides, para no traer cookies de
            terceros a quien no las quiere.
          </Nota>
        </aside>
      </div>
    </>
  );
}
