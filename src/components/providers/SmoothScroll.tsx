"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { registerScroller, runHashScroll, scrollToTop } from "@/lib/scroll-nav";
import { onAppReady, refreshScrollScene } from "@/lib/scroll-scene";
import {
  HOME_HERO_HASH,
  LENIS_SCROLL_DURATION,
  getLenisLerp,
  lenisEasing,
} from "@/lib/scroll-constants";

/**
 * Buttery smooth scrolling (Lenis) driven by GSAP's ticker and kept in
 * lockstep with ScrollTrigger. Respects prefers-reduced-motion.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const lenis = new Lenis({
      lerp: getLenisLerp(),
      duration: LENIS_SCROLL_DURATION,
      easing: lenisEasing,
      wheelMultiplier: coarse ? 1 : 0.82,
      smoothWheel: true,
      // syncTouch breaks taps on links/buttons — keep native touch scroll.
      syncTouch: false,
      touchMultiplier: 1.15,
      infinite: false,
      autoRaf: false,
    });

    lenisRef.current = lenis;

    registerScroller((y, opts) => {
      lenis.scrollTo(y, {
        duration: opts?.immediate ? 0 : (opts?.duration ?? LENIS_SCROLL_DURATION),
        easing: lenisEasing,
        immediate: opts?.immediate,
      });
    });

    lenis.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value?: number) {
        if (value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: "transform",
    });

    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);
    ScrollTrigger.refresh();
    requestAnimationFrame(() => ScrollTrigger.refresh());
    onAppReady(refreshScrollScene);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      registerScroller(null);
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const hash = window.location.hash;

    if (hash === HOME_HERO_HASH) {
      scrollToTop({ immediate: true });
      const timer = window.setTimeout(() => {
        scrollToTop({ immediate: true });
        ScrollTrigger.refresh();
      }, 180);
      return () => window.clearTimeout(timer);
    }

    if (!hash) return;

    runHashScroll(hash, { duration: LENIS_SCROLL_DURATION, retries: 4 });
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => window.clearTimeout(refreshTimer);
  }, [pathname]);

  return <>{children}</>;
}

export { HEADER_OFFSET } from "@/lib/scroll-constants";
