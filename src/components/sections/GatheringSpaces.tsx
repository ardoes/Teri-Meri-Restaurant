"use client";

import { useRef, useState, useLayoutEffect, useEffect, type RefObject } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { HEADER_OFFSET, getHorizontalScrub } from "@/lib/scroll-constants";
import { panelTrackClass, shouldStackDishesVertically } from "@/lib/motion-prefs";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { cn } from "@/lib/utils";
import {
  bindSectionGhostParallax,
} from "@/lib/section-ghost-parallax";
import {
  WHATSAPP_FAMILY_DINING_URL,
  WHATSAPP_PRIVATE_DINING_URL,
} from "@/lib/contact";

const SPACES = [
  {
    index: "01",
    eyebrow: "Family Dining",
    title: "Family Dining",
    copy: "A comfortable, welcoming setting made for unhurried meals with the people who matter most.",
    cta: "Reserve a Table",
    href: WHATSAPP_FAMILY_DINING_URL,
    external: true,
    ariaLabel: "Reserve a Family Dining table on WhatsApp",
    image: "/images/gathering-family-dining.png",
    imageAlt: "Family dining booths at Teri Meri",
    tone: "warm" as const,
    chip: "Unhurried meals",
  },
  {
    index: "02",
    eyebrow: "Private Dining",
    title: "Private Dining",
    copy: "A dedicated setting for intimate gatherings, group meals, and special occasions for up to 20 guests.",
    cta: "Enquire About Private Dining",
    href: WHATSAPP_PRIVATE_DINING_URL,
    external: true,
    ariaLabel: "Enquire about Private Dining on WhatsApp",
    image: "/images/gathering-private-dining.png",
    imageAlt: "Private dining room at Teri Meri",
    tone: "green" as const,
    chip: "Up to 20 guests",
  },
];

export function GatheringIntroPanel({
  className,
  horizontal = true,
}: {
  className?: string;
  horizontal?: boolean;
}) {
  return (
    <article
      className={cn(
        "gathering-panel gathering-panel--intro relative flex items-center justify-center overflow-hidden",
        panelTrackClass(horizontal),
        className
      )}
      data-ghost-trigger
    >
      <div
        className="gathering-texture pointer-events-none absolute inset-0 z-[1]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 top-[10%] h-[30rem] w-[30rem] rounded-full bg-green/28 blur-[110px] gathering-glow-pulse"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-12 bottom-[6%] h-[28rem] w-[28rem] rounded-full bg-forest/35 blur-[120px] gathering-glow-pulse"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-soft/16 blur-[90px] gathering-glow-pulse"
        aria-hidden
      />

      <span
        className="section-ghost pointer-events-none absolute -right-2 top-2 select-none font-display text-[38vw] leading-none text-cream/[0.07] will-change-transform md:text-[24vw]"
        aria-hidden
      >
        Gather
      </span>

      <div className="gathering-intro-content container-tm relative z-10 text-center">
        <p className="eyebrow text-gold-soft">Gather</p>
        <h2 className="mx-auto mt-6 max-w-5xl px-3 text-[clamp(2.25rem,7vw,6.5rem)] leading-[0.92] text-cream drop-shadow-[0_8px_30px_rgba(38,27,22,0.35)] sm:mt-6 sm:px-0">
          {["Spaces", "for", "Every", "Gathering"].map((word) => (
            <span key={word} className="inline-block pr-[0.2em]">
              <span
                className={cn(
                  word === "Every" && "italic text-gold-soft",
                  word === "Gathering" && "text-cream"
                )}
              >
                {word}
              </span>
            </span>
          ))}
        </h2>
        <p className="mx-auto mt-10 max-w-lg px-4 text-lg leading-relaxed text-cream/90 md:mt-12 md:text-xl">
          From relaxed family meals to intimate gatherings, every table has room
          to linger.
        </p>
        <div className="mx-auto mt-12 flex h-[3px] w-40 overflow-hidden rounded-full md:mt-14">
          <span className="h-full flex-[2] bg-green" />
          <span className="h-full flex-1 bg-gold-soft" />
        </div>
        <p className="gathering-scroll-hint mx-auto mt-8 text-[0.65rem] uppercase tracking-[0.38em] text-cream/70 md:mt-10">
          Scroll to explore
        </p>
      </div>
    </article>
  );
}

function SpacePanel({
  space,
  reversed,
  priority,
  horizontal = true,
}: {
  space: (typeof SPACES)[number];
  reversed?: boolean;
  priority?: boolean;
  horizontal?: boolean;
}) {
  const isGreen = space.tone === "green";
  const isWarm = space.tone === "warm";
  const eagerImage = priority || horizontal;

  return (
    <article
      className={cn(
        "gathering-panel gathering-row relative flex items-center justify-center overflow-hidden px-4 py-10 sm:px-6",
        panelTrackClass(horizontal),
        isGreen && "gathering-row--green",
        isWarm && "gathering-row--warm"
      )}
      data-ghost-trigger
    >
      <div className="gathering-texture pointer-events-none absolute inset-0 z-[1]" aria-hidden />

      {isGreen ? (
        <div
          className="gathering-row__wash pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(135deg,var(--tm-green-deep)_0%,var(--tm-green)_48%,var(--tm-green-deep)_100%)]"
          aria-hidden
        />
      ) : isWarm ? (
        <>
          <div className="gathering-row__wash pointer-events-none absolute inset-0 z-0" aria-hidden />
          <div
            className="gathering-row__brand-wash pointer-events-none absolute inset-0 z-[2]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-[min(72%,42rem)] bg-[radial-gradient(ellipse_at_20%_50%,color-mix(in_srgb,var(--tm-green)_24%,transparent)_0%,transparent_68%)] opacity-75"
            aria-hidden
          />
        </>
      ) : null}

      {isGreen ? (
        <div
          className="pointer-events-none absolute -right-20 top-1/4 h-64 w-64 rounded-full bg-gold-soft/20 blur-[90px]"
          aria-hidden
        />
      ) : isWarm ? (
        <div
          className="pointer-events-none absolute -right-12 top-[8%] h-56 w-56 rounded-full bg-green/12 blur-[90px]"
          aria-hidden
        />
      ) : null}

      <div className="container-tm relative z-10 grid w-full max-w-[100rem] grid-cols-1 items-center gap-8 sm:gap-10 md:grid-cols-12 md:gap-10 xl:gap-14">
        <div
          className={cn(
            "mx-auto w-full max-w-md md:col-span-6 md:max-w-none",
            reversed && "md:order-2 md:col-start-7"
          )}
        >
          <div
            data-cursor="view"
            className="gathering-media__frame group/media relative aspect-[4/3] w-full min-h-[12rem] overflow-hidden sm:min-h-[14rem] md:aspect-[5/4] md:max-h-[62vh]"
          >
            <div className="gathering-media__inner absolute inset-0 overflow-hidden">
              <Image
                src={space.image}
                alt={space.imageAlt}
                fill
                priority={eagerImage}
                quality={90}
                sizes="(max-width: 768px) 100vw, 46vw"
                className="object-cover object-center"
              />
            </div>
            <div
              className={cn(
                "absolute inset-0 z-[1] mix-blend-multiply transition-opacity duration-700 group-hover/media:opacity-15",
                isGreen
                  ? "bg-[linear-gradient(145deg,var(--tm-green)_0%,transparent_55%)] opacity-25"
                  : isWarm
                    ? "bg-[linear-gradient(145deg,var(--tm-green)_0%,transparent_55%)] opacity-12"
                    : "bg-[linear-gradient(145deg,var(--tm-green)_0%,transparent_50%)] opacity-20"
              )}
              aria-hidden
            />
            {isGreen && (
              <div className="absolute inset-0 z-[1] bg-espresso/10" aria-hidden />
            )}

            <span
              className={cn(
                "gathering-chip absolute left-5 top-5 z-10 md:left-7 md:top-7",
                isGreen ? "bg-cream/92 text-espresso" : "gathering-chip--warm"
              )}
            >
              {space.chip}
            </span>

            <span
              className="section-ghost gathering-index pointer-events-none absolute -bottom-2 -right-1 z-0 font-display text-[clamp(5rem,16vw,11rem)] leading-none will-change-transform md:-bottom-4 md:right-2"
              aria-hidden
            >
              {space.index}
            </span>
          </div>
        </div>

        <div
          className={cn(
            "md:col-span-5",
            reversed ? "md:order-1 md:col-start-1" : "md:col-start-8"
          )}
        >
          <p
            className={cn(
              "eyebrow",
              isGreen ? "text-gold-soft" : "text-green"
            )}
          >
            {space.eyebrow}
          </p>
          <h3
            className={cn(
              "mt-5 font-display text-[clamp(2.35rem,5vw,4rem)] leading-[0.98]",
              isGreen ? "text-cream" : "text-espresso"
            )}
          >
            {space.title}
          </h3>
          <div className="mt-7 flex h-[3px] w-28 overflow-hidden rounded-full">
            <span className="h-full flex-[2] bg-green" />
            <span className="h-full flex-1 bg-gold-soft" />
          </div>
          <p
            className={cn(
              "mt-8 max-w-md text-lg leading-relaxed",
              isGreen ? "text-cream/82" : "text-muted"
            )}
          >
            {space.copy}
          </p>
          <div className="mt-10 md:mt-12">
            <Magnetic strength={0.38}>
              <ButtonLink
                href={space.href}
                variant={isGreen ? "on-green" : "green"}
                className="px-8 py-4 text-base md:min-h-[3.25rem] md:px-10 md:py-4 md:text-[1.02rem]"
                scroll={!space.external}
                target={space.external ? "_blank" : undefined}
                rel={space.external ? "noopener noreferrer" : undefined}
                aria-label={space.ariaLabel}
              >
                {space.cta}
              </ButtonLink>
            </Magnetic>
          </div>
        </div>
      </div>
    </article>
  );
}

/** Intro → Family → Private in one horizontal track (reverse scroll) */
export function GatheringPinnedTrack({
  trackRef,
  className,
}: {
  trackRef: RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  return (
    <div
      ref={trackRef}
      className={cn(
        "flex h-full w-max flex-row flex-nowrap will-change-transform transform-gpu",
        className
      )}
    >
      <SpacePanel space={SPACES[1]} reversed priority horizontal />
      <SpacePanel space={SPACES[0]} priority horizontal />
      <GatheringIntroPanel horizontal />
    </div>
  );
}

/** @deprecated Use GatheringPinnedTrack in ChefSpecialsScene */
export function GatheringSpaceTrack({
  trackRef,
  className,
}: {
  trackRef: RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  return (
    <div
      ref={trackRef}
      className={cn(
        "flex h-full w-max flex-row will-change-transform",
        className
      )}
    >
      <SpacePanel space={SPACES[1]} reversed />
      <SpacePanel space={SPACES[0]} priority />
    </div>
  );
}

/** Family + Private horizontal scroll only — used on mobile fallback */
export function GatheringSpacesHorizontal() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      const trackEl = track.current;
      if (!section || !trackEl) return;

      const getScrollDistance = () =>
        Math.max(0, trackEl.scrollWidth - window.innerWidth);

      const setup = () => {
        const distance = getScrollDistance();
        if (distance <= 0) return false;

        gsap.set(trackEl, { x: -distance });

        gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: `top top+=${HEADER_OFFSET}`,
            end: () => `+=${distance}`,
            pin: true,
            pinType: "transform",
            scrub: getHorizontalScrub(),
            invalidateOnRefresh: true,
            anticipatePin: 0,
          },
        }).fromTo(
          trackEl,
          { x: () => -getScrollDistance(), force3D: true },
          { x: 0, ease: "none", force3D: true },
          0
        );

        ScrollTrigger.refresh();
        return true;
      };

      if (!setup()) {
        let attempts = 0;
        const retry = () => {
          if (setup() || attempts++ > 60) return;
          requestAnimationFrame(retry);
        };
        requestAnimationFrame(retry);
      }

      const refresh = () => ScrollTrigger.refresh();
      trackEl.querySelectorAll("img").forEach((img) => {
        if (!img.complete) img.addEventListener("load", refresh, { once: true });
      });
      window.addEventListener("load", refresh);
      return () => window.removeEventListener("load", refresh);
    },
    { scope: root }
  );

  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <section ref={root} className="gatherings relative overflow-hidden bg-cream">
      <div ref={track} className="flex w-max flex-row will-change-transform">
        <SpacePanel space={SPACES[1]} reversed />
        <SpacePanel space={SPACES[0]} priority />
      </div>
    </section>
  );
}

export function GatheringSpacesVertical() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!root.current) return;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (!reduced) {
        gsap.from(".gathering-intro-content", {
          y: 36,
          opacity: 0,
          duration: 1.15,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 72%" },
        });
      }
      bindSectionGhostParallax(root.current);
    },
    { scope: root }
  );

  return (
    <section ref={root} id="gatherings" data-ghost-trigger className="gatherings relative overflow-hidden bg-cream">
      <GatheringIntroPanel className="min-h-0 w-full py-16 md:py-32" horizontal={false} />
      <SpacePanel space={SPACES[0]} priority horizontal={false} />
      <SpacePanel space={SPACES[1]} reversed priority horizontal={false} />
    </section>
  );
}

/** @deprecated Use GatheringScene */
export function GatheringSpaces() {
  const [stackVertical, setStackVertical] = useState(false);

  useLayoutEffect(() => {
    setStackVertical(shouldStackDishesVertically());
  }, []);

  return stackVertical ? (
    <GatheringSpacesVertical />
  ) : (
    <GatheringSpacesHorizontal />
  );
}
