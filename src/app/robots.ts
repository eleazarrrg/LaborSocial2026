import type { MetadataRoute } from "next";
import { sitioIndexable, URL_SITIO } from "@/lib/sitio";

// Lee INDEXAR al atender la petición, no al compilar.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  if (!sitioIndexable()) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${URL_SITIO}/sitemap.xml`,
  };
}
