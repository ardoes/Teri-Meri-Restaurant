import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import { MenuPageClient } from "@/components/menu/MenuPageClient";
import {
  getMenuJsonLd,
  jsonLdScript,
  MENU_DESCRIPTION,
  MENU_KEYWORDS,
  MENU_TITLE,
  MENU_URL,
  OG_IMAGE_METADATA,
  SITE_NAME,
} from "@/lib/site-seo";

export const metadata: Metadata = {
  title: "The Menu",
  description: MENU_DESCRIPTION,
  keywords: MENU_KEYWORDS,
  alternates: {
    canonical: MENU_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: MENU_TITLE,
    description: MENU_DESCRIPTION,
    type: "website",
    locale: "en_SA",
    url: MENU_URL,
    siteName: SITE_NAME,
    images: [OG_IMAGE_METADATA],
  },
  twitter: {
    card: "summary_large_image",
    title: MENU_TITLE,
    description: MENU_DESCRIPTION,
    images: [OG_IMAGE_METADATA.url],
  },
};

export default function MenuPage() {
  const menuJsonLd = getMenuJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(menuJsonLd),
        }}
      />
      <CartProvider>
        <MenuPageClient />
      </CartProvider>
    </>
  );
}
