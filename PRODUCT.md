# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Persona en crisis o pidiendo ayuda psicológica.** Llega desde un enlace de WhatsApp, a menudo
  con un teléfono viejo, datos caros y sol de frente. Su trabajo: encontrar un número que conteste
  ya (911, Línea 147) o pedir una cita de B/.15.00 sin contar su historia clínica.
- **Padrino, madrina o voluntario.** Quiere ayudar en algo concreto —un regalo de Navidad, una
  jornada de comida en la calle— sin escribirle por chat a Edwin.
- **Donante y patrocinador.** Necesita evidencia de que esto pasa de verdad antes de dar dinero.
- **Edwin Quintero**, psicólogo y única persona que opera la fundación. Publica y oculta contenido
  desde el panel cuando el equipo de servicio social ya se haya ido.

## Product Purpose

Portal público + panel de la Fundación REFUVA (Panamá). Existe para desmentir una percepción: que
REFUVA «solo ve el tema de salud mental». Son ocho proyectos y dos campañas. Éxito: que en 10
segundos se entienda que es un catálogo de frentes, no un solo tema; que las citas salgan de
WhatsApp a un flujo con registro; que padrinos y voluntarios se inscriban solos; que donar no
tenga fricción.

## Positioning

Cada proyecto nació de una historia y va en honor a alguien — Una Estrella Otiliana por Otilia, la
abuela de Edwin; Háblame Panamá por Jessica; Grupo Un Solo Corazón por la pandemia. Una fundación
que da terapia **en la calle**, con abrazos, y además reparte comida, cuida perros y gatos, y lleva
la Navidad a niños que nunca la han tenido. Ninguna ONG genérica puede contar eso.

## Operating Context

- Campañas con fecha dura: prevención del suicidio del 10 de agosto al 10 de septiembre; Navidad.
- La evidencia de las jornadas hoy vive en el OneDrive personal de Edwin.
- Instagram oficial: @refuva_pma. Correo: refuva.panama@gmail.com.

## Capabilities and Constraints

- Catálogo: ocho proyectos (`/proyectos/{codigo}`) y dos campañas (`/campanas/{codigo}`), en
  colecciones separadas; viene una tercera campaña. El conteo se deriva de `src/lib/catalogo.ts`.
- Next.js 16 + Tailwind 4 + Supabase. El sitio no procesa pagos: Yappy y ACH.
- Banda de crisis permanente con **solo** 911 y Línea 147 (MIDES, WhatsApp 6694-2747). La 169 y el
  INSAM no se publican sin verificación telefónica.
- Contenido sobre suicidio con guía de mensajes seguros (CLAUDE.md §5.1).
- Sin datos de menores en v1. Bilingüe español/inglés andamiado; v1 sale en español.

## Brand Commitments

- Nombre: REFUVA = **Resiliente · Fuerte · Valiente**.
- Logo institucional: árbol cuyo tronco es la letra Ψ, con cerebro y corazón
  (`public/marca/institucional.png`, único con transparencia).
- Ocho logos propios de proyectos y campañas (`public/marca/`), PNG opacos.
- Colores medidos del logo (marrón, naranja, turquesa, rojo) y colores de campaña que no se tocan:
  ámbar del lazo de prevención del suicidio, verde del lazo de salud mental.
- Español de Panamá. Moneda escrita `B/.15.00`.
- **Preferencia permanente, elegida por el equipo el 5 de octubre de 2026:** el estándar del sector,
  ejecutado sin ironía, con **Mind** (mind.org.uk) como vara de acabado. Se eligió por encima de una
  dirección propia asignada por sorteo (la bolsa de donación) y de otras tres alternativas.

## Evidence on Hand

- Misión, visión, ocho valores y tres principios, por escrito (`docs/00-fuentes/hechos-verificados.md` §8).
- Textos oficiales de cada proyecto y campaña.
- Cifras dichas por Edwin: de 50 a más de 100 raciones por jornada; más de 30 escuelas en lista de
  espera; tercer año de la campaña navideña y de la de prevención.
- Una cita de Edwin sobre la campaña en la calle («se formaron filas para hablar con los psicólogos»).
- **Ausencias que no se pueden inventar:** no hay ni una fotografía de actividad; no hay logo de
  Psicoeducativo ni de Psicoempresarial; no hay testimonios de beneficiarios; no hay alianzas
  confirmadas para publicar.

## Product Principles

1. Muchos frentes antes que un tema: ninguna decisión puede hacer que el sitio parezca solo de
   salud mental.
2. Quien está en crisis va primero: el camino a un número que conteste nunca está a más de un toque.
3. La historia de cada proyecto es contenido, no adorno.
4. Nada que dependa del equipo después de la entrega: Edwin edita solo.
5. Evidencia real o nada: un hueco honesto vale más que una foto de banco.

## Accessibility & Inclusion

WCAG 2.2 AA obligatorio; la legibilidad es un requisito de seguridad. Público con teléfonos viejos,
datos caros y personas en crisis. Core Web Vitals: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.
