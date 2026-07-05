"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MENU_CATEGORIES } from "@/data/menu-data";
import {
  CategoryNav,
  scrollToMenuSection,
} from "@/components/menu/CategoryNav";
import { CartDrawer } from "@/components/menu/CartDrawer";
import { FloatingCartButton } from "@/components/menu/FloatingCartButton";
import { MenuHero } from "@/components/menu/MenuHero";
import { MenuSearch } from "@/components/menu/MenuSearch";
import { MenuSection } from "@/components/menu/MenuSection";
import { MenuPageFooter } from "@/components/menu/MenuPageFooter";
import { MENU_SEARCH_HASH, HEADER_OFFSET } from "@/lib/scroll-constants";
import { runHashScroll } from "@/lib/scroll-nav";

export function MenuPageClient() {
  const [activeId, setActiveId] = useState(MENU_CATEGORIES[0]?.id ?? "");
  const [searchQuery, setSearchQuery] = useState("");
  const navigatingRef = useRef(false);

  const handleNavigate = useCallback((id: string) => {
    setActiveId(id);
    navigatingRef.current = true;
    scrollToMenuSection(id);
    window.setTimeout(() => {
      navigatingRef.current = false;
    }, 900);
  }, []);

  useEffect(() => {
    window.history.scrollRestoration = "manual";

    const hash = window.location.hash;
    if (hash === MENU_SEARCH_HASH) {
      runHashScroll(MENU_SEARCH_HASH, { duration: 0.95, retries: 5 });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    }

    return () => {
      window.history.scrollRestoration = "auto";
    };
  }, []);

  useEffect(() => {
    const sections = MENU_CATEGORIES.map((c) =>
      document.getElementById(c.id)
    ).filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (navigatingRef.current) return;

        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: `-${HEADER_OFFSET + 120}px 0px -50% 0px`,
        threshold: [0, 0.12, 0.3, 0.5],
      }
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="menu-page">
      <MenuHero />
      <MenuSearch query={searchQuery} onQueryChange={setSearchQuery} />
      <CategoryNav activeId={activeId} onNavigate={handleNavigate} />

      <div className="relative border-t border-line">
        {MENU_CATEGORIES.map((section, i) => (
          <MenuSection
            key={section.id}
            section={section}
            chapter={String(i + 1).padStart(2, "0")}
          />
        ))}
      </div>

      <MenuPageFooter />

      <CartDrawer />
      <FloatingCartButton />
    </div>
  );
}
