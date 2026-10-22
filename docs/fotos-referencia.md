# Fotos de referencia

> **Estas fotos NO son de la Fundación REFUVA.** Son fotos de archivo, puestas el 22 de octubre de 2026
> para que el sitio se vea completo mientras llegan las de la fundación. **No se publica el sitio con
> ellas** (es un pendiente bloqueante de `09-operacion-y-traspaso.md`): un sitio de una fundación mostrando
> fotos que no son suyas como si lo fueran es un problema de honestidad, aunque sea temporal.

## De dónde vienen

Las 15 vienen de [Unsplash](https://unsplash.com) y se usan bajo la
[Licencia de Unsplash](https://unsplash.com/license): uso comercial y no comercial, sin pedir permiso y sin
obligación de dar crédito (se agradece). Se verificó en octubre de 2026; si la licencia cambia, vale la
vigente al momento de publicar.

Se eligieron con criterios deliberados:

- **Sin personas reconocibles.** Manos, objetos, animales, paisajes. Por la regla de `06-inventario-contenido.md`
  §3.4: una foto de niños o de personas en situación de calle necesita consentimiento, y una foto de archivo
  no lo resuelve. Tampoco se usó una foto genérica de personas presas para «Rompiendo el Círculo».
- **Sin marcas, logos ni texto legible.** La de las bolsas de comida se recortó para quitar el logo de una panadería.
- **Solo fotos gratuitas de Unsplash**, nunca las «Unsplash+», que son de pago.
- Se revisaron una por una con los ojos, no solo por su descripción.

## Cuáles son

| Archivo | Dónde va | Autor | Original |
|---|---|---|---|
| `inicio-portada.jpg` | `inicio:portada` | Jacqueline Brandwayn | [rhHIEtBPD5A](https://unsplash.com/photos/rhHIEtBPD5A) |
| `inicio-ayuda-dificil.jpg` | `inicio:ayudaDificil` | Tijs van Leur | [ox9Y-Ad--_k](https://unsplash.com/photos/ox9Y-Ad--_k) |
| `inicio-ayuda-cita.jpg` | `inicio:ayudaCita` | Craig Lovelidge | [SqgSOjRyjzU](https://unsplash.com/photos/SqgSOjRyjzU) |
| `inicio-ayuda-participar.jpg` | `inicio:ayudaParticipar` | Hannah Busing | [Zyx1bK9mqmA](https://unsplash.com/photos/Zyx1bK9mqmA) |
| `inicio-declaracion.jpg` | `inicio:declaracion` | Harris Vo | [ZX6BPboJrYk](https://unsplash.com/photos/ZX6BPboJrYk) |
| `psicoeducativo.jpg` | `proyecto:psicoeducativo` | Nathan Cima | [Qw6wa96IvvQ](https://unsplash.com/photos/Qw6wa96IvvQ) |
| `psicoempresarial.jpg` | `proyecto:psicoempresarial` | FORTYTWO | [MDu-53qRVr4](https://unsplash.com/photos/MDu-53qRVr4) |
| `rompiendo-el-circulo.jpg` | `proyecto:rompiendo-el-circulo` | Howard Walsh | [LInAe_7b1HA](https://unsplash.com/photos/LInAe_7b1HA) |
| `historias-que-sanan.jpg` | `proyecto:historias-que-sanan` | Marcos Paulo Prado | [tcyW6Im5Uug](https://unsplash.com/photos/tcyW6Im5Uug) |
| `grupo-un-solo-corazon.jpg` | `proyecto:grupo-un-solo-corazon` | Maria Lin Kim | [8RaUEd8zD-U](https://unsplash.com/photos/8RaUEd8zD-U) |
| `una-estrella-otiliana.jpg` | `proyecto:una-estrella-otiliana` | Juliana Malta | [YwutubGmzSU](https://unsplash.com/photos/YwutubGmzSU) |
| `comida-en-la-calle.jpg` | `proyecto:comida-en-la-calle` | Louis Hansel | [QLQj_CaNG-Y](https://unsplash.com/photos/QLQj_CaNG-Y) |
| `angelitos-de-la-calle.jpg` | `proyecto:angelitos-de-la-calle` | Jeevan Katel | [VtsKx6BC9GM](https://unsplash.com/photos/VtsKx6BC9GM) |
| `hablame-panama.jpg` | `proyecto:hablame-panama` | Sebastien Gabriel | [-IMlv9Jlb24](https://unsplash.com/photos/-IMlv9Jlb24) |
| `escuchame-panama.jpg` | `proyecto:escuchame-panama` | Mathias Reding | [Xbch-973w6Y](https://unsplash.com/photos/Xbch-973w6Y) |

Los archivos ya reducidos (2000 px) están en `contenido-provisional/fotos/`, y el manifiesto con los textos
alternativos y los recortes, en `contenido-provisional/fotos.json`.

## Cómo se ponen y cómo se reemplazan

- **Ponerlas:** `npm run sembrar` las sube a la biblioteca de imágenes marcadas como **«Foto de referencia»**
  (con su autor y enlace) y las asigna a cada espacio que esté vacío. No pisa lo que ya puso la fundación.
- **Encontrarlas:** el inicio del panel dice «N fotos de referencia sin reemplazar», con un enlace a la lista.
- **Reemplazar una:** en el panel, abrir el proyecto (o **Sitio → Fondos del inicio**), elegir otra foto
  en su espacio y guardar. Cuando ya no se use la de referencia, borrarla de la biblioteca (solo administración).
- **Regenerarlas:** `node scripts/preparar-fotos.mjs` vuelve a bajar y reducir las del manifiesto.

## Antes de publicar el sitio

- [ ] El inicio del panel ya no muestra el aviso de fotos de referencia (cero sin reemplazar).
- [ ] Cada foto nueva tiene su texto alternativo y, si salen niños o personas en situación de calle, su
      consentimiento registrado (la biblioteca no deja guardarla sin él).
