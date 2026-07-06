"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { Wordmark } from "@/components/ui/Wordmark";

const HOURS = [{ d: "Daily", t: "12:30 PM – 12:30 AM" }];

const MAPS_URL = "https://maps.app.goo.gl/82Ea7QzncuRPmeq8A";
const INSTAGRAM_URL = "https://www.instagram.com/terimeribiryani/";

export function SiteFooter() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduced) return;

      gsap.set(".f-panel", { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(".f-mark", { y: 28, opacity: 0 });
      gsap.set(".f-item", { y: 18, opacity: 0 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "top 38%",
            scrub: 0.9,
          },
        })
        .fromTo(
          ".f-panel",
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.45,
            stagger: 0.06,
            ease: "none",
          },
          0
        )
        .fromTo(
          ".f-mark",
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, ease: "none" },
          0.08
        )
        .fromTo(
          ".f-item",
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.28, stagger: 0.04, ease: "none" },
          0.12
        );
    },
    { scope: root }
  );

  return (
    <footer ref={root} className="site-footer flex flex-col md:flex-row">
      {/* LEFT — dark muted orange, ~70% */}
      <div className="site-footer-body f-panel flex min-h-[60vh] flex-col justify-between overflow-hidden bg-orange-muted px-8 py-16 md:w-[70%] md:px-16 md:py-24">
        <p className="f-item eyebrow text-cream/60">Teri Meri · Yours &amp; Mine</p>

        <div className="f-mark">
          <Wordmark
            className="text-[clamp(3.5rem,12vw,11rem)]"
            teriClassName="text-cream"
            meriClassName="text-forest"
          />
          <p className="mt-6 max-w-md text-lg text-cream/75">
            Heritage recipes, fresh spice and slow fire — a table set for two,
            and everyone they love.
          </p>
        </div>

        <p className="f-item mt-12 text-sm text-cream/60">
          © 2025 Teri Meri. Crafted with fire, spice &amp; soul.
        </p>
      </div>

      {/* RIGHT — deep forest green, ~30% */}
      <div className="f-panel flex min-h-[60vh] flex-col justify-between gap-10 bg-forest px-8 py-16 text-cream md:w-[30%] md:px-12 md:py-24">
        <div className="f-item">
          <p className="eyebrow text-gold-soft">Visit</p>
          <address className="mt-4 not-italic">
            <Link
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="text-cream/85 underline decoration-transparent underline-offset-4 transition-colors hover:text-cream hover:decoration-gold/50"
            >
              Teri Meri Biryani &amp; Restaurant
              <br />
              Al Muallifin Street, Al Aziziyah District
              <br />
              Jeddah 23342, Saudi Arabia
              <br />
              JCZB2832
            </Link>
          </address>
          <Link
            href="tel:+966535004311"
            data-cursor="hover"
            className="mt-4 inline-block text-cream/70 underline decoration-gold/50 underline-offset-4 transition-colors hover:text-cream"
          >
            +966 53 500 4311
          </Link>
        </div>

        <div className="f-item">
          <p className="eyebrow text-gold-soft">Hours</p>
          <ul className="mt-4 space-y-2 text-cream/85">
            {HOURS.map((h) => (
              <li key={h.d} className="flex justify-between gap-6 text-sm">
                <span>{h.d}</span>
                <span className="text-cream/55">{h.t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="f-item">
          <p className="eyebrow text-gold-soft">Follow</p>
          <ul className="mt-4 space-y-2">
            <li>
              <Link
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="text-cream/75 transition-colors hover:text-gold-soft"
              >
                Instagram
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
