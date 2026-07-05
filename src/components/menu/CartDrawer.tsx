"use client";

import {
  buildWhatsAppOrderMessage,
  useCart,
} from "@/context/CartContext";
import {
  RESTAURANT_PHONE,
  RESTAURANT_PHONE_DISPLAY,
  WHATSAPP_ORDER_URL,
} from "@/lib/contact";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function CartActionLink({
  href,
  className,
  fill,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  fill: "orange" | "green";
}) {
  return (
    <a
      href={href}
      className={cn(
        "cart-btn btn",
        fill === "orange" ? "cart-btn--orange" : "cart-btn--green",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export function CartDrawer() {
  const {
    lines,
    itemCount,
    estimatedTotal,
    totalNeedsReview,
    isOpen,
    closeCart,
    setQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  const whatsAppHref =
    lines.length > 0
      ? `${WHATSAPP_ORDER_URL}?text=${encodeURIComponent(buildWhatsAppOrderMessage(lines))}`
      : WHATSAPP_ORDER_URL;

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        className={cn(
          "fixed inset-0 z-[9991] bg-espresso/40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={closeCart}
        aria-hidden={!isOpen}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        aria-hidden={!isOpen}
        className={cn(
          "fixed right-0 top-0 z-[9992] flex h-full w-full max-w-md flex-col border-l border-line bg-cream-soft shadow-2xl transition-transform duration-500 ease-[var(--ease-out-expo)]",
          isOpen ? "translate-x-0" : "pointer-events-none translate-x-full"
        )}
      >
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <p className="eyebrow mb-1">Your order</p>
            <h2 className="font-display text-2xl text-espresso">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-full border border-line px-3 py-1.5 text-sm text-muted transition-colors hover:border-orange hover:text-espresso"
            aria-label="Close cart"
          >
            Close
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <p className="py-12 text-center text-muted">
              Your cart is empty. Add dishes from the menu to begin.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {lines.map(({ item, quantity }) => (
                <li key={item.id} className="py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display text-lg text-espresso">
                        {item.name}
                      </p>
                      <p className="mt-1 text-sm text-muted">{item.price}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="shrink-0 text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-orange"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      type="button"
                      aria-label={`Decrease ${item.name} quantity`}
                      onClick={() => setQuantity(item.id, quantity - 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-lg transition-colors hover:border-orange"
                    >
                      −
                    </button>
                    <span className="min-w-[2ch] text-center tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={`Increase ${item.name} quantity`}
                      onClick={() => setQuantity(item.id, quantity + 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-lg transition-colors hover:border-orange"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="border-t border-line px-6 py-5">
          {lines.length > 0 ? (
            <>
              <div className="mb-4 flex items-baseline justify-between">
                <span className="text-sm uppercase tracking-[0.18em] text-muted">
                  Estimated total
                </span>
                <span className="font-display text-2xl text-espresso tabular-nums">
                  {estimatedTotal !== null
                    ? `${estimatedTotal.toFixed(0)} SR`
                    : "NEEDS REVIEW"}
                </span>
              </div>
              {totalNeedsReview ? (
                <p className="mb-4 text-xs text-muted">
                  Confirm final total when ordering.
                </p>
              ) : null}
              <div className="flex flex-col gap-3">
                <CartActionLink
                  href={`tel:${RESTAURANT_PHONE}`}
                  fill="orange"
                  className="w-full justify-center"
                  data-cursor="hover"
                >
                  Call to Order · {RESTAURANT_PHONE_DISPLAY}
                </CartActionLink>
                <CartActionLink
                  href={whatsAppHref}
                  fill="green"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full justify-center"
                  data-cursor="hover"
                >
                  WhatsApp Order
                </CartActionLink>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-center text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-orange"
                >
                  Clear cart
                </button>
              </div>
            </>
          ) : (
            <CartActionLink
              href={`tel:${RESTAURANT_PHONE}`}
              fill="orange"
              className="w-full justify-center"
              data-cursor="hover"
            >
              Call to Order · {RESTAURANT_PHONE_DISPLAY}
            </CartActionLink>
          )}
        </footer>
      </aside>
    </>,
    document.body
  );
}
