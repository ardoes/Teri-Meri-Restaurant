"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

export function FloatingCartButton() {
  const { itemCount, toggleCart, isOpen } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <button
      type="button"
      onClick={toggleCart}
      aria-label={`Open cart, ${itemCount} items`}
      aria-expanded={isOpen}
      data-cursor="hover"
      className={cn(
        "fixed bottom-6 right-6 z-[9990] flex h-14 min-w-14 items-center justify-center gap-2 rounded-full border-2 border-espresso/15 bg-cream px-4 shadow-[0_8px_32px_rgba(38,27,22,0.22)] transition-transform duration-300 hover:scale-105 md:bottom-8 md:right-8",
        isOpen && "scale-95"
      )}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="text-espresso"
      >
        <path
          d="M6 6h15l-1.5 9h-12L6 6Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M6 6 5 3H2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="9.5" cy="19.5" r="1.5" fill="currentColor" />
        <circle cx="17.5" cy="19.5" r="1.5" fill="currentColor" />
      </svg>
      {itemCount > 0 ? (
        <span className="font-display text-lg tabular-nums text-orange">
          {itemCount}
        </span>
      ) : null}
    </button>,
    document.body
  );
}
