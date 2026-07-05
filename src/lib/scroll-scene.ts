import { ScrollTrigger } from "@/lib/gsap";

/** Refresh ScrollTrigger after preloader, images, or layout changes. */
export function refreshScrollScene() {
  ScrollTrigger.refresh();
}

export function onAppReady(callback: () => void) {
  if (typeof window === "undefined") return;
  if ((window as unknown as { __tmReady?: boolean }).__tmReady) {
    callback();
    return;
  }
  window.addEventListener("app:ready", callback, { once: true });
}

/** Retry until `test` passes or max attempts — used for pin track width. */
export function retryUntilReady(
  test: () => boolean,
  onReady: () => void,
  maxAttempts = 120
) {
  let attempts = 0;
  const tick = () => {
    if (test()) {
      onReady();
      return;
    }
    if (attempts++ >= maxAttempts) {
      onReady();
      return;
    }
    requestAnimationFrame(tick);
  };
  tick();
}
