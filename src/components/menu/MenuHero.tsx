"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { HEADER_OFFSET } from "@/components/providers/SmoothScroll";

export function MenuHero() {
  const root = useRef<HTMLElement>(null);
  const ghostRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const theRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduced || !root.current) return;

      gsap.from(".menu-hero-line", {
        yPercent: 110,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.12,
        delay: 0.12,
      });
      gsap.from(".menu-hero-word", {
        scale: 0.92,
        opacity: 0,
        duration: 1.15,
        ease: "expo.out",
        delay: 0.28,
      });
      gsap.from(".menu-hero-fade", {
        y: 20,
        opacity: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
        delay: 0.55,
      });

      const hero = root.current;
      const ghost = ghostRef.current;
      const title = titleRef.current;
      const theWord = theRef.current;
      const bodyEls = hero.querySelectorAll(".menu-hero-body");
      if (!ghost || !title || !theWord || bodyEls.length === 0) return;

      gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: () => `+=${hero.offsetHeight * 0.85}`,
          scrub: 1.15,
          invalidateOnRefresh: true,
        },
      })
        .to(
          ghost,
          { y: -140, opacity: 0.12, ease: "none" },
          0
        )
        .to(
          title,
          {
            y: -(HEADER_OFFSET + 8),
            scale: 1.22,
            transformOrigin: "left top",
            ease: "none",
          },
          0
        )
        .to(
          theWord,
          {
            y: -24,
            scale: 1.08,
            transformOrigin: "left center",
            ease: "none",
          },
          0
        )
        .to(
          bodyEls,
          { y: -48, opacity: 0, ease: "none" },
          0
        );
    },
    { scope: root }
  );

  return (
    <header
      ref={root}
      className="menu-page-hero relative overflow-hidden pb-14 pt-28 md:pb-20 md:pt-32"
    >
      <div
        className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-orange/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-green/10 blur-3xl"
        aria-hidden
      />

      <p
        ref={ghostRef}
        className="menu-hero-ghost pointer-events-none absolute inset-x-0 top-[38%] z-0 select-none text-center font-display text-[clamp(5rem,22vw,16rem)] font-black uppercase leading-[0.75] tracking-[-0.04em] text-espresso/[0.035] will-change-transform md:top-[32%]"
        aria-hidden
      >
        Menu
      </p>

      <div className="container-tm relative z-10">
        <h1 className="relative mt-5 md:mt-7">
          <div className="menu-hero-body will-change-transform">
            <p className="menu-hero-fade eyebrow text-green">
              Teri Meri · Kitchen &amp; Restaurant
            </p>
          </div>

          <span ref={theRef} className="menu-hero-the mt-4 block will-change-transform md:mt-5">
            <span className="menu-hero-line block font-display text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-none tracking-[-0.02em] text-green">
              The
            </span>
          </span>

          <div ref={titleRef} className="menu-hero-title will-change-transform">
            <span className="menu-hero-word mt-1 block font-display text-[clamp(4.5rem,20vw,13.5rem)] font-black leading-[0.78] tracking-[-0.04em] md:mt-0">
              <span className="text-orange">Men</span>
              <span className="text-green">u</span>
            </span>
          </div>
        </h1>

        <div className="menu-hero-body mt-8 will-change-transform md:mt-10">
          <div className="menu-hero-fade flex h-[3px] w-32 overflow-hidden rounded-full">
            <span className="h-full flex-[2] bg-orange" />
            <span className="h-full flex-1 bg-green" />
          </div>

          <div className="menu-hero-fade mt-8 max-w-xl">
            <p className="font-display text-[clamp(1.25rem,2.5vw,1.75rem)] leading-snug text-espresso">
              From Hyderabadi pots to tandoor flames — seven chapters, one table,
              every seat is an experience.
            </p>
            <p className="mt-4 font-sans text-base leading-relaxed text-muted md:text-lg">
              All prices in{" "}
              <span className="font-semibold text-green">SR</span>. Browse the
              chapters below and add straight to your cart.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
