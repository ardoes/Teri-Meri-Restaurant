"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { scrollToTop } from "@/lib/scroll-nav";
import { refreshScrollScene } from "@/lib/scroll-scene";

type PageNavigateOptions = {
  scroll?: boolean;
};

type PageNavigateContextValue = {
  navigate: (href: string, options?: PageNavigateOptions) => void;
  registerSurface: (el: HTMLDivElement | null) => void;
};

const PageNavigateContext = createContext<PageNavigateContextValue | null>(null);

const ENTER_FROM = { opacity: 0, y: 22, filter: "blur(5px)" };
const ENTER_TO = {
  opacity: 1,
  y: 0,
  filter: "blur(0px)",
  duration: 0.82,
  ease: "power2.inOut" as const,
};
const EXIT_TO = {
  opacity: 0,
  y: -16,
  filter: "blur(4px)",
  duration: 0.38,
  ease: "power2.in" as const,
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isDifferentPage(href: string) {
  const next = new URL(href, window.location.origin);
  return next.pathname !== window.location.pathname;
}

function resolveInternalHref(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return null;
  if (anchor.target === "_blank") return null;
  if (href.startsWith("#")) return null;

  try {
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    return url.pathname + url.search + url.hash;
  } catch {
    return null;
  }
}

function defer(fn: () => void) {
  requestAnimationFrame(() => {
    requestAnimationFrame(fn);
  });
}

export function usePageNavigate() {
  const ctx = useContext(PageNavigateContext);
  const router = useRouter();

  const navigate = useCallback(
    (href: string, options?: PageNavigateOptions) => {
      if (ctx) {
        ctx.navigate(href, options);
        return;
      }
      defer(() => {
        router.push(href, { scroll: options?.scroll ?? false });
      });
    },
    [ctx, router]
  );

  return { navigate };
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const surface = useRef<HTMLDivElement | null>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const readyForRouteChanges = useRef(false);
  const navigating = useRef(false);
  const mounted = useRef(false);

  const registerSurface = useCallback((el: HTMLDivElement | null) => {
    surface.current = el;
  }, []);

  const pushRoute = useCallback(
    (href: string, options?: PageNavigateOptions) => {
      if (!mounted.current) return;
      defer(() => {
        if (!mounted.current) return;
        router.push(href, { scroll: options?.scroll ?? false });
      });
    },
    [router]
  );

  const animateEnter = useCallback(() => {
    const el = surface.current;
    if (!el || !mounted.current) return;

    scrollToTop({ immediate: true });

    if (prefersReducedMotion()) {
      tween.current?.kill();
      gsap.set(el, { clearProps: "all" });
      refreshScrollScene();
      return;
    }

    tween.current?.kill();
    tween.current = gsap.fromTo(el, { ...ENTER_FROM }, {
      ...ENTER_TO,
      onComplete: () => {
        gsap.set(el, { clearProps: "filter" });
        refreshScrollScene();
      },
    });
  }, []);

  const animateExit = useCallback(() => {
    const el = surface.current;
    if (!el || prefersReducedMotion()) return Promise.resolve();

    return new Promise<void>((resolve) => {
      tween.current?.kill();
      tween.current = gsap.to(el, {
        ...EXIT_TO,
        onComplete: resolve,
      });
    });
  }, []);

  const navigate = useCallback(
    (href: string, options?: PageNavigateOptions) => {
      if (!isDifferentPage(href)) {
        pushRoute(href, options);
        return;
      }

      if (prefersReducedMotion()) {
        pushRoute(href, options);
        return;
      }

      if (navigating.current) return;
      navigating.current = true;

      void animateExit().then(() => {
        pushRoute(href, options);
      });
    },
    [animateExit, pushRoute]
  );

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      tween.current?.kill();
      navigating.current = false;
    };
  }, []);

  useEffect(() => {
    const playEnter = () => {
      if (!mounted.current) return;
      readyForRouteChanges.current = true;
      navigating.current = false;
      animateEnter();
    };

    if (!readyForRouteChanges.current) {
      const ready = (window as unknown as { __tmReady?: boolean }).__tmReady;
      if (ready) {
        playEnter();
      } else {
        window.addEventListener("app:ready", playEnter, { once: true });
        return () => window.removeEventListener("app:ready", playEnter);
      }
      return;
    }

    playEnter();
  }, [pathname, animateEnter]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element).closest("a");
      if (!anchor) return;

      const href = resolveInternalHref(anchor);
      if (!href || !isDifferentPage(href)) return;
      if (prefersReducedMotion()) return;

      // Soft exit only — never preventDefault; Next.js Link owns navigation.
      void animateExit();
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [animateExit]);

  const contextValue = useMemo(
    () => ({ navigate, registerSurface }),
    [navigate, registerSurface]
  );

  return (
    <PageNavigateContext.Provider value={contextValue}>
      {children}
    </PageNavigateContext.Provider>
  );
}

export function PageTransitionView({ children }: { children: ReactNode }) {
  const ctx = useContext(PageNavigateContext);
  const registerSurface = ctx?.registerSurface;
  const surfaceRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerSurface?.(surfaceRef.current);
    return () => registerSurface?.(null);
  }, [registerSurface]);

  return (
    <div ref={surfaceRef} className="page-transition-root">
      {children}
    </div>
  );
}

/** Wraps layout chrome + animated page surface. */
export function PageTransition({ children }: { children: ReactNode }) {
  return <PageTransitionProvider>{children}</PageTransitionProvider>;
}
