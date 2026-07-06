"use client";

import { useRef, useState, useLayoutEffect, useEffect } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { HEADER_OFFSET, getHorizontalScrub } from "@/lib/scroll-constants";
import { panelTrackClass, shouldStackDishesVertically } from "@/lib/motion-prefs";
import { cn } from "@/lib/utils";

type DishImage = {
  src: string;
  alt: string;
  position?: string;
};

type Dish = {
  index: string;
  name: string;
  badge?: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
  imageGrid?: DishImage[];
  tagline: string;
  desc: string;
  notes: string[];
  gradient: string;
};

export const DISHES: Dish[] = [
  {
    index: "01",
    name: "Biryani",
    badge: "Zafrani",
    image: "/images/chef-special-biryani.jpg",
    imageAlt: "Zafrani biryani with saffron rice and slow-cooked meat",
    tagline: "The long-simmered heirloom",
    desc: "Aged basmati layered with saffron, slow-cooked meat and whole spice, sealed under dough and steamed until every grain stands apart.",
    notes: ["Saffron", "Dum-sealed", "Whole spice"],
    gradient:
      "bg-[linear-gradient(135deg,var(--tm-orange)_0%,var(--tm-marigold)_55%,var(--tm-gold)_100%)]",
  },
  {
    index: "02",
    name: "Butter Chicken",
    image: "/images/chef-special-butter-chicken.jpg",
    imageAlt: "Butter chicken with naan and fresh salad",
    imagePosition: "center 62%",
    tagline: "Tender chicken, finished with melting butter.",
    desc: "Tandoor-charred chicken folded into a slow tomato and cardamom gravy, finished with cream and a whisper of fenugreek.",
    notes: ["Tandoor", "Tomato & cardamom", "Cream finish"],
    gradient:
      "bg-[linear-gradient(135deg,var(--tm-orange-deep)_0%,var(--tm-orange)_55%,var(--tm-marigold)_100%)]",
  },
  {
    index: "03",
    name: "Kebabs",
    image: "/images/chef-special-kebabs.jpg",
    imageAlt: "Tandoori kebabs with mint chutney and fresh garnishes",
    imagePosition: "center 50%",
    tagline: "Juicy, smoky, straight off the flames.",
    desc: "Hand-minced and hung over coals, our seekh and galouti kebabs melt at the edges and hold the memory of the fire.",
    notes: ["Coal-grilled", "Hand-minced", "Melt-soft"],
    gradient:
      "bg-[linear-gradient(135deg,var(--tm-green)_0%,var(--tm-gold)_60%,var(--tm-marigold)_100%)]",
  },
];

function DishImageFrame({
  dish,
  className,
  eager = false,
}: {
  dish: Dish;
  className?: string;
  eager?: boolean;
}) {
  const loadEager = eager || dish.index === "01";

  return (
    <div
      data-cursor="view"
      className={cn(
        "group/dish-image dish-image-card relative aspect-square w-full min-h-[14rem] overflow-hidden rounded-[2rem] ring-1 ring-cream/20 shadow-[0_24px_60px_-12px_rgba(38,27,22,0.45)] sm:min-h-[16rem]",
        className
      )}
    >
      <div className="dish-media__inner absolute inset-0 overflow-hidden">
        <Image
          src={dish.image!}
          alt={dish.imageAlt ?? dish.name}
          fill
          quality={75}
          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 42vw, 640px"
          className="object-cover object-center"
          style={
            dish.imagePosition ? { objectPosition: dish.imagePosition } : undefined
          }
          priority={loadEager}
          loading={loadEager ? "eager" : "lazy"}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[2] bg-espresso/10" />
    </div>
  );
}

function DishImageGridFrame({
  images,
  className,
}: {
  images: DishImage[];
  className?: string;
}) {
  const [hero, topRight, bottom] = images;

  return (
    <div
      data-cursor="view"
      className={cn(
        "group/dish-image relative aspect-square w-full overflow-hidden rounded-[2rem] bg-espresso/20 p-2 ring-1 ring-cream/20 shadow-[0_24px_60px_-12px_rgba(38,27,22,0.45)] md:p-2.5",
        className
      )}
    >
      <div className="absolute inset-2 grid grid-cols-2 grid-rows-2 gap-2 transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover/dish-image:scale-[1.04]">
        {[hero, topRight].map((item) => (
          <div
            key={item.src}
            className="relative h-full min-h-0 overflow-hidden rounded-[1rem]"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              quality={100}
              sizes="(max-width: 768px) 45vw, 20vw"
              className="object-cover object-center"
              style={item.position ? { objectPosition: item.position } : undefined}
            />
          </div>
        ))}
        <div className="relative col-span-2 h-full min-h-0 overflow-hidden rounded-[1rem]">
          <Image
            src={bottom.src}
            alt={bottom.alt}
            fill
            quality={100}
            sizes="(max-width: 768px) 90vw, 42vw"
            className="object-cover object-center"
            style={
              bottom.position ? { objectPosition: bottom.position } : undefined
            }
          />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-espresso/10" />
    </div>
  );
}

export function DishPanel({
  dish,
  horizontal = true,
}: {
  dish: Dish;
  horizontal?: boolean;
}) {
  const hasVisual = Boolean(dish.image || dish.imageGrid?.length);

  return (
    <article
      className={cn(
        "dish-panel group relative flex items-center justify-center overflow-hidden py-8 sm:py-10",
        panelTrackClass(horizontal)
      )}
    >
      <div
        className={cn(
          "absolute inset-0 origin-center scale-100 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110",
          dish.gradient
        )}
      />

      <span className="pointer-events-none absolute -right-6 top-4 select-none font-display text-[38vw] leading-none text-cream/10 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 md:text-[26vw]">
        {dish.index}
      </span>

      <div className="container-tm relative z-10 grid w-full max-w-[100rem] grid-cols-1 items-center gap-8 px-4 sm:gap-10 sm:px-6 md:-translate-y-4 md:grid-cols-12 md:gap-10">
        <div className={cn(hasVisual ? "md:col-span-6" : "md:col-span-7")}>
          <p className="text-xs uppercase tracking-[0.28em] text-cream/80 sm:text-sm sm:tracking-[0.3em]">
            Chef&apos;s Specials · {dish.index}
          </p>
          <div className="relative mt-4 w-fit max-w-full">
            <h3 className="relative z-0 font-display text-[clamp(2.75rem,10vw,10rem)] leading-[0.88] text-cream drop-shadow-[0_8px_30px_rgba(38,27,22,0.35)]">
              {dish.name}
            </h3>
            {dish.badge ? (
              <span
                aria-hidden
                className="pointer-events-none absolute left-[0.2em] top-[0.08em] z-10 md:left-[0.45em] md:top-[0.18em]"
              >
                <span className="dish-badge-float inline-block rounded-full bg-orange/90 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-cream shadow-[0_8px_20px_rgba(38,27,22,0.35)] backdrop-blur-sm">
                  {dish.badge}
                </span>
              </span>
            ) : null}
          </div>
          <p className="mt-3 font-display text-xl italic text-cream/90 sm:mt-4 sm:text-2xl md:text-3xl">
            {dish.tagline}
          </p>
        </div>

        {dish.imageGrid?.length ? (
          <div className="mx-auto w-full max-w-[18rem] self-center sm:max-w-sm md:col-span-5 md:col-start-8 md:max-w-[26rem] lg:max-w-[30rem]">
            <DishImageGridFrame images={dish.imageGrid} />
          </div>
        ) : dish.image ? (
          <div className="mx-auto w-full max-w-[18rem] self-center sm:max-w-sm md:col-span-5 md:col-start-8 md:max-w-[26rem] lg:max-w-[30rem]">
            <DishImageFrame dish={dish} eager={horizontal} />
          </div>
        ) : (
          <div className="md:col-span-5 md:col-start-8">
            <div className="glass-dark rounded-[1.75rem] p-8 text-cream md:p-10">
              <p className="text-lg leading-relaxed text-cream/90">{dish.desc}</p>
              <ul className="mt-7 flex flex-wrap gap-3">
                {dish.notes.map((n) => (
                  <li
                    key={n}
                    className="rounded-full border border-cream/30 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-cream/90"
                  >
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

/** Sticky backdrop — a single dish panel (e.g. Kebabs under Gatherings intro) */
export function DishBackdropPanel({ dish = DISHES[0] }: { dish?: Dish }) {
  return <DishPanel dish={dish} />;
}

export function SignatureChapters({ forceVertical = false }: { forceVertical?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [stackVertical, setStackVertical] = useState(forceVertical);

  useLayoutEffect(() => {
    if (forceVertical) {
      setStackVertical(true);
      return;
    }

    setStackVertical(shouldStackDishesVertically());

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px)");
    const onChange = () => setStackVertical(shouldStackDishesVertically());
    motion.addEventListener("change", onChange);
    mobile.addEventListener("change", onChange);
    return () => {
      motion.removeEventListener("change", onChange);
      mobile.removeEventListener("change", onChange);
    };
  }, [forceVertical]);

  useGSAP(
    () => {
      if (forceVertical || stackVertical || shouldStackDishesVertically()) return;

      const section = root.current;
      const trackEl = track.current;
      if (!section || !trackEl) return;

      const getScrollDistance = () =>
        Math.max(0, trackEl.scrollWidth - window.innerWidth);

      const getReleaseBuffer = () => window.innerHeight * 0.22;

      const setup = () => {
        const distance = getScrollDistance();
        if (distance <= 0) return false;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: `top top+=${HEADER_OFFSET}`,
            end: () => `+=${distance + getReleaseBuffer()}`,
            pin: true,
            pinType: "transform",
            scrub: getHorizontalScrub(),
            invalidateOnRefresh: true,
            anticipatePin: 0,
          },
        });

        tl.to(
          trackEl,
          {
            x: () => -getScrollDistance(),
            duration: 0.82,
            ease: "none",
            force3D: true,
          },
          0
        ).to({}, { duration: 0.18 });

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
    { scope: root, dependencies: [stackVertical, forceVertical] }
  );

  useEffect(() => {
    if (forceVertical || stackVertical) return;
    const t = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => clearTimeout(t);
  }, [stackVertical]);

  return (
    <section
      id={forceVertical ? "signature-dishes" : "dishes"}
      ref={root}
      className="relative overflow-hidden"
    >
      <div
        ref={track}
        className={cn(
          "flex",
          stackVertical || forceVertical
            ? "flex-col"
            : "w-max flex-row will-change-transform"
        )}
      >
        {DISHES.map((dish) => (
          <DishPanel
            key={dish.index}
            dish={dish}
            horizontal={!(stackVertical || forceVertical)}
          />
        ))}
      </div>
    </section>
  );
}
