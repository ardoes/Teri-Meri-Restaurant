import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import { MenuPageClient } from "@/components/menu/MenuPageClient";
import { OG_IMAGE_PATH, MENU_URL, SITE_NAME } from "@/lib/site-seo";

const menuTitle = "The Menu · Teri Meri";
const menuDescription =
  "Browse the full Teri Meri menu — biryani, tandoor, Chinese, curries, and more. Order by phone or WhatsApp.";

export const metadata: Metadata = {
  title: "The Menu",
  description: menuDescription,
  alternates: {
    canonical: MENU_URL,
  },
  openGraph: {
    title: menuTitle,
    description: menuDescription,
    type: "website",
    url: MENU_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: OG_IMAGE_PATH,
        alt: "Teri Meri dining room with tables ready for guests",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: menuTitle,
    description: menuDescription,
    images: [OG_IMAGE_PATH],
  },
};

export default function MenuPage() {
  return (
    <CartProvider>
      <MenuPageClient />
    </CartProvider>
  );
}
