"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MENU_NAV, MENU_NAV_PRIMARY_COUNT } from "@/data/menu-data";
import { cn } from "@/lib/utils";

type CategoryNavProps = {
  activeId: string;
  onNavigate: (id: string) => void;
};

function NavLink({
  item,
  isActive,
  onNavigate,
}: {
  item: (typeof MENU_NAV)[number];
  isActive: boolean;
  onNavigate: (id: string) => void;
}) {
  return (
    <button
      type="button"
      data-id={item.id}
      onClick={() => onNavigate(item.id)}
      data-cursor="hover"
      className={cn(
        "menu-cat-link group relative shrink-0 px-3 py-2.5 md:px-4",
        isActive ? "text-orange" : "text-muted"
      )}
      aria-current={isActive ? "true" : undefined}
    >
      <span
        className={cn(
          "mr-2 font-sans text-[0.62rem] font-bold tracking-[0.28em] uppercase",
          isActive ? "text-green" : "text-green/60 group-hover:text-green"
        )}
      >
        {item.chapter}
      </span>
      <span
        className={cn(
          "font-sans text-[0.78rem] font-semibold tracking-[0.08em] uppercase transition-colors duration-400 md:text-[0.82rem]",
          !isActive && "group-hover:text-espresso"
        )}
      >
        {item.label}
      </span>
      <span
        className={cn(
          "absolute inset-x-3 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-orange to-green transition-transform duration-500 ease-[var(--ease-out-expo)] md:inset-x-4",
          isActive ? "scale-x-0" : "group-hover:scale-x-100"
        )}
        aria-hidden
      />
    </button>
  );
}

function NavRow({
  items,
  activeId,
  onNavigate,
  rowRef,
  indicatorRef,
}: {
  items: (typeof MENU_NAV)[number][];
  activeId: string;
  onNavigate: (id: string) => void;
  rowRef: React.RefObject<HTMLDivElement | null>;
  indicatorRef: React.RefObject<HTMLSpanElement | null>;
}) {
  const rowHasActive = items.some((item) => item.id === activeId);

  return (
    <div
      ref={rowRef}
      className="relative flex flex-wrap justify-center gap-x-1 gap-y-2 md:justify-start md:gap-x-2"
    >
      {rowHasActive ? (
        <span
          ref={indicatorRef}
          className="menu-cat-indicator pointer-events-none absolute bottom-0 left-0 h-[2px] transition-[transform,width] duration-500 ease-[var(--ease-out-expo)]"
          aria-hidden
        />
      ) : null}
      {items.map((item) => (
        <NavLink
          key={item.id}
          item={item}
          isActive={activeId === item.id}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}

export function CategoryNav({ activeId, onNavigate }: CategoryNavProps) {
  const [isMobile, setIsMobile] = useState(false);
  const primaryRowRef = useRef<HTMLDivElement>(null);
  const secondaryRowRef = useRef<HTMLDivElement>(null);
  const primaryIndicatorRef = useRef<HTMLSpanElement>(null);
  const secondaryIndicatorRef = useRef<HTMLSpanElement>(null);

  const primaryNav = MENU_NAV.slice(0, MENU_NAV_PRIMARY_COUNT);
  const secondaryNav = MENU_NAV.slice(MENU_NAV_PRIMARY_COUNT);
  const activeOnSecondaryRow = secondaryNav.some((item) => item.id === activeId);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const rowRef = activeOnSecondaryRow ? secondaryRowRef : primaryRowRef;
    const indicatorRef = activeOnSecondaryRow
      ? secondaryIndicatorRef
      : primaryIndicatorRef;

    if (!rowRef.current || !indicatorRef.current) return;

    const activeBtn = rowRef.current.querySelector<HTMLButtonElement>(
      `[data-id="${activeId}"]`
    );
    if (!activeBtn) return;

    const rowRect = rowRef.current.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    indicatorRef.current.style.width = `${btnRect.width}px`;
    indicatorRef.current.style.transform = `translateX(${btnRect.left - rowRect.left}px)`;
  }, [activeId, activeOnSecondaryRow, isMobile]);

  const handleSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onNavigate(e.target.value);
    },
    [onNavigate]
  );

  return (
    <nav
      aria-label="Menu categories"
      className="menu-cat-nav relative z-10 border-b border-line/60 bg-cream pt-2 md:pt-4"
    >
      <div className="container-tm py-3 md:py-4">
        {isMobile ? (
          <label className="flex flex-col gap-2">
            <span className="eyebrow text-green">Chapter</span>
            <select
              value={activeId}
              onChange={handleSelect}
              className="w-full appearance-none border-b-2 border-line bg-transparent py-3 font-sans text-base font-semibold text-espresso outline-none focus:border-orange"
            >
              {MENU_NAV.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.chapter} — {item.label}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div className="flex flex-col gap-2.5 md:gap-3">
            <NavRow
              items={primaryNav}
              activeId={activeId}
              onNavigate={onNavigate}
              rowRef={primaryRowRef}
              indicatorRef={primaryIndicatorRef}
            />
            <NavRow
              items={secondaryNav}
              activeId={activeId}
              onNavigate={onNavigate}
              rowRef={secondaryRowRef}
              indicatorRef={secondaryIndicatorRef}
            />
          </div>
        )}
      </div>
    </nav>
  );
}

export function scrollToMenuSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const head = el.querySelector(".menu-chapter-head");
  const target = head ?? el;
  const top = target.getBoundingClientRect().top + window.scrollY - 96;
  window.scrollTo({ top, behavior: "smooth" });
}
