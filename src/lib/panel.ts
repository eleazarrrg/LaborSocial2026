import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { clienteServidor } from "@/lib/supabase/servidor";

/**
 * Las bandejas del panel: el segmento de la URL, su tabla y cómo se llaman.
 * La URL nunca lleva el nombre de la tabla: lo que llega del navegador se busca aquí.
 */
export const BANDEJAS = {
  cita: { tabla: "solicitudes_cita", plural: "Citas", singular: "Solicitud de cita" },
  voluntariado: {
    tabla: "inscripciones_voluntariado",
    plural: "Voluntariado",
    singular: "Inscripción de voluntariado",
  },
  padrinos: {
    tabla: "inscripciones_padrinos",
    plural: "Padrinos y madrinas",
    singular: "Inscripción de padrino o madrina",
  },
  contacto: { tabla: "mensajes_contacto", plural: "Contacto", singular: "Mensaje de contacto" },
} as const;

export type TipoBandeja = keyof typeof BANDEJAS;

export const ESTADOS = [
  { valor: "pendiente", etiqueta: "Pendiente" },
  { valor: "en_gestion", etiqueta: "En gestión" },
  { valor: "atendida", etiqueta: "Atendida" },
  { valor: "cerrada_sin_atender", etiqueta: "Cerrada sin atender" },
] as const;

export const esTipoBandeja = (t: string): t is TipoBandeja => Object.hasOwn(BANDEJAS, t);

/**
 * La sesión, sin exigir el segundo factor. Solo para las pantallas que llevan hasta él:
 * /panel/mfa y /panel/contrasena.
 */
export const exigirSesion = cache(async () => {
  const supabase = await clienteServidor();
  // getClaims verifica la firma del token; getSession no, y no se usa en el servidor.
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) redirect("/panel/entrar");
  return { supabase, claims: data.claims };
});

/**
 * La puerta de cada página y de cada Server Action del panel. NO va en el layout: Next no
 * vuelve a ejecutar el layout al navegar, y una Server Action se puede llamar sin pasar por
 * la página (node_modules/next/dist/docs, guía de autenticación).
 *
 * La RLS exige lo mismo dentro de la base (privado.es_admin): esto solo decide a dónde
 * mandar a la persona; si falla, la base igual no entrega nada.
 */
export const exigirAdmin = cache(async () => {
  const { supabase, claims } = await exigirSesion();
  if (claims.aal !== "aal2") redirect("/panel/mfa");

  const { data: perfil, error } = await supabase
    .from("perfiles")
    .select("nombre, rol, activo")
    .eq("id", claims.sub)
    .maybeSingle();
  if (error) throw new Error(`No se pudo leer el perfil: ${error.message}`);
  if (!perfil?.activo || perfil.rol !== "administrador") redirect("/panel/entrar?aviso=sin-acceso");

  return { supabase, id: claims.sub, nombre: perfil.nombre as string };
});

const FORMATO_FECHA = new Intl.DateTimeFormat("es-PA", {
  timeZone: "America/Panama",
  dateStyle: "medium",
  timeStyle: "short",
});

/** Fecha y hora de Panamá, sin depender de la zona del servidor. */
export const fecha = (iso: string) => FORMATO_FECHA.format(new Date(iso));
