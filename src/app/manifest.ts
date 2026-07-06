import type { MetadataRoute } from "next";
import {
  BACKGROUND_COLOR,
  HOME_DESCRIPTION,
  RESTAURANT_NAME,
  SITE_NAME,
  THEME_COLOR,
} from "@/lib/site-seo";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: RESTAURANT_NAME,
    short_name: SITE_NAME,
    description: HOME_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: BACKGROUND_COLOR,
    theme_color: THEME_COLOR,
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
