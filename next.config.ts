import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

/**
 * Cabeceras de seguridad para todo el sitio y el panel. Sin CSP de scripts todavía: Next y el
 * panel de Payload usan scripts en línea, y una política con nonce se agrega aparte, con su prueba.
 * Lo que sí va desde ya: nadie puede meter el sitio en un iframe ajeno (clickjacking).
 */
const CABECERAS = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: CABECERAS }];
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
