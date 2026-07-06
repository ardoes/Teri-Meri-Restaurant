"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { bindSectionScrollEffects } from "@/lib/section-drift";
import { bindSectionGhostParallax } from "@/lib/section-ghost-parallax";
import { MENU_SEARCH_PATH } from "@/lib/scroll-constants";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Magnetic } from "@/components/ui/Magnetic";

const HEADLINE = ["Yours", "&", "Mine,", "at", "one", "table."];

export function StoryChapter() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduced) return;

      gsap.from(".s-word", {
        yPercent: 100,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.09,
        scrollTrigger: { trigger: root.current, start: "top 68%" },
      });

      gsap.from(".s-fade", {
        y: 24,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: "top 58%" },
      });

      gsap.fromTo(
        ".s-media",
        { clipPath: "inset(0% 0% 100% 0%)", scale: 1.05 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        }
      );

      gsap.from(".s-chip", {
        y: 12,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: root.current, start: "top 55%" },
      });

      bindSectionGhostParallax(root.current);
      bindSectionScrollEffects(root.current);
    },
    { scope: root }
  );

  return (
    <section
      id="story"
      ref={root}
      data-ghost-trigger
      className="relative flex min-h-screen items-center overflow-hidden py-20 sm:py-28 md:py-40"
    >
      <span
        className="section-ghost pointer-events-none absolute -left-4 top-6 select-none font-display text-[24vw] leading-none text-orange/[0.07] will-change-transform md:text-[14vw]"
        aria-hidden
      >
        02
      </span>

      <div className="chapter-drift container-tm relative grid w-full grid-cols-1 items-center gap-10 sm:gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="s-fade eyebrow">Our Story</p>
          <h2 className="chapter-heading-exit mt-7 text-[clamp(2.25rem,6vw,6rem)] leading-[0.98] text-espresso sm:text-[clamp(2.5rem,6vw,6rem)]">
            {HEADLINE.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <span className="s-word inline-block pr-[0.22em]">{w}</span>
              </span>
            ))}
          </h2>
          <p className="s-fade mt-9 max-w-md text-lg text-muted">
            Teri Meri means Yours and Mine. Inspired by the unmistakable food
            cultures of Hyderabad and Karachi, we bring slow-cooked biryani, smoky
            BBQ, and bold Desi comfort to Jeddah.
          </p>
          <p className="s-fade eyebrow mt-9">Jeddah &bull; Est. 2025</p>
          <div className="s-fade mt-10">
            <Magnetic strength={0.38}>
              <ButtonLink
                href={MENU_SEARCH_PATH}
                variant="orange"
                className="px-8 py-4"
                scroll={false}
              >
                Experience it yourself
              </ButtonLink>
            </Magnetic>
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-8">
          <div
            data-cursor="view"
            className="s-media media-placeholder relative aspect-[5/6] w-full overflow-hidden rounded-[2rem] text-espresso ring-1 ring-line"
          >
            <div className="s-media-inner absolute inset-0 -top-[8%] h-[116%]">
              <Image
                src="/images/story-dining.png"
                alt="Teri Meri dining room with tables ready for guests"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-espresso/10" />
            </div>

            {/* Tasteful overlay labels — each drifts independently */}
            <div className="pointer-events-none absolute inset-0 z-20">
              <span className="s-chip s-chip-drift-1 absolute left-[8%] top-[18%] rounded-full bg-orange/90 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-cream shadow-[0_8px_20px_rgba(38,27,22,0.28)] backdrop-blur-sm">
                One Table, Many Stories
              </span>
              <span className="s-chip s-chip-drift-2 absolute right-[10%] top-[52%] rounded-full bg-cream/90 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-espresso shadow-[0_8px_20px_rgba(38,27,22,0.28)] backdrop-blur-sm">
                Sit. Share. Stay.
              </span>
              <span className="s-chip s-chip-drift-3 absolute bottom-[14%] left-[22%] rounded-full bg-green/90 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-cream shadow-[0_8px_20px_rgba(38,27,22,0.28)] backdrop-blur-sm">
                A Table for Everyone
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
