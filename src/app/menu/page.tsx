import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import { MenuPageClient } from "@/components/menu/MenuPageClient";

export const metadata: Metadata = {
  title: "The Menu",
  description:
    "Browse the full Teri Meri menu — biryani, tandoor, Chinese, curries, and more. Order by phone or WhatsApp.",
};

export default function MenuPage() {
  return (
    <CartProvider>
      <MenuPageClient />
    </CartProvider>
  );
}
