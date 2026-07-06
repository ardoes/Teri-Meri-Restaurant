"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { preloadSiteAssets } from "@/lib/preload-assets";
import { Wordmark } from "@/components/ui/Wordmark";
import styles from "./preloader.module.css";

function signalReady() {
  (window as unknown as { __tmReady?: boolean }).__tmReady = true;
  window.dispatchEvent(new Event("app:ready"));
  ScrollTrigger.refresh();
}

function applyLoadProgress(
  root: HTMLDivElement | null,
  percent: number
) {
  const countEl = root?.querySelector<HTMLElement>(".pl-count");
  const lineFill = root?.querySelector<HTMLElement>(".pl-line-fill");
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));

  if (countEl) {
    countEl.textContent = String(clamped).padStart(2, "0");
  }
  if (lineFill) {
    lineFill.style.width = `${clamped}%`;
  }
}

function splitOffset() {
  return Math.min(window.innerWidth * 0.26, 240);
}

/**
 * Premium gold preloader — real asset loading (fonts + every image decoded)
 * drives the progress bar; curtain lifts only when loading is truly done.
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
      applyLoadProgress(root.current, 0);

      const finish = () => {
        document.body.style.overflow = "";
        signalReady();
        setDone(true);
      };

      let introDone = false;
      let assetsDone = false;

      const runExit = () => {
        applyLoadProgress(root.current, 100);

        if (prefersReduced) {
          finish();
          return;
        }

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
        if (introDone && assetsDone) runExit();
      };

      preloadSiteAssets((progress) => {
        applyLoadProgress(root.current, progress.percent);
      }).then(() => {
        assetsDone = true;
        tryExit();
      });

      if (prefersReduced) {
        introDone = true;
        return () => {
          document.body.style.overflow = "";
        };
      }

      gsap.set(".pl-mark", { opacity: 0, scale: 0.9, y: 12, filter: "blur(8px)" });
      gsap.set(".pl-mark-inner", { clipPath: "inset(100% 0 0 0)" });
      gsap.set(".pl-line-fill", { width: "0%" });

      const intro = gsap.timeline({
        defaults: { ease: "expo.out" },
        onComplete: () => {
          introDone = true;
          tryExit();
        },
      });

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
        );

      return () => {
        document.body.style.overflow = "";
        intro.kill();
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
            <p className="flex flex-wrap items-baseline justify-center gap-x-[0.32em] text-center font-display text-[clamp(1.15rem,4.2vw,3.25rem)] font-medium uppercase leading-none tracking-[0.12em] text-espresso sm:flex-nowrap sm:tracking-[0.14em] md:tracking-[0.18em]">
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
                  style={{ width: "0%" }}
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
