import { RichText } from "@payloadcms/richtext-lexical/react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BloqueCrisis } from "@/components/banda-crisis";
import { Portada } from "@/components/portada";
import { fechaLarga, noticia } from "@/lib/publicaciones";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const n = await noticia(slug);
  if (!n) return {};
  const imagen = n.portada?.panoramica ?? n.portada?.portada ?? n.portada?.original;
  return {
    title: n.titulo,
    description: n.resumen,
    openGraph: {
      title: n.titulo,
      description: n.resumen,
      type: "article",
      publishedTime: n.fecha,
      images: imagen ? [{ url: imagen, alt: n.portada?.alt }] : undefined,
    },
  };
}

export default async function PaginaNoticia({ params }: Props) {
  const { slug } = await params;
  const n = await noticia(slug);
  if (!n) notFound();

  return (
    <article>
      <header className="border-b border-borde bg-papel-alto">
        <div className="mx-auto max-w-3xl px-4 pt-8 pb-10 sm:px-6 sm:pt-10 sm:pb-14">
          <nav aria-label="Miga de pan" className="text-sm text-tinta-suave">
            <Link href="/noticias" className="-my-1.5 inline-block py-1.5 underline-offset-4 hover:text-tinta hover:underline">Noticias</Link>
            <span aria-hidden className="mx-2 text-borde-fuerte">/</span>
            <span className="text-tinta">{n.titulo}</span>
          </nav>
          <p className="mt-8 text-sm text-tinta-suave">
            <time dateTime={n.fecha}>{fechaLarga(n.fecha)}</time>
            {n.proyecto && (
              <>
                {" · "}
                <Link href={n.proyecto.ruta} className="font-bold underline underline-offset-4">{n.proyecto.nombre}</Link>
              </>
            )}
          </p>
          <h1 className="mt-3 text-4xl leading-[1.08] font-extrabold text-balance sm:text-5xl">{n.titulo}</h1>
          <p className="mt-5 text-lg leading-relaxed text-tinta-suave sm:text-xl">{n.resumen}</p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        {n.portada && (
          <div className="mb-10 overflow-hidden rounded-2xl">
            <Portada foto={n.portada} sizes="(min-width: 768px) 768px, 100vw" prioridad className="aspect-[3/2]" />
          </div>
        )}

        {n.cuerpo && <RichText data={n.cuerpo} className="max-w-[62ch] space-y-6 text-lg leading-relaxed" />}

        {n.bloqueCrisis && (
          <div className="mt-14">
            <BloqueCrisis />
          </div>
        )}

        <p className="mt-14">
          <Link href="/noticias" className="inline-flex min-h-11 items-center font-bold text-fuerte underline underline-offset-4">
            ← Todas las noticias
          </Link>
        </p>
      </div>
    </article>
  );
}
