"use client";

import { useActionState } from "react";
import { accionPadrino } from "@/app/actions";
import { ESTADO_INICIAL } from "@/lib/estado-formulario";
import { FORMAS_ENTREGA } from "@/lib/opciones";
import { AlternativaWhatsApp } from "@/components/alternativa-whatsapp";
import {
  Area,
  Campo,
  Casilla,
  Enviar,
  Formulario,
  Opciones,
  Resultado,
} from "@/components/formulario";

/**
 * Inscripción de padrinos y madrinas (RF-03, HU-13).
 *
 * Dos cosas que este formulario NO hace, y ambas son deliberadas:
 *
 * 1. NO pide ni un solo dato del niño apadrinado. El emparejamiento ocurre
 *    fuera de línea (X-06). No existe una tabla de niños y no va a existir.
 * 2. NO sugiere un monto. Edwin fue explícito: el regalo es «conforme a lo que
 *    salga de su corazón», la fundación no estima nada. Poner un monto
 *    sugerido cambiaría el proyecto.
 */
export function FormularioPadrino() {
  const [estado, accion] = useActionState(accionPadrino, ESTADO_INICIAL);
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
          autoComplete="email"
          error={e.correo}
        />
        <Campo
          nombre="telefono"
          etiqueta="Teléfono"
          tipo="tel"
          autoComplete="tel"
          error={e.telefono}
        />
      </div>
      <p className="-mt-4 text-sm text-tinta-suave">
        Los dos, porque la entrega del regalo se coordina con fecha fija.
      </p>

      <Campo
        nombre="cantidadNinos"
        etiqueta="¿A cuántos niños o niñas quieres apadrinar?"
        tipo="number"
        min={1}
        max={10}
        porDefecto="1"
        error={e.cantidadNinos}
      />

      <Opciones
        nombre="formaEntrega"
        etiqueta="¿Cómo prefieres hacer llegar el regalo?"
        opciones={FORMAS_ENTREGA}
        error={e.formaEntrega}
      />

      <Area
        nombre="comentario"
        etiqueta="¿Quieres decirnos algo más?"
        opcional
        filas={3}
        maxLength={400}
        error={e.comentario}
      />

      <Casilla nombre="consentimiento" error={e.consentimiento}>
        Autorizo a la Fundación REFUVA a guardar estos datos para coordinar el
        apadrinamiento. Puedo pedir que los borren cuando quiera.
      </Casilla>

      <Resultado
        estado={estado}
        alternativa={<AlternativaWhatsApp texto="Escríbenos por WhatsApp" />}
      >
        <p>
          Gracias por sumarte a Una Estrella Otiliana. Te contactaremos antes de la fiesta para
          coordinar la entrega.
        </p>
      </Resultado>

      <Enviar>Quiero apadrinar</Enviar>
    </Formulario>
  );
}
