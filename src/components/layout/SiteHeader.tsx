"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePageNavigate } from "@/components/providers/PageTransition";
import { cn } from "@/lib/utils";
import {
  HOME_HERO_HASH,
  HOME_HERO_PATH,
  MENU_SEARCH_HASH,
  MENU_SEARCH_PATH,
  scrollToHash,
  scrollToMenuSearch,
  scrollToTop,
} from "@/lib/scroll-nav";
import { Wordmark } from "@/components/ui/Wordmark";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Magnetic } from "@/components/ui/Magnetic";

const NAV = [
  { label: "Story", href: "/#story" },
  { label: "Menu", href: "/menu" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { navigate } = usePageNavigate();
  const isMenuPage = pathname === "/menu";
  const [scrolled, setScrolled] = useState(false);
  const [scrollUp, setScrollUp] = useState(true);
  const lastY = useRef(0);

  const handleWordmarkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      if (pathname === "/") {
        window.history.pushState(null, "", HOME_HERO_HASH);
        scrollToTop({ immediate: true });
        return;
      }

      navigate(HOME_HERO_PATH, { scroll: false });
    },
    [pathname, navigate]
  );

  const handleOrderNowClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname !== "/menu") return;

      e.preventDefault();
      window.history.pushState(null, "", MENU_SEARCH_HASH);
      scrollToMenuSearch({ duration: 1.05 });
    },
    [pathname]
  );

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (href.startsWith("/#")) {
        e.preventDefault();
        const hash = href.slice(1);

        if (pathname !== "/") {
          navigate(`/${hash}`, { scroll: false });
          return;
        }

        window.history.pushState(null, "", hash);
        scrollToHash(hash, { duration: 1.1 });
        return;
      }

      if (href === "/menu") {
        e.preventDefault();
        navigate("/menu");
      }
    },
    [pathname, navigate]
  );

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 16);
      if (Math.abs(y - lastY.current) > 4) {
        setScrollUp(y < lastY.current);
      }
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,box-shadow,border-color] duration-500",
        isMenuPage
          ? scrolled
            ? cn(
                "menu-header-glass border-b border-white/40 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_4px_24px_rgba(38,27,22,0.04)]",
                scrollUp && "menu-header-glass--lift"
              )
            : "border-b border-transparent bg-transparent"
          : scrolled
            ? "border-b border-line bg-cream/80 shadow-[0_10px_30px_-18px_rgba(38,27,22,0.5)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container-tm flex h-20 items-center justify-between">
        <Link
          href={HOME_HERO_PATH}
          aria-label="Teri Meri — back to hero"
          data-cursor="hover"
          className="wordmark-link inline-block"
          scroll={false}
          onClick={handleWordmarkClick}
        >
          <Wordmark className="text-2xl" interactive />
        </Link>

        <nav className="hidden items-center gap-12 md:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
              scroll={false}
              onClick={(e) => handleNavClick(e, item.href)}
            >
              {item.label}
            </Link>
          ))}
          <Magnetic strength={0.4}>
            <ButtonLink
              href={MENU_SEARCH_PATH}
              variant="orange"
              className="px-6 py-3"
              scroll={false}
              onClick={handleOrderNowClick}
            >
              Order Now
            </ButtonLink>
          </Magnetic>
        </nav>

        <nav className="flex items-center gap-6 md:hidden" aria-label="Main">
          <Link
            href="/menu"
            className="nav-link"
            scroll={false}
            data-cursor="hover"
            onClick={(e) => handleNavClick(e, "/menu")}
          >
            Menu
          </Link>
          <Link
            href={MENU_SEARCH_PATH}
            className="nav-link"
            data-cursor="hover"
            scroll={false}
            onClick={handleOrderNowClick}
          >
            Order Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
