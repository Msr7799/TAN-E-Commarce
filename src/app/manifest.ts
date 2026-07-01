import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/constants";

// ============================================================
// Web App Manifest configuration
// ============================================================

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#5BB8F5",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
        purpose: "any",
      },
    ],
  };
}
