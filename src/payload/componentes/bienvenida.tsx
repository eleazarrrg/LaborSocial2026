import Link from "next/link";
import type { ServerProps } from "payload";
import { esAdmin, esEquipo } from "../acceso";

/**
 * Lo primero que se ve al entrar al panel: un saludo, lo que esta persona puede hacer y los cuatro
 * trabajos más comunes a un clic. Quien lleva menos de 30 días con su cuenta ve además los
 * «Primeros pasos». No guarda nada: sale de la sesión y de la fecha de creación de la cuenta.
 */

const ACCIONES = [
  { href: "/admin/collections/noticias/create", titulo: "Publicar una noticia", ayuda: "Cuenta algo que pasó." },
  { href: "/admin/collections/eventos/create", titulo: "Anunciar un evento", ayuda: "Una jornada con su fecha." },
  { href: "/admin/collections/medios/create", titulo: "Subir una foto", ayuda: "Se usa en proyectos y noticias." },
  {
    href: "/admin/collections/preguntas/create",
    titulo: "Añadir una pregunta frecuente",
    ayuda: "Una respuesta que se repite.",
  },
] as const;

const DIAS_DE_BIENVENIDA = 30;

type Sesion = { nombre?: string | null; createdAt?: string | null } | null;

/** Días desde una fecha. Fuera del componente: el reloj es una lectura impura y no va dentro del render. */
const diasDesde = (fecha: string): number => (Date.now() - new Date(fecha).getTime()) / 86_400_000;

export async function Bienvenida({ user }: ServerProps) {
  if (!esEquipo(user)) return null;

  const sesion = user as unknown as Sesion;
  const primerNombre = (sesion?.nombre ?? "").trim().split(/\s+/)[0] ?? "";
  const dias = sesion?.createdAt ? diasDesde(sesion.createdAt) : Infinity;
  const esNueva = dias < DIAS_DE_BIENVENIDA;
  const admin = esAdmin(user);

  return (
    <section className="bienvenida" aria-labelledby="bienvenida-titulo">
      <div className="bienvenida__cabecera">
        <div>
          <h2 id="bienvenida-titulo">{primerNombre ? `Hola, ${primerNombre}` : "Hola"}</h2>
          <p>
            {admin
              ? "Administras el panel: atiendes las solicitudes de las personas y publicas el contenido del sitio."
              : "Publicas y ocultas el contenido del sitio. Las solicitudes de las personas solo las ve administración."}
          </p>
        </div>
        <a className="bienvenida__sitio" href="/" target="_blank" rel="noopener noreferrer">
          Ver el sitio <span aria-hidden="true">↗</span>
          <span className="bienvenida__oculto"> (se abre en otra pestaña)</span>
        </a>
      </div>

      <ul className="bienvenida__acciones">
        {ACCIONES.map((a) => (
          <li key={a.href}>
            <Link href={a.href}>
              <strong>{a.titulo}</strong>
              <span>{a.ayuda}</span>
            </Link>
          </li>
        ))}
      </ul>

      {esNueva && (
        <div className="bienvenida__pasos">
          <h3>Primeros pasos</h3>
          <ol>
            <li>
              Cambia la contraseña temporal en <Link href="/admin/account">tu cuenta</Link>.
            </li>
            <li>Cierra la sesión y vuelve a entrar para comprobar que tu código del teléfono funciona.</li>
            <li>
              Publica una noticia de prueba y luego ocúltala.{" "}
              <Link href="/admin/collections/noticias/create">Probar ahora</Link>
            </li>
          </ol>
        </div>
      )}
    </section>
  );
}
