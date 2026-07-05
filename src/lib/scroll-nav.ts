import {
  HEADER_OFFSET,
  HOME_HERO_HASH,
  LENIS_SCROLL_DURATION,
  MENU_SEARCH_HASH,
} from "@/lib/scroll-constants";

type ScrollOptions = {
  duration?: number;
  /** Override header offset — pass 0 for full-bleed hero */
  offset?: number;
  /** Jump instantly (sticky hero / hash recovery) */
  immediate?: boolean;
};

type ScrollFn = (
  y: number,
  opts?: { duration?: number; immediate?: boolean }
) => void;

let scrollFn: ScrollFn | null = null;

export function registerScroller(fn: ScrollFn | null) {
  scrollFn = fn;
}

function forceNativeScroll(y: number) {
  window.scrollTo(0, y);
  document.documentElement.scrollTop = y;
  document.body.scrollTop = y;
}

export function scrollToY(y: number, options?: ScrollOptions) {
  const top = Math.max(0, y);
  const immediate = options?.immediate ?? false;
  const duration = immediate ? 0 : (options?.duration ?? LENIS_SCROLL_DURATION);

  if (scrollFn) {
    scrollFn(top, { duration, immediate });
  } else if (immediate) {
    forceNativeScroll(top);
  } else {
    window.scrollTo({ top, behavior: "smooth" });
  }

  if (immediate) {
    forceNativeScroll(top);
  }
}

/** Always lands at pixel 0 — bypasses sticky #top hash quirks */
export function scrollToTop(options?: ScrollOptions) {
  scrollToY(0, { ...options, offset: 0, immediate: options?.immediate ?? true });
}

export function scrollToHash(hash: string, options?: ScrollOptions) {
  const normalized = hash.startsWith("#") ? hash : `#${hash}`;

  if (normalized === HOME_HERO_HASH) {
    scrollToTop(options);
    return;
  }

  const target = document.querySelector<HTMLElement>(normalized);
  if (!target) return;

  const offset = options?.offset ?? HEADER_OFFSET;
  const y = target.getBoundingClientRect().top + window.scrollY - offset;
  scrollToY(y, options);
}

export function scrollToMenuSearch(options?: ScrollOptions) {
  scrollToHash(MENU_SEARCH_HASH, options);
}

export function runHashScroll(
  hash: string,
  options?: ScrollOptions & { retries?: number }
) {
  const retries = options?.retries ?? 3;
  const attempt = (left: number) => {
    scrollToHash(hash, options);
    if (left <= 0) return;
    window.setTimeout(() => attempt(left - 1), left === retries ? 120 : 220);
  };
  attempt(retries);
}

export { HOME_HERO_HASH, MENU_SEARCH_HASH };
export {
  HOME_HERO_PATH,
  MENU_SEARCH_PATH,
} from "@/lib/scroll-constants";
