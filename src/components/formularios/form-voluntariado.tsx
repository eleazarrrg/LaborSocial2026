"use client";

import { useActionState } from "react";
import { accionVoluntariado } from "@/app/actions";
import { ESTADO_INICIAL } from "@/lib/estado-formulario";
import { AREAS_VOLUNTARIADO } from "@/lib/opciones";
import { AlternativaWhatsApp } from "@/components/alternativa-whatsapp";
import {
  Area,
  Campo,
  Casilla,
  Casillas,
  Enviar,
  Formulario,
  Resultado,
} from "@/components/formulario";

/** Inscripción de voluntariado (RF-03, HU-12). */
export function FormularioVoluntariado() {
  const [estado, accion] = useActionState(accionVoluntariado, ESTADO_INICIAL);
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
          opcional
          autoComplete="tel"
          error={e.telefono}
        />
      </div>
      <p className="-mt-4 text-sm text-tinta-suave">
        El correo sí hace falta: por ahí coordinamos cada jornada.
      </p>

      <Casillas
        nombre="areas"
        etiqueta="¿En qué puedes apoyar?"
        opciones={AREAS_VOLUNTARIADO}
        ayuda="Marca todas las que quieras. Sirve para avisarte solo de lo que te interesa."
        error={e.areas}
      />

      <Campo
        nombre="otraArea"
        etiqueta="Si marcaste «Otra», ¿cuál?"
        opcional
        error={e.otraArea}
      />

      <Campo
        nombre="disponibilidad"
        etiqueta="¿Cuándo puedes?"
        opcional
        placeholder="Por ejemplo: fines de semana, una vez al mes"
        error={e.disponibilidad}
      />

      <Area
        nombre="experiencia"
        etiqueta="¿Algo que debamos saber?"
        opcional
        filas={3}
        maxLength={500}
        ayuda="Experiencia previa, un oficio, un vehículo. Lo que se te ocurra."
        error={e.experiencia}
      />

      <Casilla nombre="consentimiento" error={e.consentimiento}>
        Autorizo a la Fundación REFUVA a guardar estos datos para contactarme
        sobre actividades de voluntariado. Puedo pedir que los borren cuando
        quiera.
      </Casilla>

      <Resultado
        estado={estado}
        alternativa={<AlternativaWhatsApp texto="Escríbenos por WhatsApp" />}
      >
        <p>
          Te escribiremos al correo que dejaste cuando haya una actividad en las áreas que
          marcaste.
        </p>
      </Resultado>

      <Enviar>Quiero ser voluntario</Enviar>
    </Formulario>
  );
}
