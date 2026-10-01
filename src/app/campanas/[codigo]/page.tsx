import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FichaEntrada } from "@/components/ficha-entrada";
import { CAMPANAS, buscarPorTipo } from "@/lib/catalogo";

type Props = { params: Promise<{ codigo: string }> };

export function generateStaticParams() {
  return CAMPANAS.map((c) => ({ codigo: c.codigo }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { codigo } = await params;
  const c = buscarPorTipo("campana", codigo);
  if (!c) return {};
  return { title: c.nombre, description: c.resumen };
}

export default async function PaginaCampana({ params }: Props) {
  const { codigo } = await params;
  const campana = buscarPorTipo("campana", codigo);
  if (!campana) notFound();
  return <FichaEntrada entrada={campana} />;
}
