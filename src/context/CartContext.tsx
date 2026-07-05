"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { MenuItem } from "@/data/menu-data";

export type CartLine = {
  item: MenuItem;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  estimatedTotal: number | null;
  totalNeedsReview: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/** Parse leading numeric price for cart total — mixed PDF formats may be approximate. */
function parseMenuPrice(price: string): number | null {
  const match = price.match(/[\d]+(?:\.\d+)?/);
  if (!match) return null;
  return Number.parseFloat(match[0]);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((item: MenuItem) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.item.id === item.id);
      if (existing) {
        return prev.map((l) =>
          l.item.id === item.id ? { ...l, quantity: l.quantity + 1 } : l
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.item.id !== id));
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setLines((prev) => prev.filter((l) => l.item.id !== id));
      return;
    }
    setLines((prev) =>
      prev.map((l) => (l.item.id === id ? { ...l, quantity } : l))
    );
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const { itemCount, estimatedTotal, totalNeedsReview } = useMemo(() => {
    let count = 0;
    let total = 0;
    let hasNull = false;

    for (const line of lines) {
      count += line.quantity;
      const parsed = parseMenuPrice(line.item.price);
      if (parsed === null) hasNull = true;
      else total += parsed * line.quantity;
    }

    return {
      itemCount: count,
      estimatedTotal: hasNull ? null : total,
      totalNeedsReview: hasNull,
    };
  }, [lines]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      itemCount,
      estimatedTotal,
      totalNeedsReview,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((o) => !o),
      addItem,
      removeItem,
      setQuantity,
      clearCart,
    }),
    [
      lines,
      itemCount,
      estimatedTotal,
      totalNeedsReview,
      isOpen,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function buildWhatsAppOrderMessage(lines: CartLine[]): string {
  const header = "Teri Meri — Order Request\n\n";
  const body = lines
    .map(
      (l, i) =>
        `${i + 1}. ${l.item.name} × ${l.quantity} — ${l.item.price}`
    )
    .join("\n");
  return `${header}${body}\n\nPlease confirm availability and total.`;
}
