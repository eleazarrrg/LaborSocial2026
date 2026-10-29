import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FichaEntrada } from "@/components/ficha-entrada";
import { entradaPorCodigo } from "@/lib/contenido";
import { metadatosDeEntrada } from "@/lib/metadatos";

type Props = { params: Promise<{ codigo: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { codigo } = await params;
  const c = await entradaPorCodigo("campana", codigo);
  if (!c) return {};
  return metadatosDeEntrada(c);
}

export default async function PaginaCampana({ params }: Props) {
  const { codigo } = await params;
  const campana = await entradaPorCodigo("campana", codigo);
  if (!campana) notFound();
  return <FichaEntrada entrada={campana} />;
}
