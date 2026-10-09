import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FichaEntrada } from "@/components/ficha-entrada";
import { PROYECTOS, buscarPorTipo } from "@/lib/catalogo";

type Props = { params: Promise<{ codigo: string }> };

export function generateStaticParams() {
  return PROYECTOS.map((p) => ({ codigo: p.codigo }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { codigo } = await params;
  const p = buscarPorTipo("proyecto", codigo);
  if (!p) return {};
  return { title: p.nombre, description: p.resumen };
}

export default async function PaginaProyecto({ params }: Props) {
  const { codigo } = await params;
  const proyecto = buscarPorTipo("proyecto", codigo);
  if (!proyecto) notFound();
  return <FichaEntrada entrada={proyecto} />;
}
