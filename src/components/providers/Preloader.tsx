"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Wordmark } from "@/components/ui/Wordmark";
import styles from "./preloader.module.css";

const MIN_MS = 1500;
const MAX_MS = 6000;

/** Every image used across the homepage + menu — preloaded during the curtain. */
const PRELOAD_IMAGES = [
  "/images/logo.png",
  "/images/biryani.png",
  "/images/story-dining.png",
  "/images/story-kitchen.jpg",
  "/images/craft-biryani.jpg",
  "/images/chef-special-biryani.jpg",
  "/images/chef-special-butter-chicken.jpg",
  "/images/chef-special-kebabs.jpg",
  "/images/chef-special-kebab-malai.jpg",
  "/images/chef-special-kebab-red.jpg",
  "/images/chef-special-kebab-tandoori.jpg",
  "/images/gathering-family-dining.png",
  "/images/gathering-private-dining.png",
];

function signalReady() {
  (window as unknown as { __tmReady?: boolean }).__tmReady = true;
  window.dispatchEvent(new Event("app:ready"));
  ScrollTrigger.refresh();
}

/** Preload a fixed manifest of images; resolves once all have settled. */
function preloadImages() {
  return Promise.all(
    PRELOAD_IMAGES.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        })
    )
  ).then(() => undefined);
}

/**
 * Resolve once the page is truly ready to reveal:
 * fonts + document load + all manifest images decoded — but never past MAX_MS.
 */
function waitForReady() {
  return new Promise<void>((resolve) => {
    let settled = false;
    const started = performance.now();

    let assetsReady = false;
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    Promise.all([fontsReady, preloadImages()]).then(() => {
      assetsReady = true;
    });

    const tryResolve = () => {
      if (settled) return;
      const elapsed = performance.now() - started;
      const loaded = document.readyState === "complete";
      if ((elapsed >= MIN_MS && loaded && assetsReady) || elapsed >= MAX_MS) {
        settled = true;
        resolve();
      }
    };

    const tick = () => {
      tryResolve();
      if (!settled) requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("load", tryResolve, { once: true });
  });
}

function splitOffset() {
  return Math.min(window.innerWidth * 0.26, 240);
}

/**
 * Premium gold preloader — split headline, centered wordmark reveal,
 * progress line, then curtain lift into the hero (~1.5–2.5s).
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      document.body.style.overflow = "hidden";

      const finish = () => {
        document.body.style.overflow = "";
        signalReady();
        setDone(true);
      };

      if (prefersReduced) {
        finish();
        return;
      }

      const countEl = root.current?.querySelector<HTMLElement>(".pl-count");
      const counter = { v: 0 };

      gsap.set(".pl-mark", { opacity: 0, scale: 0.9, y: 12, filter: "blur(8px)" });
      gsap.set(".pl-mark-inner", { clipPath: "inset(100% 0 0 0)" });
      gsap.set(".pl-line-fill", { width: "0%" });

      const intro = gsap.timeline({ defaults: { ease: "expo.out" } });

      intro
        .from(".pl-left, .pl-right", {
          y: 28,
          opacity: 0,
          duration: 0.55,
          stagger: 0.04,
        })
        .to({}, { duration: 0.38 })
        .to(
          ".pl-left",
          {
            x: () => -splitOffset(),
            duration: 0.72,
            ease: "expo.inOut",
          },
          "split"
        )
        .to(
          ".pl-right",
          {
            x: () => splitOffset(),
            duration: 0.72,
            ease: "expo.inOut",
          },
          "split"
        )
        .to(
          ".pl-mark",
          {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "expo.out",
          },
          "split+=0.22"
        )
        .to(
          ".pl-mark-inner",
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.55,
            ease: "expo.out",
          },
          "split+=0.18"
        )
        .to(
          counter,
          {
            v: 100,
            duration: 1.05,
            ease: "power2.inOut",
            onUpdate: () => {
              if (countEl)
                countEl.textContent = String(Math.round(counter.v)).padStart(
                  2,
                  "0"
                );
            },
          },
          "split"
        )
        .to(
          ".pl-line-fill",
          { width: "100%", duration: 1.05, ease: "power2.inOut" },
          "split"
        );

      let introDone = false;
      let readyDone = false;

      const runExit = () => {
        gsap
          .timeline({ defaults: { ease: "expo.inOut" } })
          .to(".pl-content", { opacity: 0, duration: 0.28, ease: "power2.in" })
          .to(
            ".pl-panel",
            {
              yPercent: -100,
              duration: 0.82,
              stagger: 0.07,
              onComplete: finish,
            },
            "<0.08"
          );
      };

      const tryExit = () => {
        if (introDone && readyDone) runExit();
      };

      intro.eventCallback("onComplete", () => {
        introDone = true;
        tryExit();
      });

      waitForReady().then(() => {
        readyDone = true;
        tryExit();
      });

      return () => {
        document.body.style.overflow = "";
      };
    },
    { scope: root }
  );

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100]"
      aria-hidden
      role="presentation"
    >
      <div className={`pl-panel ${styles.panelGoldDeep} absolute inset-0`} />
      <div className={`pl-panel ${styles.panelGold} absolute inset-0`}>
        <div className="pl-content relative flex h-full flex-col items-center justify-center px-6">
          <div className="relative flex w-full max-w-5xl items-center justify-center">
            <p className="flex items-baseline whitespace-nowrap font-display text-[clamp(1.35rem,4.2vw,3.25rem)] font-medium uppercase leading-none tracking-[0.14em] text-espresso md:tracking-[0.18em]">
              <span className="pl-left inline-block will-change-transform">
                Two Cities,
              </span>
              <span className="pl-right ml-[0.32em] inline-block will-change-transform">
                One Table
              </span>
            </p>

            <div className="pl-mark pointer-events-none absolute inset-0 flex items-center justify-center will-change-transform">
              <div className="pl-mark-inner overflow-hidden">
                <Wordmark className="text-[clamp(2.75rem,11vw,7.5rem)]" />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-10 flex justify-center px-6 md:bottom-14">
            <div className="flex w-[min(72vw,26rem)] items-center gap-4">
              <div className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-espresso/25">
                <div
                  className={`pl-line-fill absolute inset-y-0 left-0 rounded-full ${styles.lineFill}`}
                />
              </div>
              <span className="pl-count min-w-[2.5ch] font-sans text-sm font-semibold tabular-nums tracking-[0.2em] text-orange">
                00
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
