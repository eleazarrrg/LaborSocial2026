---
target: pagina de inicio
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 4
target_identity: "file:E:\\Proyectos Codigo\\Trabajos\\LaborSocial\\src\\app\\page.tsx"
target_fingerprint: "sha256:b51bad06c7591eb1bb752f23a7804ba5adee1dce0d2b82e85643beb7ee7421d7"
target_path: "E:\\Proyectos Codigo\\Trabajos\\LaborSocial\\src\\app\\page.tsx"
timestamp: 2026-10-06T00-34-55Z
slug: src-app-page-tsx
---
# Crítica — Inicio (src/app/page.tsx) — 2026-10-05

## Veredicto de especificidad
Genérico. Lo único tomado de REFUVA es la paleta. El árbol Ψ (public/marca/institucional.png) no se usa en ninguna página; el encabezado muestra una «R» de plantilla. Seis logos de proyecto existen y el índice no los muestra. El afiche de Una Estrella Otiliana está en disco y la ficha dice «Sin logo todavía». Fraunces + Inter es la pareja tipográfica por defecto de la IA (el detector: Inter = 70-86 % del texto).
Detector CLI: 0 hallazgos (verificado con archivo trampa). Navegador: oversized-h1 (88px, 79 car., 29vh), line-length 92 car. en /agendar-cita; falsos positivos: rayas de foto pendiente, selector de tema, aviso del pie.

## Heurísticas — 21/32 (n/a: 7, 10)
1 Estado 2 · 2 Mundo real 3 · 3 Control 3 · 4 Consistencia 2 · 5 Prevención 3 · 6 Reconocer 3 · 7 n/a · 8 Estética 2 · 9 Recuperación 3 · 10 n/a

## Problemas prioritarios
- [P1] Marca real ausente; «R» de plantilla → árbol Ψ en encabezado, pie y hero. (bolder)
- [P1] La amplitud se dice, no se ve → proyectos visibles con sus logos en la primera pantalla; idea: hojas del árbol = proyectos, corazón = campañas. (layout + bolder)
- [P1] Primer CTA y más fuerte es «Donar» en un sitio al que llega gente en crisis; 6 CTA en la primera pantalla → un primario, el resto enlaces. (distill)
- [P1] Huecos y notas internas públicas: 4 «foto pendiente», «Pendiente de conectar», «Sin logo todavía», «Prototipo en revisión» → ocultar evidencia sin fotos, usar el afiche de Otiliana. (harden)
- [P2] Datos de relleno en el índice (—, →, ✎, = 1) y tipografía Fraunces + Inter → cifras solo reales, dedicatoria «en honor a…»; nueva pareja tipográfica. (typeset)

## Personas
- Nuevo: entiende de inmediato; luego ni un rostro, logo ni foto; las cajas grises restan credibilidad.
- Móvil lento: 7.880 px de alto a 390; cuarto CTA a 38px del borde.
- En crisis desde WhatsApp: banda correcta; pero el botón más fuerte pide dinero antes de reconocerla.

## Menores
Comentario «verde profundo» obsoleto en banda-crisis.tsx; selector de tema en la nav principal; «8» repetido 4 veces; cierre salmón chillón en oscuro; tres nombres para «agendar cita».
