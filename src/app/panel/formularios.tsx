"use client";

import { useActionState } from "react";
import { Campo, Enviar } from "@/components/formulario";
import {
  accionContrasena,
  accionEnrolar,
  accionEntrar,
  accionOlvide,
  accionVerificar,
  type EstadoPanel,
} from "./acciones";

/** Formularios de acceso al panel. La validación y la seguridad viven en acciones.ts. */

const INICIAL: EstadoPanel = {};

function Mensaje({ estado, tono = "error" }: { estado: EstadoPanel; tono?: "error" | "info" }) {
  if (!estado.mensaje) return null;
  return (
    <p
      role={tono === "error" ? "alert" : "status"}
      className={`rounded-lg border px-4 py-3 font-medium text-tinta ${
        tono === "error" ? "border-valiente/40 bg-valiente-tenue" : "border-fuerte/30 bg-fuerte-tenue"
      }`}
    >
      {estado.mensaje}
    </p>
  );
}

export function FormEntrar() {
  const [estado, accion] = useActionState(accionEntrar, INICIAL);
  return (
    <form action={accion} className="space-y-6" noValidate>
      <Campo nombre="correo" etiqueta="Correo" tipo="email" autoComplete="username" />
      <Campo
        nombre="contrasena"
        etiqueta="Contraseña"
        tipo="password"
        autoComplete="current-password"
      />
      <Mensaje estado={estado} />
      <Enviar>Entrar</Enviar>
    </form>
  );
}

export function FormOlvide() {
  const [estado, accion] = useActionState(accionOlvide, INICIAL);
  return (
    <form action={accion} className="space-y-4" noValidate>
      <Campo nombre="correo" etiqueta="Correo de tu cuenta" tipo="email" autoComplete="username" />
      <Mensaje estado={estado} tono="info" />
      <Enviar>Enviarme el enlace</Enviar>
    </form>
  );
}

export function FormContrasena() {
  const [estado, accion] = useActionState(accionContrasena, INICIAL);
  return (
    <form action={accion} className="space-y-6" noValidate>
      <Campo
        nombre="contrasena"
        etiqueta="Contraseña nueva"
        tipo="password"
        autoComplete="new-password"
        ayuda="Al menos 12 caracteres, con una mayúscula, una minúscula y un número."
      />
      <Campo
        nombre="repetir"
        etiqueta="Repítela"
        tipo="password"
        autoComplete="new-password"
      />
      <Mensaje estado={estado} />
      <Enviar>Guardar contraseña</Enviar>
    </form>
  );
}

function FormCodigo({
  accion,
  factorId,
  siguiente,
}: {
  accion: (formData: FormData) => void;
  factorId: string;
  siguiente: string;
}) {
  return (
    <form action={accion} className="space-y-6" noValidate>
      <input type="hidden" name="factorId" value={factorId} />
      <input type="hidden" name="siguiente" value={siguiente} />
      <Campo
        nombre="codigo"
        etiqueta="Código de seis números"
        autoComplete="one-time-code"
        ayuda="El que muestra ahora tu aplicación de códigos. Cambia cada 30 segundos."
      />
      <Enviar>Verificar</Enviar>
    </form>
  );
}

/** Ya tiene el segundo factor: solo pide el código. */
export function VerificarCodigo({ factorId, siguiente }: { factorId: string; siguiente: string }) {
  const [estado, accion] = useActionState(accionVerificar, INICIAL);
  return (
    <div className="space-y-4">
      <Mensaje estado={estado} />
      <FormCodigo accion={accion} factorId={factorId} siguiente={siguiente} />
    </div>
  );
}

/**
 * Primera vez: genera el QR (desde una acción, no al cargar la página: crear un factor es
 * un cambio, y una página no cambia nada solo por abrirse), y luego pide el primer código.
 * Si el código falla, el QR sigue en pantalla: lo guarda el estado de `preparar`.
 */
export function Enrolar({ siguiente }: { siguiente: string }) {
  const [factor, preparar] = useActionState(accionEnrolar, INICIAL);
  const [verificado, verificar] = useActionState(accionVerificar, INICIAL);

  if (!factor.factorId || !factor.qr) {
    return (
      <form action={preparar} className="space-y-4">
        <Mensaje estado={factor} />
        <Enviar>Configurar mi aplicación de códigos</Enviar>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <ol className="list-decimal space-y-2 pl-5 text-tinta-suave">
        <li>
          Abre una aplicación de códigos en tu teléfono (Google Authenticator, Microsoft
          Authenticator u otra).
        </li>
        <li>Escanea este código QR con ella.</li>
        <li>Escribe abajo los seis números que te muestra.</li>
      </ol>
      {/* El QR es un SVG en data: URI que genera Supabase; no sale a ningún servicio externo. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={factor.qr}
        alt="Código QR para configurar la aplicación de códigos"
        width={200}
        height={200}
        className="rounded-lg border border-borde bg-white p-3"
      />
      <p className="text-sm text-tinta-suave">
        ¿No puedes escanear? Escribe esta clave en la aplicación:{" "}
        <code className="rounded bg-papel-alto px-1.5 py-0.5 break-all text-tinta">
          {factor.secreto}
        </code>
      </p>
      <Mensaje estado={verificado} />
      <FormCodigo accion={verificar} factorId={factor.factorId} siguiente={siguiente} />
    </div>
  );
}
