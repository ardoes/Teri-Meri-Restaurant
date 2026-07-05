"use client";

import { useRef } from "react";
import type { MenuCategory } from "@/data/menu-data";
import { MenuItemRow } from "@/components/menu/MenuItemRow";
import { gsap, useGSAP } from "@/lib/gsap";
import { bindSectionScrollEffects } from "@/lib/section-drift";

type MenuSectionProps = {
  section: MenuCategory;
  chapter: string;
};

export function MenuSection({ section, chapter }: MenuSectionProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduced || !root.current) return;

      bindSectionScrollEffects(root.current, {
        contentSelector: ".menu-chapter-body",
        headingSelector: ".menu-chapter-title",
      });

      root.current.querySelectorAll(".menu-dish").forEach((dish, i) => {
        gsap.from(dish, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          delay: (i % 4) * 0.04,
          ease: "expo.out",
          scrollTrigger: {
            trigger: dish,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id={section.id}
      className="menu-chapter relative scroll-mt-28 md:scroll-mt-32"
    >
      <span
        className="pointer-events-none absolute -right-2 top-20 -z-10 select-none font-display text-[clamp(4rem,14vw,9rem)] leading-none md:top-28"
        aria-hidden
      >
        <span className="text-green/[0.07]">{chapter}</span>
      </span>

      <header className="menu-chapter-head relative pb-8 pt-14 md:pb-10 md:pt-20">
        <div className="container-tm">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex h-2 w-2 rounded-full bg-orange"
              aria-hidden
            />
            <span className="eyebrow text-green">{chapter}</span>
          </div>
          <h2 className="menu-chapter-title chapter-heading-exit mt-4 font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.92] text-espresso">
            {section.category}
          </h2>
          <div className="menu-chapter-rule mt-5 flex h-[3px] w-full max-w-md overflow-hidden rounded-full">
            <span className="h-full flex-[2] bg-orange" />
            <span className="h-full flex-1 bg-green" />
          </div>
        </div>
      </header>

      <div className="menu-chapter-body container-tm relative pb-16 md:pb-24">
        <div className="space-y-12 md:space-y-14">
          {section.subsections.map((sub) => (
            <div key={sub.id} id={sub.id} className="scroll-mt-28">
              {section.subsections.length > 1 ? (
                <div className="mb-6 flex items-center gap-3 pb-1">
                  <span className="h-px w-6 bg-orange" aria-hidden />
                  <h3 className="font-sans text-[0.72rem] font-bold tracking-[0.28em] text-green uppercase">
                    {sub.title}
                  </h3>
                </div>
              ) : null}
              <div className="menu-dish-list divide-y divide-line/80">
                {sub.items.map((item) => (
                  <MenuItemRow key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
