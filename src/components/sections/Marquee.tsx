"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const WORDS = [
  "Mouth-watering",
  "Buttery",
  "Melt-in-your-mouth indulgent",
  "Smoky",
];

function MarqueeStrip({
  group,
  ariaHidden,
}: {
  group: number;
  ariaHidden?: boolean;
}) {
  return (
    <div
      className="marquee-strip flex shrink-0 items-center"
      aria-hidden={ariaHidden}
    >
      {WORDS.map((word, i) => (
        <span key={`${group}-${word}`} className="flex items-center">
          <span
            className={
              i % 2 === 0
                ? "font-display text-5xl italic text-cream [text-shadow:0_8px_20px_rgba(0,0,0,0.28)] md:text-7xl"
                : "font-display text-5xl italic text-marigold [text-shadow:0_8px_20px_rgba(0,0,0,0.28)] md:text-7xl"
            }
          >
            {word}
          </span>
          <span className="mx-8 text-orange md:mx-12">✦</span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduced) return;

      gsap.from(root.current, {
        y: 18,
        opacity: 0,
        duration: 0.85,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 98%" },
      });

      const trackEl = track.current;
      const stripEl = trackEl?.querySelector<HTMLElement>(".marquee-strip");
      if (!trackEl || !stripEl) return;

      const run = () => {
        const distance = stripEl.offsetWidth;
        if (distance <= 0) return;

        gsap.set(trackEl, { x: 0, force3D: true });

        gsap.to(trackEl, {
          x: -distance,
          ease: "none",
          duration: 26,
          repeat: -1,
          overwrite: true,
        });
      };

      run();

      const ro = new ResizeObserver(run);
      ro.observe(stripEl);
      window.addEventListener("load", run, { once: true });

      return () => {
        ro.disconnect();
        window.removeEventListener("load", run);
      };
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-[linear-gradient(90deg,var(--tm-green)_0%,var(--tm-green-deep)_50%,var(--tm-green)_100%)] py-10 text-cream"
    >
      <div ref={track} className="flex w-max will-change-transform">
        <MarqueeStrip group={0} />
        <MarqueeStrip group={1} ariaHidden />
      </div>
    </section>
  );
}
