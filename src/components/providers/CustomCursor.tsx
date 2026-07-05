"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Minimal gold ring cursor for fine-pointer (desktop) devices only.
 * Grows over interactive elements ([data-cursor="hover"], a, button).
 */
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!finePointer || prefersReduced) return;

    const el = ref.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });

    let shown = false;
    const onMove = (e: MouseEvent) => {
      if (!shown) {
        shown = true;
        el.classList.add("tm-cursor--active");
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const closestSel = (t: EventTarget | null, sel: string) =>
      t instanceof Element && !!t.closest(sel);

    const onOver = (e: MouseEvent) => {
      const isView = closestSel(e.target, '[data-cursor="view"]');
      const isInteractive = closestSel(
        e.target,
        'a, button, [data-cursor="hover"]'
      );
      el.classList.toggle("tm-cursor--view", isView);
      el.classList.toggle("tm-cursor--hover", !isView && isInteractive);
    };
    const onLeave = () => el.classList.remove("tm-cursor--active");

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="tm-cursor">
      <span className="tm-cursor__label">View</span>
    </div>
  );
}
