import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FichaEntrada } from "@/components/ficha-entrada";
import { entradaPorCodigo } from "@/lib/contenido";
import { metadatosDeEntrada } from "@/lib/metadatos";

type Props = { params: Promise<{ codigo: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { codigo } = await params;
  const p = await entradaPorCodigo("proyecto", codigo);
  if (!p) return {};
  return metadatosDeEntrada(p);
}

export default async function PaginaProyecto({ params }: Props) {
  const { codigo } = await params;
  const proyecto = await entradaPorCodigo("proyecto", codigo);
  if (!proyecto) notFound();
  return <FichaEntrada entrada={proyecto} />;
}
