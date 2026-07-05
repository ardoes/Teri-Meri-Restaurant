/** Fixed site header height — used for scroll offsets and pin positions */
export const HEADER_OFFSET = 80;

/** Lenis lerp (desktop) — lower = richer floaty inertia */
export const LENIS_LERP = 0.055;

/** Lenis lerp on touch — lighter catch-up, native momentum stays primary */
export const LENIS_LERP_TOUCH = 0.1;

/** Default Lenis programmatic scroll duration (hash links, nav) */
export const LENIS_SCROLL_DURATION = 1.4;

/**
 * ScrollTrigger scrub for pinned horizontal scenes — one value sitewide so
 * Lenis hand-off feels identical in craft, chef, and gathering tracks.
 */
export const HORIZONTAL_SCRUB = 4.35;

/** Moderate scrub on touch — smooth without feeling stuck */
export const HORIZONTAL_SCRUB_TOUCH = 2.75;

/** Default scrub for vertical parallax / drift tied to Lenis */
export const VERTICAL_SCRUB = 1.15;

/** Lenis-style ease-out expo — shared by programmatic scrolls */
export function lenisEasing(t: number) {
  return Math.min(1, 1.001 - Math.pow(2, -10 * t));
}

export function getLenisLerp() {
  if (typeof window === "undefined") return LENIS_LERP;
  if (window.matchMedia("(pointer: coarse)").matches) return LENIS_LERP_TOUCH;
  return LENIS_LERP;
}

/** Extra scroll stretch for the gathering horizontal — linear scrub runway */
export const GATHERING_SCROLL_STRETCH = 1.22;

export function getHorizontalScrub() {
  if (typeof window === "undefined") return HORIZONTAL_SCRUB;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0.5;
  if (window.matchMedia("(pointer: coarse)").matches) return HORIZONTAL_SCRUB_TOUCH;
  return HORIZONTAL_SCRUB;
}

/** @deprecated Use getHorizontalScrub — kept for import compatibility */
export const getGatheringScrub = getHorizontalScrub;

/** Menu page — find-a-dish search block */
export const MENU_SEARCH_HASH = "#search";
export const MENU_SEARCH_PATH = `/menu${MENU_SEARCH_HASH}`;

/** Homepage hero anchor */
export const HOME_HERO_HASH = "#top";
export const HOME_HERO_PATH = `/${HOME_HERO_HASH}`;
