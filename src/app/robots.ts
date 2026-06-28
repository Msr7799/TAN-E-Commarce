import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants";

// ============================================================
// Robots.txt generator
// ============================================================

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/checkout",
        "/cart",
        "/admin",
        "/api/",
        "/private/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
