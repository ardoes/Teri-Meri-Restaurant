"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  HERO_LOGO,
  HERO_LOGO_HEIGHT,
  HERO_LOGO_WIDTH,
} from "@/lib/assets";
import { VERTICAL_SCRUB } from "@/lib/scroll-constants";

export function HeroChapter() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduced) return;

      // Entrance — calm and controlled
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      tl.from(".h-top", { yPercent: -100, opacity: 0, duration: 0.7 }, 0)
        .from(".h-head", { yPercent: 100, opacity: 0, duration: 1.1 }, 0.05)
        .from(".h-dish", { scale: 0.92, opacity: 0, duration: 1.15 }, 0.2)
        .from(
          ".h-sticker",
          { scale: 0.75, opacity: 0, duration: 0.65, stagger: 0.12 },
          0.65
        )
        .from(".h-bubbly", { y: 30, opacity: 0, duration: 0.95 }, 0.5)
        .from(".h-fade", { y: 20, opacity: 0, duration: 0.85, stagger: 0.1 }, 0.72);

      const start = () => tl.play();
      if ((window as unknown as { __tmReady?: boolean }).__tmReady) start();
      else window.addEventListener("app:ready", start, { once: true });

      // Smoothly fade the whole hero out as the next section rises over it.
      // Uses literal scroll positions (no element trigger) so the CSS-sticky
      // pinning can't collapse the start/end.
      gsap.to(root.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: () => window.innerHeight * 0.9,
          scrub: VERTICAL_SCRUB,
          invalidateOnRefresh: true,
        },
      });

      // Mouse-reactive parallax — each layer drifts by a different amount for
      // depth. Smooth via quickTo setters.
      const makeLayer = (selector: string, amount: number) => {
        const els = gsap.utils.toArray<HTMLElement>(selector);
        const setters = els.map((el) => ({
          x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power3" }),
          y: gsap.quickTo(el, "y", { duration: 0.8, ease: "power3" }),
        }));
        return (nx: number, ny: number) =>
          setters.forEach((s) => {
            s.x(nx * amount);
            s.y(ny * amount);
          });
      };

      const layers = [
        makeLayer(".h-head", 18),
        makeLayer(".h-dish", 40),
        makeLayer(".h-bubbly", 12),
        makeLayer(".h-sticker", 26),
        makeLayer(".h-fade", 10),
      ];

      const onMove = (e: MouseEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        layers.forEach((set) => set(nx, ny));
      };

      window.addEventListener("mousemove", onMove);
      return () => window.removeEventListener("mousemove", onMove);
    },
    { scope: root }
  );

  return (
    <section id="top" ref={root} className="relative h-screen overflow-hidden">
      {/* Ambient vibrant washes */}
      <div className="pointer-events-none absolute -left-40 top-10 h-[34rem] w-[34rem] rounded-full bg-green/12 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 top-1/3 h-[30rem] w-[30rem] rounded-full bg-orange/18 blur-[120px]" />

      {/* Everything that drifts up on scroll */}
      <div className="h-content absolute inset-0">
        {/* Eyebrow row */}
        <div className="container-tm relative z-30 flex items-center justify-between pt-28">
          <p className="h-top h-text eyebrow">Modern Indian · Fine Dining</p>
          <p className="h-top h-text eyebrow hidden text-espresso/45 md:block">
            Est. 2025
          </p>
        </div>

        {/* Oversized outlined poster headline (single colour) */}
        <div className="pointer-events-none absolute inset-x-0 top-[18%] z-0 flex justify-center overflow-hidden px-2">
          <h1 className="h-head h-text headline-outline whitespace-nowrap text-center font-display font-black leading-[0.8] text-[clamp(2.75rem,14vw,14rem)]">
            THE&nbsp;BIRYANI
          </h1>
        </div>

        {/* Floating biryani + playful decorations (flex-centred, no transform
            on the animated layer so mouse parallax stays clean) */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="h-dish relative w-[min(68vw,30rem)] sm:w-[min(58vw,30rem)]">
            {/* Slow dashed garnish arc */}
            <div className="dish-rim-spin absolute inset-[4%] rounded-full border border-dashed border-espresso/15" />
            <span className="absolute left-[10%] top-[16%] h-2.5 w-2.5 rounded-full bg-green shadow-[0_4px_10px_rgba(38,27,22,0.3)]" />
            <span className="absolute right-[12%] top-[24%] h-2 w-2 rounded-full bg-orange shadow-[0_4px_10px_rgba(38,27,22,0.3)]" />
            <span className="absolute bottom-[16%] right-[20%] h-2 w-2 rounded-full bg-gold shadow-[0_4px_10px_rgba(38,27,22,0.3)]" />

            <div className="float-dish relative">
            <Image
              src="/images/biryani.png"
              alt="Teri Meri biryani in a copper handi"
              width={664}
              height={548}
              priority
              className="h-auto w-full drop-shadow-[0_40px_55px_rgba(38,27,22,0.38)]"
            />

            {/* Googly eyes — placed low, on the copper bowl */}
            <div className="absolute left-1/2 top-[74%] flex -translate-x-1/2 gap-2 md:gap-3">
              <span className="flex h-7 w-7 rotate-[-8deg] items-center justify-center rounded-full border-2 border-espresso/15 bg-cream shadow-[0_6px_14px_rgba(38,27,22,0.35)] md:h-9 md:w-9">
                <span className="block h-2.5 w-2.5 translate-y-0.5 rounded-full bg-espresso md:h-3.5 md:w-3.5" />
              </span>
              <span className="flex h-7 w-7 rotate-[8deg] items-center justify-center rounded-full border-2 border-espresso/15 bg-cream shadow-[0_6px_14px_rgba(38,27,22,0.35)] md:h-9 md:w-9">
                <span className="block h-2.5 w-2.5 translate-y-0.5 rounded-full bg-espresso md:h-3.5 md:w-3.5" />
              </span>
            </div>
            </div>
          </div>
        </div>

        {/* Hand-stuck stickers */}
        <span className="h-sticker sticker float-sticker-left absolute left-[6%] top-[32%] z-30 text-sm md:text-base">
          Slow Cooked
        </span>
        <span className="h-sticker sticker float-sticker-right absolute right-[6%] top-[44%] z-30 text-sm md:text-base">
          Bold Spice
        </span>

        {/* Brand logo — sits under the pot */}
        <div className="h-bubbly h-text pointer-events-none absolute inset-x-0 bottom-[8%] z-10 flex justify-center px-3 sm:bottom-[9%]">
          <div className="float-soft w-full max-w-[min(96vw,46rem)] sm:max-w-[min(92vw,44rem)] md:max-w-[min(86vw,42rem)]">
            <Image
              src={HERO_LOGO}
              alt="Teri Meri Biryani & Restaurant"
              width={HERO_LOGO_WIDTH}
              height={HERO_LOGO_HEIGHT}
              quality={100}
              priority
              unoptimized
              sizes="(max-width: 640px) 96vw, (max-width: 1024px) 92vw, 42rem"
              className="h-auto w-full drop-shadow-[0_14px_30px_rgba(38,27,22,0.28)]"
            />
          </div>
        </div>

        {/* Flanking copy */}
        <p className="h-fade h-text absolute bottom-[8%] left-[3%] z-30 hidden max-w-[12rem] text-sm leading-relaxed text-espresso/80 sm:block md:max-w-[15rem] md:text-base">
          Slow-cooked over a gentle flame, our aged basmati locks in saffron and
          whole spice beneath a sealed-dough crust.
        </p>
        <p className="h-fade h-text absolute bottom-[8%] right-[3%] z-30 hidden max-w-[12rem] text-right text-sm leading-relaxed text-espresso/80 sm:block md:max-w-[15rem] md:text-base">
          Layered with tender, spice-braised meat and crisp fried onion —
          crafted to be remembered, since 2025.
        </p>
      </div>
    </section>
  );
}
