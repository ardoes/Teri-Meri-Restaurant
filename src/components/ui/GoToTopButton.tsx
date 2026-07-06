"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { scrollToTop } from "@/lib/scroll-nav";
import { SliceButtonLayers } from "@/components/ui/SliceButtonLayers";

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M12 19V5M6 13l6-6 6 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GoToTopButton() {
  const pathname = usePathname();
  const isMenuPage = pathname === "/menu";
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(false);
  const pulseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const threshold = 220;
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(
    () => () => {
      if (pulseTimerRef.current !== null) {
        window.clearTimeout(pulseTimerRef.current);
      }
    },
    []
  );

  const handleClick = useCallback(() => {
    setPulse(true);
    if (pulseTimerRef.current !== null) {
      window.clearTimeout(pulseTimerRef.current);
    }
    pulseTimerRef.current = window.setTimeout(() => {
      setPulse(false);
      pulseTimerRef.current = null;
    }, 960);

    scrollToTop({ duration: 1.15, immediate: false });
  }, []);

  return (
    <div
      className={cn(
        "go-top-wrap pointer-events-none fixed z-[45]",
        isMenuPage ? "go-top-wrap--with-cart" : "go-top-wrap--solo",
        visible && "go-top-wrap--visible"
      )}
    >
      <button
        type="button"
        onClick={handleClick}
        className={cn("go-top-slice", pulse && "go-top-slice--pulse")}
        aria-label="Go to top"
        data-cursor="hover"
      >
        <SliceButtonLayers />
        <ChevronUpIcon className="go-top-slice__icon" />
      </button>
    </div>
  );
}
