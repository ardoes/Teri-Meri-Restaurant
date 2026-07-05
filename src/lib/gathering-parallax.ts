import { gsap } from "@/lib/gsap";
import { VERTICAL_SCRUB } from "@/lib/scroll-constants";
import { isCoarsePointer } from "@/lib/motion-prefs";

const MOTION = { ease: "none" as const, force3D: true };

function skipParallax() {
  if (typeof window === "undefined") return true;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    isCoarsePointer()
  );
}

/** Subtle image drift during the chef horizontal track */
export function bindChefDishParallax(
  tl: gsap.core.Timeline,
  track: HTMLElement,
  position: string | number,
  duration: number
) {
  if (skipParallax()) return;

  track.querySelectorAll<HTMLElement>(".dish-media__inner").forEach((media) => {
    tl.fromTo(
      media,
      { xPercent: 4, scale: 1.03 },
      { xPercent: -5, scale: 1, ...MOTION, duration },
      position
    );
  });
}

/** Vertical lag while the gathering blanket rises over kebabs */
export function bindGatheringBlanketParallax(
  tl: gsap.core.Timeline,
  container: HTMLElement,
  position: string | number,
  duration: number
) {
  if (skipParallax()) return;

  container.querySelectorAll<HTMLElement>(".gathering-parallax-rise").forEach((el) => {
    tl.fromTo(
      el,
      { yPercent: 10 },
      { yPercent: 0, ...MOTION, duration },
      position
    );
  });
}

/** Suspenseful intro reveal while "Spaces for Every Gathering" holds */
export function bindGatheringIntroSuspense(
  tl: gsap.core.Timeline,
  container: HTMLElement,
  position: string | number,
  duration: number
) {
  if (skipParallax()) return;

  const intro = container.querySelector<HTMLElement>(".gathering-intro-content");
  const words = container.querySelectorAll<HTMLElement>(
    ".gathering-intro-content h2 span > span"
  );
  const glows = container.querySelectorAll<HTMLElement>(".gathering-parallax-glow");
  const ghost = container.querySelector<HTMLElement>(".gathering-parallax-ghost");

  if (intro) {
    tl.fromTo(
      intro,
      { y: 48, scale: 0.9, opacity: 0.55, filter: "blur(6px)" },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        ease: "none",
        force3D: true,
        duration: duration * 0.72,
      },
      position
    );
  }

  words.forEach((word, i) => {
    tl.fromTo(
      word,
      { yPercent: 120, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        ease: "none",
        force3D: true,
        duration: duration * 0.22,
      },
      `${position}+=${i * 0.028}`
    );
  });

  glows.forEach((glow) => {
    tl.fromTo(
      glow,
      { scale: 0.85, opacity: 0.35 },
      {
        scale: 1.12,
        opacity: 0.62,
        ease: "none",
        force3D: true,
        duration,
      },
      position
    );
  });

  if (ghost) {
    tl.fromTo(
      ghost,
      { xPercent: 6, opacity: 0.04 },
      { xPercent: -4, opacity: 0.09, ease: "none", force3D: true, duration },
      position
    );
  }
}

/** Image depth during the horizontal gathering track (after intro is settled) */
export function bindGatheringHorizontalParallax(
  tl: gsap.core.Timeline,
  container: HTMLElement,
  position: string | number,
  duration: number
) {
  if (skipParallax()) return;

  container.querySelectorAll<HTMLElement>(".gathering-panel").forEach((panel) => {
    const media = panel.querySelector<HTMLElement>(".gathering-media__inner");
    const copy = panel.querySelector<HTMLElement>(".gathering-parallax-copy");
    const ghost = panel.querySelector<HTMLElement>(".gathering-parallax-ghost");

    if (media) {
      tl.fromTo(
        media,
        { xPercent: 8, scale: 1.06 },
        { xPercent: -10, scale: 1, ...MOTION, duration },
        position
      );
    }

    if (copy) {
      tl.fromTo(
        copy,
        { xPercent: -6, yPercent: 4 },
        { xPercent: 5, yPercent: -3, ...MOTION, duration },
        position
      );
    }

    if (ghost) {
      tl.fromTo(
        ghost,
        { xPercent: -8, yPercent: 5 },
        { xPercent: 12, yPercent: -4, ...MOTION, duration },
        position
      );
    }
  });
}

/** Standard vertical-scroll parallax for stacked mobile layout */
export function bindGatheringVerticalParallax(scope: HTMLElement) {
  if (skipParallax()) return;

  scope.querySelectorAll<HTMLElement>(".gathering-panel").forEach((panel) => {
    panel.querySelectorAll<HTMLElement>(".gathering-media__inner").forEach((media) => {
      gsap.fromTo(
        media,
        { yPercent: 4 },
        {
          yPercent: -8,
          scale: 1,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: panel,
            start: "top bottom",
            end: "bottom top",
            scrub: VERTICAL_SCRUB,
          },
        }
      );
    });
  });
}
