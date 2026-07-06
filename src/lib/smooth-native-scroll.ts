import type Lenis from "lenis";
import { getLenisLerp } from "@/lib/scroll-constants";

/** Ignore tiny native↔Lenis drift (wheel-driven Lenis updates). */
const NATIVE_DRIFT_THRESHOLD = 4;

const SCROLL_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
]);

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

function scrollStepForKey(key: string, lenis: Lenis) {
  const vh = window.innerHeight;
  switch (key) {
    case "ArrowDown":
      return vh * 0.12;
    case "ArrowUp":
      return -vh * 0.12;
    case "PageDown":
      return vh * 0.9;
    case "PageUp":
      return -vh * 0.9;
    case "Home":
      return -lenis.scroll;
    case "End":
      return lenis.limit - lenis.scroll;
    case " ":
      return vh * 0.75;
    default:
      return 0;
  }
}

/** Faster catch-up while the native scrollbar is ahead of Lenis. */
function getScrollbarLerp(drift: number) {
  return Math.min(0.48, getLenisLerp() + drift / 1100);
}

/**
 * Route scrollbar / track / keyboard jumps through Lenis — same continuous
 * lerp path as the wheel so pinned horizontal scenes stay smooth.
 */
export function bindSmoothNativeScroll(lenis: Lenis) {
  let syncRaf = 0;
  let syncing = false;

  const chaseNative = () => {
    const nativeY = window.scrollY;
    const drift = Math.abs(nativeY - lenis.scroll);

    if (drift < NATIVE_DRIFT_THRESHOLD) {
      syncing = false;
      syncRaf = 0;
      return;
    }

    lenis.scrollTo(nativeY, {
      programmatic: false,
      lerp: getScrollbarLerp(drift),
    });

    syncRaf = requestAnimationFrame(chaseNative);
  };

  const queueNativeChase = () => {
    const drift = Math.abs(window.scrollY - lenis.scroll);
    if (drift < NATIVE_DRIFT_THRESHOLD) return;

    if (!syncing) {
      syncing = true;
      if (syncRaf) cancelAnimationFrame(syncRaf);
      syncRaf = requestAnimationFrame(chaseNative);
      return;
    }

    // Already chasing — rAF loop reads the latest nativeY each frame.
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (!SCROLL_KEYS.has(e.key)) return;
    if (isEditableTarget(e.target)) return;
    if (e.key === " " && e.shiftKey) return;
    if (
      e.key === " " &&
      e.target instanceof HTMLElement &&
      e.target.closest("button, a, [role='button']")
    ) {
      return;
    }

    e.preventDefault();

    const step = scrollStepForKey(e.key, lenis);
    const target = Math.max(0, Math.min(lenis.limit, lenis.scroll + step));

    lenis.scrollTo(target, {
      programmatic: true,
      lerp: getLenisLerp(),
    });
  };

  window.addEventListener("scroll", queueNativeChase, {
    capture: true,
    passive: true,
  });
  window.addEventListener("keydown", onKeyDown);

  return () => {
    if (syncRaf) cancelAnimationFrame(syncRaf);
    syncing = false;
    window.removeEventListener("scroll", queueNativeChase, { capture: true });
    window.removeEventListener("keydown", onKeyDown);
  };
}
