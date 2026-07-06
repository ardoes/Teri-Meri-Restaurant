import { HERO_LOGO } from "@/lib/assets";

/**
 * Every raster asset shipped in `public/images` (homepage, menu, brand).
 * DOM `<img>` / `srcset` URLs are merged at runtime so nothing is missed.
 */
export const SITE_IMAGE_MANIFEST = [
  HERO_LOGO,
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
  "/images/menu/biryani.png",
  "/images/menu/curries.png",
  "/images/menu/fried-rice.png",
  "/images/menu/seafood.png",
  "/images/menu/tandoor.png",
] as const;

export type PreloadProgress = {
  loaded: number;
  total: number;
  /** 0–100 */
  percent: number;
};

function normalizeAssetUrl(src: string) {
  if (src.startsWith("data:") || src.startsWith("blob:")) return null;
  try {
    const url = new URL(src, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    return `${url.pathname}${url.search}`;
  } catch {
    return src.startsWith("/") ? src : null;
  }
}

/** Manifest + every image already in the SSR markup. */
export function collectPreloadImageUrls(): string[] {
  const urls = new Set<string>(SITE_IMAGE_MANIFEST);

  document.querySelectorAll<HTMLImageElement>("img[src]").forEach((img) => {
    const src = img.getAttribute("src");
    if (!src) return;
    const normalized = normalizeAssetUrl(src);
    if (normalized) urls.add(normalized);
  });

  document.querySelectorAll<HTMLImageElement>("img[srcset]").forEach((img) => {
    const srcset = img.getAttribute("srcset");
    if (!srcset) return;
    srcset.split(",").forEach((part) => {
      const candidate = part.trim().split(/\s+/)[0];
      if (!candidate) return;
      const normalized = normalizeAssetUrl(candidate);
      if (normalized) urls.add(normalized);
    });
  });

  return [...urls];
}

async function preloadImage(src: string) {
  const img = new Image();
  await new Promise<void>((resolve) => {
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
  if (img.decode) {
    try {
      await img.decode();
    } catch {
      /* decode can fail on older browsers — load event is enough */
    }
  }
}

function waitForWindowLoad() {
  if (document.readyState === "complete") return Promise.resolve();
  return new Promise<void>((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true });
  });
}

/**
 * Load fonts, decode every site image, then wait for `window.load`.
 * Progress reflects real completion — no timers or fake caps.
 */
export async function preloadSiteAssets(
  onProgress?: (progress: PreloadProgress) => void
): Promise<void> {
  const imageUrls = collectPreloadImageUrls();
  const total = imageUrls.length + 1;
  let loaded = 0;

  const report = () => {
    onProgress?.({
      loaded,
      total,
      percent: total ? Math.round((loaded / total) * 100) : 100,
    });
  };

  await document.fonts.ready;
  loaded += 1;
  report();

  await Promise.all(
    imageUrls.map(async (src) => {
      await preloadImage(src);
      loaded += 1;
      report();
    })
  );

  await waitForWindowLoad();
}
