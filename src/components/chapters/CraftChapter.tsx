"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { bindSectionScrollEffects } from "@/lib/section-drift";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { cn } from "@/lib/utils";

const HEADLINE = ["Where", "every", "detail", "finds", "its", "flavour."];

const NOTES = [
  {
    k: "Spice",
    v: "Whole spices, roasted and ground fresh for every batch.",
  },
  {
    k: "Fire",
    v: "Heat, patience, and time, doing what shortcuts never can.",
  },
  {
    k: "Dum",
    v: "Sealed slow beneath a dough crust, so every grain carries the flavour.",
  },
];

export function CraftChapter({
  className,
  disableScrollEffects = false,
  extraScrollRoom = false,
  compact = false,
}: {
  className?: string;
  disableScrollEffects?: boolean;
  extraScrollRoom?: boolean;
  /** Fill a pinned viewport (desktop horizontal scene) */
  compact?: boolean;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduced) return;

      if (disableScrollEffects) return;

      gsap.from(".c-word", {
        yPercent: 120,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 66%" },
      });

      gsap.from(".c-note", {
        y: 26,
        opacity: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.14,
        scrollTrigger: { trigger: root.current, start: "top 54%" },
      });

      gsap.fromTo(
        ".c-media",
        { clipPath: "inset(0% 0% 100% 0%)", scale: 1.05 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 68%" },
        }
      );

      gsap.from(".c-chip", {
        y: 12,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: { trigger: root.current, start: "top 55%" },
      });

      bindSectionScrollEffects(root.current, { skipHeading: true });
    },
    { scope: root }
  );

  return (
    <section
      id="craft"
      ref={root}
      className={cn(
        "relative overflow-hidden bg-green text-cream",
        compact
          ? "flex h-full min-h-[calc(100svh-5rem)] items-center py-8 sm:py-10"
          : extraScrollRoom
            ? "pb-[min(45vh,28rem)] pt-24 sm:pt-28 md:pb-[min(50vh,32rem)] md:pt-40"
            : "py-20 sm:py-28 md:py-40",
        className
      )}
    >
      <div
        className={cn(
          "container-tm grid items-center gap-10 sm:gap-12 md:grid-cols-12",
          !disableScrollEffects && "chapter-drift"
        )}
      >
        <div className="md:col-span-6">
          <div
            data-cursor="view"
            className="c-media media-placeholder relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] text-cream ring-1 ring-cream/15"
          >
            <div className="c-media-inner absolute inset-0 bg-green p-6 md:p-10">
              <div className="relative mx-auto h-full w-full max-w-[92%] -translate-x-[4%]">
                <Image
                  src="/images/craft-biryani.jpg"
                  alt="Teri Meri Zafrani biryani in a copper handi"
                  fill
                  quality={100}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain object-center"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-espresso/10" />
            </div>

            <div className="pointer-events-none absolute inset-0 z-20">
              <span className="c-chip s-chip-drift-1 absolute left-[8%] top-[16%] rounded-full bg-orange/90 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-cream shadow-[0_8px_20px_rgba(38,27,22,0.28)] backdrop-blur-sm">
                Zafrani Biryani
              </span>
              <span className="c-chip s-chip-drift-2 absolute right-[10%] top-[48%] rounded-full bg-cream/90 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-espresso shadow-[0_8px_20px_rgba(38,27,22,0.28)] backdrop-blur-sm">
                Mutton
              </span>
              <span className="c-chip s-chip-drift-3 absolute bottom-[14%] left-[18%] rounded-full bg-green/90 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-cream shadow-[0_8px_20px_rgba(38,27,22,0.28)] backdrop-blur-sm">
                Whole Spice
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 md:col-start-8">
          <p className="c-note eyebrow text-gold-soft">The Craft</p>
          <h2 className="mt-7 text-[clamp(2.5rem,6.5vw,6rem)] leading-[0.98] text-cream">
            {HEADLINE.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <span className="c-word inline-block pr-[0.22em]">{w}</span>
              </span>
            ))}
          </h2>

          <dl className="glass-dark relative z-10 mt-10 max-w-md space-y-5 rounded-[1.5rem] p-7">
            {NOTES.map((n, i) => (
              <div
                key={n.k}
                className={cn(
                  "c-note flex items-baseline gap-5",
                  i > 0 && "border-t border-cream/15 pt-4"
                )}
              >
                <dt className="eyebrow whitespace-nowrap text-gold-soft">
                  {n.k}
                </dt>
                <dd className="text-cream/80">{n.v}</dd>
              </div>
            ))}
          </dl>

          {!compact ? (
            <div className="c-note mt-10">
              <Magnetic strength={0.38}>
                <ButtonLink
                  href="/#dishes"
                  variant="on-green"
                  className="px-8 py-4"
                  scroll={false}
                >
                  Chef&apos;s Specials
                </ButtonLink>
              </Magnetic>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
