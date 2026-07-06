import { gsap } from "@/lib/gsap";
import { VERTICAL_SCRUB } from "@/lib/scroll-constants";
import { isCoarsePointer } from "@/lib/motion-prefs";

function skipParallax() {
  if (typeof window === "undefined") return true;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    isCoarsePointer()
  );
}

export type GhostParallaxOptions = {
  fromY?: number;
  toY?: number;
  scrub?: number | boolean;
};

const DEFAULT_FROM = 6;
const DEFAULT_TO = -18;

/** Scroll-linked vertical drift for large background index numbers only. */
export function bindSectionGhostParallax(
  scope: HTMLElement | null,
  options?: GhostParallaxOptions
) {
  if (!scope || skipParallax()) return;

  const fromY = options?.fromY ?? DEFAULT_FROM;
  const toY = options?.toY ?? DEFAULT_TO;
  const scrub = options?.scrub ?? VERTICAL_SCRUB;

  scope.querySelectorAll<HTMLElement>(".section-ghost").forEach((ghost) => {
    const trigger =
      ghost.closest<HTMLElement>("[data-ghost-trigger]") ?? scope;

    gsap.fromTo(
      ghost,
      { yPercent: fromY },
      {
        yPercent: toY,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger,
          start: "top bottom",
          end: "bottom top",
          scrub,
        },
      }
    );
  });
}
