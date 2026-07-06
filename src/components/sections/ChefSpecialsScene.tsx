"use client";

import { useRef, useState, useLayoutEffect, useEffect } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { CraftChapter } from "@/components/chapters/CraftChapter";
import { MenuChapter, MenuIntroPanel } from "@/components/chapters/MenuChapter";
import { GatheringPinnedTrack, GatheringSpacesVertical } from "@/components/sections/GatheringSpaces";
import {
  DISHES,
  DishPanel,
  SignatureChapters,
} from "@/components/sections/SignatureChapters";
import {
  HEADER_OFFSET,
  getHorizontalScrub,
  GATHERING_SCROLL_STRETCH,
} from "@/lib/scroll-constants";
import { shouldStackDishesVertically } from "@/lib/motion-prefs";
import { onAppReady, refreshScrollScene } from "@/lib/scroll-scene";
import { cn } from "@/lib/utils";

const GATHERING_IMAGES = [
  "/images/gathering-family-dining.png",
  "/images/gathering-private-dining.png",
] as const;

const CHEF_SPECIAL_IMAGES = DISHES.map((dish) => dish.image).filter(
  (src): src is string => Boolean(src)
);

function preloadImages(urls: readonly string[]) {
  urls.forEach((src) => {
    const img = new window.Image();
    img.src = src;
  });
}

const BLANKET_SHADOW =
  "shadow-[0_-30px_70px_-20px_rgba(38,27,22,0.45)]";

function measureTrackDistance(el: HTMLElement, panelCount?: number) {
  const measured = el.scrollWidth - window.innerWidth;
  if (measured > 8) return measured;
  const count = panelCount ?? el.children.length;
  if (count <= 1) return 0;
  return (count - 1) * window.innerWidth;
}

export function ChefSpecialsScene() {
  const root = useRef<HTMLElement>(null);
  const craftSticky = useRef<HTMLDivElement>(null);
  const chefBlanket = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const gatheringBlanket = useRef<HTMLDivElement>(null);
  const gatheringTrack = useRef<HTMLDivElement>(null);
  const [stackVertical, setStackVertical] = useState(false);
  const setupDone = useRef(false);

  useLayoutEffect(() => {
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
  }, []);

  useGSAP(
    () => {
      if (stackVertical || shouldStackDishesVertically()) return;

      const section = root.current;
      const craftEl = craftSticky.current;
      const chefEl = chefBlanket.current;
      const trackEl = track.current;
      const blanketEl = gatheringBlanket.current;
      const gatheringEl = gatheringTrack.current;
      if (
        !section ||
        !craftEl ||
        !chefEl ||
        !trackEl ||
        !blanketEl ||
        !gatheringEl
      )
        return;

      const chefPanels = 1 + DISHES.length;
      const gatherPanels = gatheringEl.children.length || 3;

      const getChefDistance = () =>
        measureTrackDistance(trackEl, chefPanels);

      const getGatheringDistance = () =>
        measureTrackDistance(gatheringEl, gatherPanels);

      let timeline: gsap.core.Timeline | null = null;

      const applyInitialState = () => {
        const gatheringDistance = getGatheringDistance();
        gsap.set(craftEl, { yPercent: 0, force3D: true });
        gsap.set(chefEl, { yPercent: 100, force3D: true });
        gsap.set(blanketEl, { yPercent: 100, force3D: true });
        gsap.set(trackEl, { x: 0, force3D: true });
        gsap.set(gatheringEl, {
          x: -gatheringDistance,
          force3D: true,
        });
      };

      const buildTimeline = () => {
        const chefDistance = getChefDistance();
        const gatheringDistance = getGatheringDistance();
        if (chefDistance <= 0) return false;

        timeline?.scrollTrigger?.kill();
        timeline?.kill();

        applyInitialState();

        const craftHold = window.innerHeight * 0.12;
        const chefBlanketRise = window.innerHeight * 0.55;
        const chefIntroHold = window.innerHeight * 0.03;
        const kebabHold = window.innerHeight * 0.1;
        const gatherBlanketRise = window.innerHeight * 0.72;
        const gatherIntroHold = window.innerHeight * 0.16;
        const familyHold = window.innerHeight * 0.1;
        const privateHold = window.innerHeight * 0.14;

        const getFirstGatherX = () => {
          const distance = getGatheringDistance();
          const panels = gatheringEl.children.length || gatherPanels;
          const step = panels > 1 ? distance / (panels - 1) : 0;
          return -distance + step;
        };
        const gatherMove = gatheringDistance * GATHERING_SCROLL_STRETCH;
        const gatherHalfMove = gatherMove / 2;

        const scrollBudget = {
          craftHold,
          chefBlanketRise,
          chefIntroHold,
          chef: chefDistance,
          kebabHold,
          gatherBlanketRise,
          gatherIntroHold,
          gatherFirst: gatherHalfMove,
          familyHold,
          gatherSecond: gatherHalfMove,
          privateHold,
        };
        const scrollTotal = Object.values(scrollBudget).reduce((a, b) => a + b, 0);
        const w = (px: number) => px / scrollTotal;

        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: `top top+=${HEADER_OFFSET}`,
            end: () => `+=${scrollTotal}`,
            pin: true,
            pinType: "transform",
            scrub: getHorizontalScrub(),
            invalidateOnRefresh: true,
            anticipatePin: 0,
          },
        });

        timeline
          .addLabel("craftHold")
          .to({}, { duration: w(scrollBudget.craftHold) })
          .addLabel("chefBlanket")
          .to(
            chefEl,
            {
              yPercent: 0,
              duration: w(scrollBudget.chefBlanketRise),
              ease: "power3.inOut",
              force3D: true,
            },
            ">"
          )
          .to({}, { duration: w(scrollBudget.chefIntroHold) })
          .addLabel("chefScroll")
          .to(
            trackEl,
            {
              x: () => -getChefDistance(),
              ease: "none",
              force3D: true,
              duration: w(scrollBudget.chef),
            },
            ">"
          )
          .to({}, { duration: w(scrollBudget.kebabHold) })
          .addLabel("gatherBlanket")
          .to(
            blanketEl,
            {
              yPercent: 0,
              duration: w(scrollBudget.gatherBlanketRise),
              ease: "power3.inOut",
              force3D: true,
            },
            ">"
          )
          .addLabel("gatherIntroHold")
          .to({}, { duration: w(scrollBudget.gatherIntroHold) })
          .addLabel("gatherScroll")
          .to(
            gatheringEl,
            {
              x: getFirstGatherX,
              ease: "none",
              force3D: true,
              duration: w(scrollBudget.gatherFirst),
            },
            ">"
          )
          .to({}, { duration: w(scrollBudget.familyHold) })
          .to(
            gatheringEl,
            {
              x: 0,
              ease: "none",
              force3D: true,
              duration: w(scrollBudget.gatherSecond),
            },
            ">"
          )
          .to({}, { duration: w(scrollBudget.privateHold) });

        setupDone.current = true;
        refreshScrollScene();
        return true;
      };

      applyInitialState();
      preloadImages(GATHERING_IMAGES);
      preloadImages(CHEF_SPECIAL_IMAGES);

      let attempts = 0;
      const tryBuild = () => {
        if (buildTimeline() || attempts++ > 150) return;
        requestAnimationFrame(tryBuild);
      };
      tryBuild();

      const onImagesReady = () => refreshScrollScene();
      trackEl.querySelectorAll("img").forEach((img) => {
        if (!img.complete) img.addEventListener("load", onImagesReady, { once: true });
      });
      gatheringEl.querySelectorAll("img").forEach((img) => {
        if (!img.complete) img.addEventListener("load", onImagesReady, { once: true });
      });

      const onReady = () => {
        if (!setupDone.current) tryBuild();
        else refreshScrollScene();
      };
      window.addEventListener("load", onReady);
      onAppReady(onReady);

      return () => {
        window.removeEventListener("load", onReady);
        timeline?.scrollTrigger?.kill();
        timeline?.kill();
        setupDone.current = false;
      };
    },
    { scope: root, dependencies: [stackVertical] }
  );

  useEffect(() => {
    if (stackVertical) return;
    const t1 = window.setTimeout(refreshScrollScene, 350);
    const t2 = window.setTimeout(refreshScrollScene, 1200);
    onAppReady(refreshScrollScene);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [stackVertical]);

  if (stackVertical) {
    return (
      <>
        <CraftChapter disableScrollEffects />
        <MenuChapter />
        <SignatureChapters forceVertical />
        <GatheringSpacesVertical />
      </>
    );
  }

  return (
    <section
      id="dishes"
      ref={root}
      className={cn(
        "relative z-10 h-[calc(100svh-5rem)] overflow-hidden",
        BLANKET_SHADOW
      )}
    >
      <div
        ref={craftSticky}
        className="absolute inset-0 z-0 overflow-hidden bg-green transform-gpu"
      >
        <CraftChapter disableScrollEffects compact />
      </div>

      <div
        ref={chefBlanket}
        className={cn(
          "absolute inset-0 z-10 h-full overflow-hidden bg-cream transform-gpu",
          BLANKET_SHADOW
        )}
      >
        <div
          ref={track}
          className="flex h-[calc(100svh-5rem)] w-max flex-row flex-nowrap transform-gpu"
        >
          <MenuIntroPanel horizontal />
          {DISHES.map((dish) => (
            <DishPanel key={dish.index} dish={dish} horizontal />
          ))}
        </div>

        <div
          id="gatherings"
          ref={gatheringBlanket}
          className={cn(
            "absolute inset-0 z-20 h-full overflow-hidden transform-gpu",
            BLANKET_SHADOW
          )}
        >
          <GatheringPinnedTrack trackRef={gatheringTrack} className="h-full" />
        </div>
      </div>
    </section>
  );
}
