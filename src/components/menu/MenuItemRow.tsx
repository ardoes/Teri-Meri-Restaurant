"use client";

import type { MenuItem } from "@/data/menu-data";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { SliceButton } from "@/components/ui/SliceButton";

type MenuItemRowProps = {
  item: MenuItem;
};

export function MenuItemRow({ item }: MenuItemRowProps) {
  const { addItem } = useCart();
  const isVeg = item.tags.some((t) => t.toLowerCase().includes("veg"));

  return (
    <article className="menu-dish group relative py-5 md:py-6" data-cursor="hover">
      <span
        className="absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-orange to-green transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:h-[70%]"
        aria-hidden
      />

      <div className="flex flex-col gap-3 pl-1 transition-[padding] duration-500 ease-[var(--ease-out-expo)] group-hover:pl-4">
        {/* Mobile: name on its own line */}
        <h4 className="font-sans text-[1.05rem] font-semibold leading-snug text-espresso transition-colors duration-400 group-hover:text-orange sm:hidden md:text-[1.125rem]">
          {item.name}
        </h4>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          {/* Desktop: name + leader + calories */}
          <div className="hidden min-w-0 flex-1 items-baseline sm:flex sm:pr-2">
            <h4 className="shrink-0 font-sans text-[1.05rem] font-semibold leading-snug text-espresso transition-colors duration-400 group-hover:text-orange md:text-[1.125rem]">
              {item.name}
            </h4>
            <span
              className="menu-dish-leader mx-3 mb-1 min-w-[1.5rem] flex-1 border-b border-dotted border-line md:mx-4"
              aria-hidden
            />
            <span className="shrink-0 pl-4 font-sans text-[0.62rem] font-medium tracking-[0.14em] text-muted uppercase md:pl-6">
              {item.calories}
            </span>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end sm:gap-5">
            <span className="font-sans text-[0.62rem] font-medium tracking-[0.14em] text-muted uppercase sm:hidden">
              {item.calories}
            </span>

            {item.tags.length > 0 ? (
              <p className="hidden text-[0.62rem] font-sans font-medium tracking-[0.14em] text-muted uppercase lg:block">
                {item.tags.map((tag, i) => (
                  <span key={tag}>
                    {i > 0 ? " · " : ""}
                    <span
                      className={cn(
                        tag.toLowerCase().includes("veg") && "text-green"
                      )}
                    >
                      {tag}
                    </span>
                  </span>
                ))}
              </p>
            ) : null}

            <p className="font-display text-lg tabular-nums text-green md:text-xl">
              {item.price}
            </p>

            <SliceButton
              variant="orange"
              onClick={() => addItem(item)}
              className="shrink-0 px-5 py-2.5 text-[0.72rem] tracking-[0.12em] uppercase"
              data-cursor="hover"
            >
              Add
            </SliceButton>
          </div>
        </div>
      </div>

      {item.tags.length > 0 ? (
        <p className="mt-2 pl-1 font-sans text-[0.62rem] tracking-[0.12em] text-muted uppercase lg:hidden">
          {item.tags.map((tag, i) => (
            <span key={tag}>
              {i > 0 ? " · " : ""}
              <span
                className={cn(
                  isVeg && tag.toLowerCase().includes("veg") && "text-green"
                )}
              >
                {tag}
              </span>
            </span>
          ))}
        </p>
      ) : null}
    </article>
  );
}
