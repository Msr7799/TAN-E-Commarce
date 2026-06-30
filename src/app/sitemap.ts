import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants";
import { getAllProductSlugs } from "@/services/products";

// ============================================================
// sitemap.xml generator
// ============================================================

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const routes = ["", "/shop", "/about", "/faq", "/contact", "/cart", "/profile"].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic product routes
  try {
    const productSlugs = await getAllProductSlugs();
    const productRoutes = productSlugs.map((slug) => ({
      url: `${SITE_URL}/products/${slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...routes, ...productRoutes];
  } catch {
    return routes;
  }
}
