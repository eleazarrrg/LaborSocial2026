"use server";

import { z } from "zod";
import { POLITICA_VERSION } from "@/lib/contacto";
import { CAMPO_TRAMPA, type EstadoFormulario } from "@/lib/estado-formulario";
import {
  esquemaCita,
  esquemaContacto,
  esquemaPadrino,
  esquemaVoluntariado,
} from "@/lib/esquemas";
import { clienteServicio } from "@/lib/supabase/servicio";

/**
 * Acciones de servidor de los formularios.
 *
 * El orden es el de CLAUDE.md §4 y no se altera:
 *   1. validar con Zod
 *   2. si el campo trampa viene lleno, el envío va a la cuarentena (nada se descarta)
 *   3. INSERT en Postgres  ← síncrono, y es lo único crítico
 *   4. devolver éxito al usuario
 * Los correos (n8n/Resend) reaccionan después, desde la base. Si fallan, la solicitud ya está
 * guardada. Si falla el paso 3, se le dice a la persona con todas sus letras y se le da
 * WhatsApp: nunca un «recibido» sin haber recibido.
 */

type Tabla =
  | "solicitudes_cita"
  | "inscripciones_voluntariado"
  | "inscripciones_padrinos"
  | "mensajes_contacto";

type Fila = Record<string, unknown>;

const FALLO: EstadoFormulario = {
  estado: "fallo",
  mensaje:
    "No pudimos guardar tu envío. No es culpa tuya: falló algo de nuestro lado. Inténtalo de nuevo en un rato, o escríbenos por WhatsApp.",
};

const ENVIADO: EstadoFormulario = { estado: "enviado" };

const CONVOCATORIA_CERRADA: EstadoFormulario = {
  estado: "error",
  mensaje:
    "La convocatoria de padrinos y madrinas no está abierta en este momento. Escríbenos y te avisamos cuando abra.",
};

function aplanarErrores(error: z.ZodError): Record<string, string> {
  const errores: Record<string, string> = {};
  for (const issue of error.issues) {
    const campo = String(issue.path[0] ?? "_");
    // El primer error por campo es el que se muestra: más de uno abruma.
    if (!errores[campo]) errores[campo] = issue.message;
  }
  return errores;
}

/**
 * Lo que la persona escribió, para devolvérselo si hay que corregir algo: React vacía el
 * formulario al terminar la acción, y volver a escribirlo todo es la forma más rápida de
 * que alguien que pide ayuda desista. No se devuelve la trampa ni el consentimiento, que
 * se vuelve a marcar a mano (RNF-10).
 */
function valoresDe(formData: FormData): Record<string, string | string[]> {
  const valores: Record<string, string | string[]> = {};
  for (const clave of new Set(formData.keys())) {
    if (clave.startsWith("$") || clave === CAMPO_TRAMPA || clave === "consentimiento") continue;
    const todos = formData.getAll(clave).filter((v) => typeof v === "string");
    valores[clave] = todos.length > 1 ? todos : (todos[0] ?? "");
  }
  return valores;
}

/** Sin el contenido: el `details` de Postgres trae la fila entera, con datos personales. */
function registrar(donde: string, error: unknown) {
  const { code, message } =
    error && typeof error === "object" && "message" in error
      ? (error as { code?: string; message: string })
      : { code: undefined, message: String(error) };
  console.error(`[formularios] ${donde}: ${code ?? "sin código"} ${message}`);
}

async function procesar<T extends z.ZodType>(
  tabla: Tabla,
  esquema: T,
  formData: FormData,
  crudo: Record<string, unknown>,
  aFila: (datos: z.output<T>) => Promise<Fila | EstadoFormulario> | Fila,
): Promise<EstadoFormulario> {
  const resultado = esquema.safeParse(crudo);
  if (!resultado.success) {
    return {
      estado: "error",
      errores: aplanarErrores(resultado.error),
      mensaje: "Revisa los campos marcados.",
      valores: valoresDe(formData),
    };
  }

  try {
    const supabase = clienteServicio();

    // Un humano no ve el campo trampa; un bot lo llena. Se guarda aparte, ya validado y
    // recortado, por si era alguien de verdad (RNF-22). Al bot se le responde lo de siempre.
    if (formData.get(CAMPO_TRAMPA)) {
      const { error } = await supabase.from("envios_en_cuarentena").insert({
        formulario: tabla,
        motivo_rechazo: "campo_trampa",
        carga: resultado.data,
      });
      if (error) {
        registrar(`cuarentena ${tabla}`, error);
        return { ...FALLO, valores: valoresDe(formData) };
      }
      return ENVIADO;
    }

    const fila = await aFila(resultado.data);
    if ("estado" in fila) return { ...(fila as EstadoFormulario), valores: valoresDe(formData) };

    // Sin `.select()`: el rol del servidor no puede leer estas tablas (ver servicio.ts).
    const { error } = await supabase.from(tabla).insert({
      ...fila,
      consentimiento_en: new Date().toISOString(),
      politica_version: POLITICA_VERSION,
    });

    if (error?.code === "23505" && tabla === "inscripciones_padrinos") {
      return {
        estado: "error",
        errores: { correo: "Este correo ya está inscrito en esta convocatoria." },
        mensaje: "Ya tenemos tu inscripción. Si quieres cambiar algo, escríbenos y lo ajustamos.",
        valores: valoresDe(formData),
      };
    }
    // El disparador de la base cerró la puerta entre la consulta y el INSERT.
    if (error?.code === "23514" && tabla === "inscripciones_padrinos") {
      return CONVOCATORIA_CERRADA;
    }
    if (error) {
      registrar(`insertar ${tabla}`, error);
      return { ...FALLO, valores: valoresDe(formData) };
    }
    return ENVIADO;
  } catch (error) {
    registrar(`procesar ${tabla}`, error);
    return { ...FALLO, valores: valoresDe(formData) };
  }
}

function texto(formData: FormData, campo: string): string {
  const valor = formData.get(campo);
  return typeof valor === "string" ? valor : "";
}

/* ------------------------------------------------------------------ Cita */

export async function accionCita(
  _previo: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  return procesar(
    "solicitudes_cita",
    esquemaCita,
    formData,
    {
      nombre: texto(formData, "nombre"),
      correo: texto(formData, "correo"),
      telefono: texto(formData, "telefono"),
      contactoPreferido: texto(formData, "contactoPreferido"),
      modalidad: texto(formData, "modalidad"),
      motivo: texto(formData, "motivo"),
      disponibilidad: texto(formData, "disponibilidad"),
      atencionPronto: formData.get("atencionPronto") ?? undefined,
      consentimiento: formData.get("consentimiento") ?? "",
    },
    (d) => ({
      nombre: d.nombre,
      correo: d.correo ?? null,
      telefono: d.telefono ?? null,
      contacto_preferido: d.contactoPreferido,
      motivo: d.motivo ?? null,
      modalidad: d.modalidad,
      disponibilidad: d.disponibilidad ?? null,
      atencion_pronto: d.atencionPronto === "on",
    }),
  );
}

/* ---------------------------------------------------------- Voluntariado */

export async function accionVoluntariado(
  _previo: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  return procesar(
    "inscripciones_voluntariado",
    esquemaVoluntariado,
    formData,
    {
      nombre: texto(formData, "nombre"),
      correo: texto(formData, "correo"),
      telefono: texto(formData, "telefono"),
      areas: formData.getAll("areas").filter((a) => typeof a === "string"),
      otraArea: texto(formData, "otraArea"),
      disponibilidad: texto(formData, "disponibilidad"),
      experiencia: texto(formData, "experiencia"),
      consentimiento: formData.get("consentimiento") ?? "",
    },
    (d) => ({
      nombre: d.nombre,
      correo: d.correo,
      telefono: d.telefono ?? null,
      areas_interes: [...new Set(d.areas)],
      // Si no marcó «Otra», lo que haya escrito ahí no se guarda.
      otra_area: d.areas.includes("otra") ? (d.otraArea ?? null) : null,
      disponibilidad: d.disponibilidad ?? null,
      experiencia: d.experiencia ?? null,
    }),
  );
}

/* --------------------------------------------------------- Apadrinamiento */

export async function accionPadrino(
  _previo: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  return procesar(
    "inscripciones_padrinos",
    esquemaPadrino,
    formData,
    {
      nombre: texto(formData, "nombre"),
      correo: texto(formData, "correo"),
      telefono: texto(formData, "telefono"),
      cantidadNinos: texto(formData, "cantidadNinos"),
      formaEntrega: texto(formData, "formaEntrega"),
      comentario: texto(formData, "comentario"),
      consentimiento: formData.get("consentimiento") ?? "",
    },
    async (d) => {
      // La convocatoria la busca el servidor; nunca se confía en un id que mande el formulario.
      const ahora = new Date().toISOString();
      const { data, error } = await clienteServicio()
        .from("convocatorias")
        .select("id")
        .eq("proyecto_slug", "una-estrella-otiliana")
        .eq("tipo", "padrinos")
        .eq("cerrada_manualmente", false)
        .lte("abre_en", ahora)
        .gt("cierra_en", ahora)
        .maybeSingle();
      if (error) throw error;
      if (!data) return CONVOCATORIA_CERRADA;

      return {
        convocatoria_id: data.id,
        nombre: d.nombre,
        correo: d.correo,
        telefono: d.telefono,
        cantidad_ninos: d.cantidadNinos,
        forma_entrega: d.formaEntrega,
        comentario: d.comentario ?? null,
      };
    },
  );
}

/* -------------------------------------------------------------- Contacto */

export async function accionContacto(
  _previo: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  return procesar(
    "mensajes_contacto",
    esquemaContacto,
    formData,
    {
      nombre: texto(formData, "nombre"),
      correo: texto(formData, "correo"),
      telefono: texto(formData, "telefono"),
      asunto: texto(formData, "asunto"),
      mensaje: texto(formData, "mensaje"),
      consentimiento: formData.get("consentimiento") ?? "",
    },
    (d) => ({
      nombre: d.nombre,
      correo: d.correo ?? null,
      telefono: d.telefono ?? null,
      asunto: d.asunto,
      mensaje: d.mensaje,
    }),
  );
}
