"use client";

import { useActionState } from "react";
import { accionContacto } from "@/app/actions";
import { ESTADO_INICIAL } from "@/lib/estado-formulario";
import { AlternativaWhatsApp } from "@/components/alternativa-whatsapp";
import {
  Area,
  Campo,
  Casilla,
  Enviar,
  Formulario,
  Resultado,
} from "@/components/formulario";

/** Contacto general (RF-10, HU-20). */
export function FormularioContacto() {
  const [estado, accion] = useActionState(accionContacto, ESTADO_INICIAL);
  const e = estado.errores ?? {};

  return (
    <Formulario estado={estado} accion={accion}>
      <Campo
        nombre="nombre"
        etiqueta="¿Cómo te llamas?"
        autoComplete="name"
        error={e.nombre}
      />

      <div className="grid gap-7 sm:grid-cols-2">
        <Campo
          nombre="correo"
          etiqueta="Correo"
          tipo="email"
          opcional
          autoComplete="email"
          error={e.correo}
        />
        <Campo
          nombre="telefono"
          etiqueta="Teléfono"
          tipo="tel"
          opcional
          autoComplete="tel"
          error={e.telefono}
        />
      </div>
      <p className="-mt-4 text-sm text-tinta-suave">Con uno de los dos basta.</p>

      <Campo nombre="asunto" etiqueta="¿De qué se trata?" error={e.asunto} />

      <Area
        nombre="mensaje"
        etiqueta="Tu mensaje"
        filas={6}
        maxLength={2000}
        error={e.mensaje}
      />

      <Casilla nombre="consentimiento" error={e.consentimiento}>
        Autorizo a la Fundación REFUVA a guardar estos datos para responder a mi
        mensaje. Puedo pedir que los borren cuando quiera.
      </Casilla>

      <Resultado
        estado={estado}
        alternativa={<AlternativaWhatsApp texto="Escríbenos por WhatsApp" />}
      >
        <p>Te responderemos por el correo o el teléfono que dejaste.</p>
      </Resultado>

      <Enviar>Enviar mensaje</Enviar>
    </Formulario>
  );
}
