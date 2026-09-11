"use client";

import { useActionState } from "react";
import { accionCita } from "@/app/actions";
import { ESTADO_INICIAL } from "@/lib/estado-formulario";
import { MODALIDADES } from "@/lib/opciones";
import { AlternativaWhatsApp } from "@/components/alternativa-whatsapp";
import {
  Area,
  Campo,
  Casilla,
  Enviar,
  Opciones,
  Resultado,
} from "@/components/formulario";

/**
 * Solicitud de cita psicológica (RF-02, HU-09).
 *
 * Este es el formulario más delicado del sitio y se diseñó con esa idea
 * encima:
 *
 * - El MOTIVO es opcional. Nadie debería tener que explicar por qué está mal
 *   para poder pedir ayuda.
 * - No se pide diagnóstico, ni síntomas, ni medicación, ni relato clínico.
 *   Lo que no se recoge no se puede filtrar (RNF-09).
 * - Basta con un correo O un teléfono. No todo el mundo tiene correo.
 * - La casilla de consentimiento nunca viene premarcada.
 * - «Necesito atención pronto» existe (HU-37) y solo marca el aviso interno;
 *   no promete nada que la fundación no pueda cumplir.
 */
export function FormularioCita() {
  const [estado, accion] = useActionState(accionCita, ESTADO_INICIAL);
  const e = estado.errores ?? {};

  return (
    <form action={accion} className="space-y-7" noValidate>
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
      <p className="-mt-4 text-sm text-tinta-suave">
        Con uno de los dos basta. Es para poder responderte.
      </p>

      <Opciones
        nombre="modalidad"
        etiqueta="¿Cómo prefieres la sesión?"
        opciones={MODALIDADES.map((m) => ({
          valor: m.valor,
          etiqueta: m.etiqueta,
        }))}
        porDefecto="cualquiera"
        error={e.modalidad}
      />

      <Area
        nombre="motivo"
        etiqueta="¿Sobre qué te gustaría hablar?"
        opcional
        filas={3}
        maxLength={280}
        ayuda="Una línea basta, y puedes dejarlo en blanco. No hace falta que expliques nada aquí."
        error={e.motivo}
      />

      <Campo
        nombre="disponibilidad"
        etiqueta="¿Qué días u horas te vienen bien?"
        opcional
        placeholder="Por ejemplo: tardes entre semana"
        error={e.disponibilidad}
      />

      <Casilla nombre="atencionPronto">
        Necesito atención pronto.
      </Casilla>

      <Casilla nombre="consentimiento" error={e.consentimiento}>
        Autorizo a la Fundación REFUVA a guardar estos datos para contactarme
        sobre mi solicitud. Puedo pedir que los borren cuando quiera.
      </Casilla>

      <Resultado
        estado={estado}
        alternativa={<AlternativaWhatsApp texto="Escríbenos por WhatsApp" />}
      />

      <div className="flex flex-wrap items-center gap-4">
        <Enviar>Enviar solicitud</Enviar>
        <p className="text-sm text-tinta-suave">
          Te responderemos por el medio que dejaste.
        </p>
      </div>
    </form>
  );
}
