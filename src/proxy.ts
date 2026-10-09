import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy (en Next.js 16 ya no se llama middleware). Solo corre en /admin.
 *
 * payload-totp necesita conocer la ruta en sus componentes de servidor para decidir si mandar a
 * configurar o verificar el código; sin esta cabecera entra en un bucle de redirecciones (ver su
 * README). No decide quién entra: eso lo hacen Payload y payload-totp en cada petición.
 */
export function proxy(request: NextRequest) {
  const respuesta = NextResponse.next();
  respuesta.headers.append("x-pathname", request.nextUrl.pathname);
  return respuesta;
}

export const config = {
  matcher: ["/admin/:path*"],
};
