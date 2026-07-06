/** Fixed site header height — used for scroll offsets and pin positions */
export const HEADER_OFFSET = 80;

/** Lenis lerp (desktop) — lower = richer floaty inertia */
export const LENIS_LERP = 0.055;

/** Lenis lerp on touch — lighter catch-up, native momentum stays primary */
export const LENIS_LERP_TOUCH = 0.1;

/** Default Lenis programmatic scroll duration (hash links, nav) */
export const LENIS_SCROLL_DURATION = 1.4;

/**
 * ScrollTrigger scrub for pinned horizontal scenes — true = 1:1 with scroll
 * (no catch-up lag that causes blanket layers to bounce on scrollbar input).
 */
export const HORIZONTAL_SCRUB = true;

/** Slightly softer on touch */
export const HORIZONTAL_SCRUB_TOUCH = 0.85;

/** Default scrub for vertical parallax / drift tied to Lenis */
export const VERTICAL_SCRUB = 1.15;

/**
 * Smooth GSAP scrub lag synced with Lenis — higher = slower, floatier catch-up.
 * Used for footer reveals and pinned blanket scenes.
 */
export const LENIS_SCRUB = 1.4;

/** Linear motion while scrubbing — pairs with LENIS_SCRUB for buttery scroll */
export const BLANKET_RISE_EASE = "none";

/** Scroll distance (× viewport height) for each blanket rise — higher = slower */
export const CHEF_BLANKET_RISE_VH = 1.55;
export const GATHER_BLANKET_RISE_VH = 1.9;

/** Footer clip reveal — scroll distance before animation completes */
export const FOOTER_REVEAL_VH = 0.82;

export function getLenisScrub() {
  if (typeof window === "undefined") return LENIS_SCRUB;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0.5;
  if (window.matchMedia("(pointer: coarse)").matches) return 1.1;
  return LENIS_SCRUB;
}

/** Lenis-style ease-out expo — shared by programmatic scrolls */
export function lenisEasing(t: number) {
  return Math.min(1, 1.001 - Math.pow(2, -10 * t));
}

export function getLenisLerp() {
  if (typeof window === "undefined") return LENIS_LERP;
  if (window.matchMedia("(pointer: coarse)").matches) return LENIS_LERP_TOUCH;
  return LENIS_LERP;
}

/** Gathering track uses the same distance as measured — no extra stretch */
export const GATHERING_SCROLL_STRETCH = 1;

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
