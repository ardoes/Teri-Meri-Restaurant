/**
 * True when Chef's Specials should stack vertically instead of horizontal scroll.
 * Only phones (and reduced-motion) stack — desktop and tablet keep the pinned
 * horizontal scroll experience.
 */
export function shouldStackDishesVertically() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  return window.matchMedia("(max-width: 767px)").matches;
}

export function isCoarsePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

/**
 * Panel sizing. In a horizontal pin track panels are full-viewport and fixed
 * height (so content can't overflow/clip and cause vertical jitter). Stacked
 * (mobile/reduced-motion) panels flow with their own min-height.
 */
export function panelTrackClass(horizontal: boolean) {
  return horizontal
    ? "h-[calc(100svh-5rem)] w-screen shrink-0"
    : "min-h-[min(88svh,42rem)] w-full max-w-full md:min-h-[calc(100svh-5rem)]";
}
