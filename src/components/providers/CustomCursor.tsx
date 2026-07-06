"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const DESKTOP_CURSOR_MQ = "(hover: hover) and (pointer: fine)";

/**
 * Golden ring cursor with inner dot — desktop / fine-pointer only.
 * Portaled to document.body so it is never trapped under overflow stacks.
 */
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [portalReady, setPortalReady] = useState(false);
  const [canUse, setCanUse] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setPortalReady(true);
    const desktopMq = window.matchMedia(DESKTOP_CURSOR_MQ);
    const apply = () => setCanUse(desktopMq.matches);
    apply();
    desktopMq.addEventListener("change", apply);
    return () => desktopMq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!portalReady || !canUse) {
      document.documentElement.classList.remove("tm-custom-cursor");
      return;
    }

    let cancelled = false;
    let cleanupListeners: (() => void) | undefined;

    const attach = () => {
      if (cancelled) return;
      const el = ref.current;
      if (!el) {
        requestAnimationFrame(attach);
        return;
      }

      const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
      const followDuration = reducedMq.matches ? 0.08 : 0.28;

      gsap.set(el, { xPercent: -50, yPercent: -50, force3D: true });

      const xTo = gsap.quickTo(el, "x", {
        duration: followDuration,
        ease: "power3.out",
      });
      const yTo = gsap.quickTo(el, "y", {
        duration: followDuration,
        ease: "power3.out",
      });

      const onMove = (e: PointerEvent) => {
        document.documentElement.classList.add("tm-custom-cursor");
        setVisible(true);
        xTo(e.clientX);
        yTo(e.clientY);
      };

      const closestSel = (t: EventTarget | null, sel: string) =>
        t instanceof Element && !!t.closest(sel);

      const onOver = (e: PointerEvent) => {
        const isView = closestSel(e.target, '[data-cursor="view"]');
        const isInteractive = closestSel(
          e.target,
          'a, button, [data-cursor="hover"]'
        );
        el.classList.toggle("tm-cursor--view", isView);
        el.classList.toggle("tm-cursor--hover", !isView && isInteractive);
      };

      const onLeave = () => {
        setVisible(false);
        document.documentElement.classList.remove("tm-custom-cursor");
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerover", onOver, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);

      cleanupListeners = () => {
        document.documentElement.classList.remove("tm-custom-cursor");
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerover", onOver);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        gsap.set(el, { clearProps: "all" });
      };
    };

    attach();

    return () => {
      cancelled = true;
      cleanupListeners?.();
    };
  }, [portalReady, canUse]);

  if (!portalReady) return null;

  return createPortal(
    <div
      ref={ref}
      className={cn(
        "tm-cursor",
        !canUse && "tm-cursor--disabled",
        visible && canUse && "tm-cursor--active"
      )}
      aria-hidden
    >
      <span className="tm-cursor__ring" />
      <span className="tm-cursor__dot" />
      <span className="tm-cursor__label">View</span>
    </div>,
    document.body
  );
}
