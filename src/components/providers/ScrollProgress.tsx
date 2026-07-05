"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { VERTICAL_SCRUB } from "@/lib/scroll-constants";

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      gsap.set(bar.current, { scaleX: 1 });
      return;
    }
    gsap.to(bar.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: VERTICAL_SCRUB,
      },
    });
  });

  return <div ref={bar} className="scroll-progress" aria-hidden />;
}
