/**
 * Estado que devuelven las acciones de formulario.
 *
 * Vive aquí y no en app/actions.ts porque un módulo marcado con "use server"
 * solo debe exportar funciones asíncronas. El tipo y el estado inicial los
 * necesita el componente de cliente, así que van en un módulo neutro que
 * ambos lados pueden importar sin arrastrarse cosas el uno al otro.
 */

export type EstadoFormulario = {
  estado: "inicial" | "error" | "prototipo";
  errores?: Record<string, string>;
  mensaje?: string;
};

export const ESTADO_INICIAL: EstadoFormulario = { estado: "inicial" };
