/**
 * Estado que devuelven las acciones de formulario.
 *
 * Vive aquí y no en app/actions.ts porque un módulo marcado con "use server"
 * solo debe exportar funciones asíncronas. El tipo y el estado inicial los
 * necesita el componente de cliente, así que van en un módulo neutro que
 * ambos lados pueden importar sin arrastrarse cosas el uno al otro.
 */

export type EstadoFormulario = {
  /** error: hay algo que corregir · fallo: falló nuestro lado · enviado: está guardado. */
  estado: "inicial" | "error" | "fallo" | "enviado";
  errores?: Record<string, string>;
  mensaje?: string;
  /** Lo que la persona escribió, para no hacérselo escribir otra vez. */
  valores?: Record<string, string | string[]>;
};

export const ESTADO_INICIAL: EstadoFormulario = { estado: "inicial" };

/** Campo oculto que solo llena un bot. Nombre poco obvio a propósito. */
export const CAMPO_TRAMPA = "ref_interna_7";
