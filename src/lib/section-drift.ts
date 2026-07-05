import { gsap } from "@/lib/gsap";
import { HEADER_OFFSET, VERTICAL_SCRUB } from "@/lib/scroll-constants";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * One scrubbed timeline per section:
 * 1. Fade in (no blur) as the section arrives
 * 2. Hold fully sharp while you read
 * 3. Blur + fade only as you scroll past and leave
 */
export function bindSectionDrift(
  section: HTMLElement | null,
  contentSelector = ".chapter-drift",
  options?: { enterScrub?: number; enterEnd?: string }
) {
  if (!section || prefersReducedMotion()) return;

  const content = section.querySelector<HTMLElement>(contentSelector);
  if (!content) return;

  gsap.set(content, {
    opacity: 1,
    yPercent: 0,
    scale: 1,
    filter: "none",
  });

  const enterWeight = options?.enterEnd === "top 42%" ? 0.14 : 0.1;
  const holdWeight = 0.84;
  const exitWeight = 1 - enterWeight - holdWeight;

  gsap
    .timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: `bottom top+=${HEADER_OFFSET + 16}`,
        scrub: options?.enterScrub ?? VERTICAL_SCRUB,
      },
    })
    .fromTo(
      content,
      { yPercent: 6, opacity: 0.4, filter: "none" },
      { yPercent: 0, opacity: 1, filter: "none", duration: enterWeight, ease: "none" },
      0
    )
    .to(
      content,
      { yPercent: 0, opacity: 1, filter: "none", duration: holdWeight, ease: "none" },
      enterWeight
    )
    .to(
      content,
      {
        yPercent: -3,
        opacity: 0.48,
        filter: "blur(5px)",
        duration: exitWeight,
        ease: "none",
      },
      enterWeight + holdWeight
    );
}

/**
 * Heading stays sharp in view; scales and fades only under the fixed header.
 */
export function bindHeadingExit(
  section: HTMLElement | null,
  headingSelector = ".chapter-heading-exit"
) {
  if (!section || prefersReducedMotion()) return;

  const heading = section.querySelector<HTMLElement>(headingSelector);
  if (!heading) return;

  gsap.set(heading, {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "none",
  });

  const origin = heading.classList.contains("chapter-heading-exit--center")
    ? "center center"
    : "left center";

  gsap.fromTo(
    heading,
    {
      y: 0,
      scale: 1,
      opacity: 1,
      filter: "none",
      transformOrigin: origin,
    },
    {
      y: -28,
      scale: 1.1,
      opacity: 0,
      filter: "blur(8px)",
      transformOrigin: origin,
      ease: "none",
      immediateRender: false,
      scrollTrigger: {
        trigger: heading,
        start: `top ${HEADER_OFFSET}px`,
        end: "top -24px",
        scrub: 0.85,
      },
    }
  );
}

export function bindSectionScrollEffects(
  section: HTMLElement | null,
  options?: {
    contentSelector?: string;
    headingSelector?: string;
    enterScrub?: number;
    enterEnd?: string;
    skipHeading?: boolean;
  }
) {
  if (!section || prefersReducedMotion()) return;

  bindSectionDrift(
    section,
    options?.contentSelector ?? ".chapter-drift",
    options
  );

  if (!options?.skipHeading) {
    bindHeadingExit(section, options?.headingSelector);
  }
}
