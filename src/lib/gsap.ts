"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * Central GSAP registration. Import { gsap, ScrollTrigger, useGSAP } from
 * "@/lib/gsap" anywhere on the client so plugins register exactly once.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  ScrollTrigger.config({
    limitCallbacks: true,
    ignoreMobileResize: true,
  });
  ScrollTrigger.defaults({
    anticipatePin: 0,
  });
}

export { gsap, ScrollTrigger, useGSAP };
