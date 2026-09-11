import Link from "next/link";
import { CONTACTO } from "@/lib/contacto";

/**
 * El camino alternativo cuando el formulario no basta.
 *
 * RF-02 exige que WhatsApp conviva con el formulario, no que lo reemplace: hoy
 * es el único canal real de la fundación y hay gente para la que un chat es más
 * fácil que un formulario.
 *
 * Si el número todavía no está confirmado (pendiente S-07), se dice — no se
 * inventa. Mandar a alguien que pide ayuda a un número equivocado es peor que
 * no ofrecer el botón.
 */
export function AlternativaWhatsApp({
  texto = "O escríbenos directamente por WhatsApp",
}: {
  texto?: string;
}) {
  if (!CONTACTO.whatsapp) {
    return (
      <p className="text-sm text-tinta-suave">
        {texto}.{" "}
        <span className="font-medium text-tinta">
          Número pendiente de confirmar con la fundación.
        </span>{" "}
        Mientras tanto,{" "}
        <Link
          href="/contacto"
          className="font-medium text-fuerte underline underline-offset-2"
        >
          otras formas de contacto
        </Link>
        .
      </p>
    );
  }

  return (
    <a
      href={`https://wa.me/${CONTACTO.whatsapp}`}
      className="inline-flex min-h-12 items-center rounded-lg bg-superficie px-6 py-3.5 font-semibold text-tinta ring-1 ring-inset ring-borde-fuerte transition-colors hover:bg-papel-alto"
    >
      {texto}
    </a>
  );
}
