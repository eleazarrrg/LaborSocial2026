"use client";

import { useFormStatus } from "react-dom";
import { createContext, useContext, type ReactNode } from "react";
import { CAMPO_TRAMPA, type EstadoFormulario } from "@/lib/estado-formulario";

/**
 * Primitivas de formulario.
 *
 * Sin librería de formularios. La validación de verdad ocurre en el servidor
 * con Zod (src/app/actions.ts) y estos componentes solo pintan el resultado.
 * Es la decisión correcta para este público: menos JavaScript que descargar en
 * un teléfono modesto con datos caros, y el formulario sigue funcionando si el
 * JavaScript falla.
 *
 * Accesibilidad: cada campo tiene <label> asociada, los errores se enlazan con
 * aria-describedby y se marcan con aria-invalid, y el área táctil mínima es de
 * 44 px — por encima de los 24×24 que exige WCAG 2.2 (2.5.8).
 */

/** Lo que la persona ya escribió, si la acción devolvió un error. */
const Valores = createContext<EstadoFormulario["valores"]>(undefined);

function useValor(nombre: string): string | undefined {
  const v = useContext(Valores)?.[nombre];
  return Array.isArray(v) ? v[0] : v;
}

function useMarcado(nombre: string, valor: string): boolean | undefined {
  const valores = useContext(Valores);
  if (!valores) return undefined;
  const v = valores[nombre];
  return Array.isArray(v) ? v.includes(valor) : v === valor;
}

/* ------------------------------------------------------------- Formulario */

/**
 * El `<form>` de todos los formularios públicos. Devuelve lo escrito si hay que corregir
 * algo, y lleva el campo trampa: fuera de la pantalla, fuera del orden de tabulación y
 * oculto a los lectores de pantalla, así que solo un bot lo llena (RNF-22).
 */
export function Formulario({
  estado,
  accion,
  children,
}: {
  estado: EstadoFormulario;
  accion: (formData: FormData) => void;
  children: ReactNode;
}) {
  return (
    <Valores.Provider value={estado.valores}>
      <form action={accion} className="space-y-7" noValidate>
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={CAMPO_TRAMPA}>No llenes este campo</label>
          <input
            id={CAMPO_TRAMPA}
            name={CAMPO_TRAMPA}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>
        {children}
      </form>
    </Valores.Provider>
  );
}

const BASE_CONTROL =
  "w-full rounded-lg border bg-superficie px-3.5 py-3 text-tinta placeholder:text-tinta-suave/80 transition-colors";

function clasesControl(error?: string) {
  return `${BASE_CONTROL} ${
    error
      ? "border-valiente ring-1 ring-valiente/30"
      : "border-borde-fuerte hover:border-tinta-suave"
  }`;
}

function Etiqueta({
  htmlFor,
  children,
  opcional,
}: {
  htmlFor: string;
  children: ReactNode;
  opcional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="block font-medium">
      {children}
      {opcional && (
        <span className="ml-1.5 font-normal text-tinta-suave">(opcional)</span>
      )}
    </label>
  );
}

function Error({ id, mensaje }: { id: string; mensaje?: string }) {
  if (!mensaje) return null;
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-valiente">
      {mensaje}
    </p>
  );
}

function Ayuda({ id, texto }: { id: string; texto?: string }) {
  if (!texto) return null;
  return (
    <p id={id} className="mt-1 text-sm text-tinta-suave">
      {texto}
    </p>
  );
}

/* ----------------------------------------------------------------- Campo */

export function Campo({
  nombre,
  etiqueta,
  tipo = "text",
  opcional,
  ayuda,
  error,
  autoComplete,
  placeholder,
  porDefecto,
  min,
  max,
}: {
  nombre: string;
  etiqueta: string;
  tipo?: "text" | "email" | "tel" | "number";
  opcional?: boolean;
  ayuda?: string;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
  porDefecto?: string;
  min?: number;
  max?: number;
}) {
  const valor = useValor(nombre) ?? porDefecto;
  const idAyuda = `${nombre}-ayuda`;
  const idError = `${nombre}-error`;
  return (
    <div>
      <Etiqueta htmlFor={nombre} opcional={opcional}>
        {etiqueta}
      </Etiqueta>
      <Ayuda id={idAyuda} texto={ayuda} />
      <input
        id={nombre}
        name={nombre}
        type={tipo}
        min={min}
        max={max}
        defaultValue={valor}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [ayuda && idAyuda, error && idError].filter(Boolean).join(" ") ||
          undefined
        }
        className={`mt-2 ${clasesControl(error)}`}
      />
      <Error id={idError} mensaje={error} />
    </div>
  );
}

/* ------------------------------------------------------------------ Área */

export function Area({
  nombre,
  etiqueta,
  opcional,
  ayuda,
  error,
  filas = 4,
  maxLength,
  placeholder,
}: {
  nombre: string;
  etiqueta: string;
  opcional?: boolean;
  ayuda?: string;
  error?: string;
  filas?: number;
  maxLength?: number;
  placeholder?: string;
}) {
  const valor = useValor(nombre);
  const idAyuda = `${nombre}-ayuda`;
  const idError = `${nombre}-error`;
  return (
    <div>
      <Etiqueta htmlFor={nombre} opcional={opcional}>
        {etiqueta}
      </Etiqueta>
      <Ayuda id={idAyuda} texto={ayuda} />
      <textarea
        defaultValue={valor}
        id={nombre}
        name={nombre}
        rows={filas}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [ayuda && idAyuda, error && idError].filter(Boolean).join(" ") ||
          undefined
        }
        className={`mt-2 resize-y ${clasesControl(error)}`}
      />
      <Error id={idError} mensaje={error} />
    </div>
  );
}

/* ----------------------------------------------------------- Opción única */

export function Opciones({
  nombre,
  etiqueta,
  opciones,
  error,
  ayuda,
  porDefecto,
}: {
  nombre: string;
  etiqueta: string;
  opciones: ReadonlyArray<{ valor: string; etiqueta: string }>;
  error?: string;
  ayuda?: string;
  porDefecto?: string;
}) {
  const valores = useContext(Valores);
  const marcado = (v: string) => (valores ? valores[nombre] === v : undefined);
  const idError = `${nombre}-error`;
  return (
    <fieldset>
      <legend className="font-medium">{etiqueta}</legend>
      <Ayuda id={`${nombre}-ayuda`} texto={ayuda} />
      <div className="mt-3 flex flex-wrap gap-2.5">
        {opciones.map((o) => (
          <label
            key={o.valor}
            className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg border border-borde-fuerte bg-superficie px-4 py-2.5 transition-colors hover:bg-papel-alto has-checked:border-fuerte has-checked:bg-fuerte-tenue"
          >
            <input
              type="radio"
              name={nombre}
              value={o.valor}
              defaultChecked={marcado(o.valor) ?? porDefecto === o.valor}
              className="size-4 accent-[var(--color-fuerte)]"
            />
            <span>{o.etiqueta}</span>
          </label>
        ))}
      </div>
      <Error id={idError} mensaje={error} />
    </fieldset>
  );
}

/* --------------------------------------------------------- Opción múltiple */

export function Casillas({
  nombre,
  etiqueta,
  opciones,
  error,
  ayuda,
}: {
  nombre: string;
  etiqueta: string;
  opciones: ReadonlyArray<{ valor: string; etiqueta: string }>;
  error?: string;
  ayuda?: string;
}) {
  const valores = useContext(Valores);
  const marcadas = valores?.[nombre] ?? [];
  return (
    <fieldset>
      <legend className="font-medium">{etiqueta}</legend>
      <Ayuda id={`${nombre}-ayuda`} texto={ayuda} />
      <div className="mt-3 flex flex-wrap gap-2.5">
        {opciones.map((o) => (
          <label
            key={o.valor}
            className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg border border-borde-fuerte bg-superficie px-4 py-2.5 transition-colors hover:bg-papel-alto has-checked:border-fuerte has-checked:bg-fuerte-tenue"
          >
            <input
              type="checkbox"
              name={nombre}
              value={o.valor}
              defaultChecked={marcadas.includes(o.valor)}
              className="size-4 accent-[var(--color-fuerte)]"
            />
            <span>{o.etiqueta}</span>
          </label>
        ))}
      </div>
      <Error id={`${nombre}-error`} mensaje={error} />
    </fieldset>
  );
}

/* --------------------------------------------------------------- Casilla */

export function Casilla({
  nombre,
  error,
  children,
}: {
  nombre: string;
  error?: string;
  children: ReactNode;
}) {
  // Nunca premarcada; solo se conserva si la persona la marcó y hubo que corregir otra cosa.
  // La acción no devuelve el consentimiento, así que ese siempre se vuelve a marcar a mano.
  const marcada = useMarcado(nombre, "on");
  return (
    <div>
      {/* Nunca premarcada. Es un requisito, no un detalle (RNF-10). */}
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          id={nombre}
          name={nombre}
          defaultChecked={marcada}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${nombre}-error` : undefined}
          className="mt-1 size-5 shrink-0 accent-[var(--color-fuerte)]"
        />
        <span className="text-tinta-suave">{children}</span>
      </label>
      <Error id={`${nombre}-error`} mensaje={error} />
    </div>
  );
}

/* --------------------------------------------------------------- Enviar */

export function Enviar({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 items-center justify-center rounded-lg bg-fuerte px-7 py-3.5 font-semibold text-papel transition-all duration-150 hover:-translate-y-px disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Enviando…" : children}
    </button>
  );
}

/* ------------------------------------------------------------- Resultado */

export function Resultado({
  estado,
  alternativa,
  children,
}: {
  estado: EstadoFormulario;
  alternativa: ReactNode;
  /** Qué pasa ahora, en palabras de este formulario. */
  children: ReactNode;
}) {
  if (estado.estado === "inicial") return null;

  if (estado.estado === "error") {
    return (
      <p
        role="alert"
        className="rounded-lg border border-valiente/40 bg-valiente-tenue px-4 py-3 font-medium text-tinta"
      >
        {estado.mensaje}
      </p>
    );
  }

  if (estado.estado === "fallo") {
    return (
      <div
        role="alert"
        className="rounded-lg border border-valiente/40 bg-valiente-tenue px-4 py-4 text-tinta"
      >
        <p className="font-medium">{estado.mensaje}</p>
        <div className="mt-3">{alternativa}</div>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="rounded-xl border-2 border-fuerte/30 bg-fuerte-tenue px-5 py-5"
    >
      <p className="font-display text-xl font-semibold">Recibido. Ya está guardado.</p>
      <div className="mt-2 space-y-2 text-tinta-suave">{children}</div>
    </div>
  );
}
