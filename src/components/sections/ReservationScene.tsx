"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { MENU_SEARCH_PATH } from "@/lib/scroll-constants";

export function ReservationScene() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduced) return;

      gsap.from(".r-line", {
        yPercent: 110,
        opacity: 0,
        duration: 1.15,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 68%" },
      });
      gsap.from(".r-fade", {
        y: 22,
        opacity: 0,
        duration: 0.95,
        ease: "expo.out",
        stagger: 0.09,
        scrollTrigger: { trigger: root.current, start: "top 56%" },
      });

      // Background parallax — moves slower than foreground content
      gsap.fromTo(
        ".r-bg-wash",
        { yPercent: 8 },
        {
          yPercent: -18,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        }
      );

      gsap.fromTo(
        ".r-bg-glow",
        { yPercent: 14, scale: 1.08 },
        {
          yPercent: -10,
          scale: 1.14,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 2.6,
          },
        }
      );

      gsap.fromTo(
        ".r-ghost",
        { yPercent: 6 },
        {
          yPercent: -22,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.6,
          },
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      id="reserve"
      ref={root}
      className="relative flex min-h-screen items-center overflow-hidden bg-cream py-32 text-center"
    >
      {/* Slow-moving background layers */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="r-bg-glow absolute -left-[20%] top-[8%] h-[36rem] w-[36rem] rounded-full bg-orange/10 blur-[120px]" />
        <div className="r-bg-glow absolute -right-[18%] bottom-[6%] h-[32rem] w-[32rem] rounded-full bg-green/12 blur-[120px]" />
        <div className="r-bg-wash absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_100%,rgba(31,91,58,0.14),transparent_70%)]" />
        <span className="r-ghost absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-display text-[26vw] leading-none text-espresso/[0.04]">
          Teri Meri
        </span>
      </div>

      <div className="container-tm relative z-10 mx-auto">
        <p className="r-fade eyebrow">Reservations</p>

        <h2 className="mx-auto mt-8 max-w-4xl text-[clamp(3rem,9vw,9rem)] leading-[0.86]">
          <span className="block overflow-hidden">
            <span className="r-line block text-espresso">Come sit</span>
          </span>
          <span className="block overflow-hidden">
            <span className="r-line block italic text-green">at our table.</span>
          </span>
        </h2>

        <p className="r-fade mx-auto mt-10 max-w-md text-lg text-muted">
          Seatings Wednesday through Sunday. Tasting menu and à la carte. We
          can&rsquo;t wait to cook for you.
        </p>

        <div className="r-fade mt-12 flex justify-center">
          <Magnetic strength={0.45}>
            <ButtonLink
              href={MENU_SEARCH_PATH}
              variant="green"
              className="px-10 py-5 text-lg"
              scroll={false}
            >
              Book your evening
            </ButtonLink>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
