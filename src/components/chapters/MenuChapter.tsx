"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { bindSectionScrollEffects } from "@/lib/section-drift";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { cn } from "@/lib/utils";
import { panelTrackClass } from "@/lib/motion-prefs";

export function MenuIntroPanel({
  className,
  horizontal = true,
}: {
  className?: string;
  horizontal?: boolean;
}) {
  return (
    <article
      id="menu"
      className={cn(
        "relative flex min-h-[calc(100svh-5rem)] items-center justify-center overflow-hidden bg-cream px-4 pb-12 pt-24 text-center sm:px-6 sm:pt-28 md:pt-32",
        panelTrackClass(horizontal),
        className
      )}
    >
      <div className="container-tm relative mx-auto w-full px-4 sm:px-6">
        <span className="eyebrow block text-green">The Menu</span>
        <h2 className="mt-8 text-[clamp(2.75rem,9vw,9rem)] leading-[0.88] sm:mt-10">
          <span className="block text-espresso">Chef&apos;s</span>
          <span className="block italic text-orange">Specials</span>
        </h2>
        <p className="mx-auto mt-8 max-w-md text-lg text-muted">
          The plates we&rsquo;re known for, made with bold spice, slow cooking,
          and the kind of flavour that keeps the whole table reaching back in.
        </p>
        <p className="mt-5 font-display text-xl italic text-green md:text-2xl">
          Start here. Thank us later.
        </p>
        <div className="mt-10 flex items-center justify-center gap-3 text-[0.7rem] uppercase tracking-[0.3em] text-gold">
          <span className="h-px w-10 bg-gold/50" />
          The dishes
          <span className="h-px w-10 bg-gold/50" />
        </div>
        <div className="mt-10">
          <Magnetic strength={0.38}>
            <ButtonLink href="/menu" variant="orange" className="px-8 py-4">
              Browse Full Menu
            </ButtonLink>
          </Magnetic>
        </div>
      </div>
    </article>
  );
}

/** Standalone menu chapter with scroll reveals — mobile / reduced motion */
export function MenuChapter() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduced) return;

      gsap.from(".m-reveal", {
        yPercent: 120,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: "top 64%" },
      });
      gsap.from(".m-fade", {
        y: 24,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 54%" },
      });

      bindSectionScrollEffects(root.current, { skipHeading: true });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative w-full py-20 text-center md:py-44">
      <div className="chapter-drift container-tm relative mx-auto max-w-3xl">
        <span className="block overflow-hidden">
          <span className="m-reveal eyebrow block">The Menu</span>
        </span>
        <h2 className="mt-8 text-[clamp(2.75rem,9vw,9rem)] leading-[0.88] sm:mt-10">
          <span className="block overflow-hidden">
            <span className="m-reveal block text-espresso">Chef&apos;s</span>
          </span>
          <span className="block overflow-hidden">
            <span className="m-reveal block italic text-orange">Specials</span>
          </span>
        </h2>
        <p className="m-fade mx-auto mt-8 max-w-md text-lg text-muted">
          The plates we&rsquo;re known for, made with bold spice, slow cooking,
          and the kind of flavour that keeps the whole table reaching back in.
        </p>
        <p className="m-fade mt-5 font-display text-xl italic text-green md:text-2xl">
          Start here. Thank us later.
        </p>
        <div className="m-fade mt-10 flex items-center justify-center gap-3 text-[0.7rem] uppercase tracking-[0.3em] text-gold">
          <span className="h-px w-10 bg-gold/50" />
          The dishes
          <span className="h-px w-10 bg-gold/50" />
        </div>
        <div className="m-fade mt-10">
          <Magnetic strength={0.38}>
            <ButtonLink href="/menu" variant="orange" className="px-8 py-4">
              Browse Full Menu
            </ButtonLink>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
