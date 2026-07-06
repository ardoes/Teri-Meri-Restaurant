/** Canonical site URL — matches metadataBase in src/app/layout.tsx */
export const SITE_URL = "https://terimeri.restaurant";

export const SITE_NAME = "Teri Meri";

/** Official business name (SiteFooter address block). */
export const RESTAURANT_NAME = "Teri Meri Biryani & Restaurant";

export const RESTAURANT_PHONE = "+966535004311";

export const RESTAURANT_ADDRESS = {
  streetAddress: "Al Muallifin Street, Al Aziziyah District",
  addressLocality: "Jeddah",
  postalCode: "23342",
  addressCountry: "SA",
} as const;

/** Daily service window (SiteFooter hours). */
export const RESTAURANT_HOURS = {
  opens: "12:30",
  closes: "00:30",
} as const;

export const RESTAURANT_INSTAGRAM_URL =
  "https://www.instagram.com/terimeribiryani/";

export const MENU_URL = `${SITE_URL}/menu`;

/** Brand logo served from public/images (see src/lib/assets.ts). */
export const RESTAURANT_LOGO_URL = `${SITE_URL}/images/logo.png`;

/**
 * Social / OG preview image — dining room photo used in StoryChapter.
 * Path: public/images/story-dining.png
 */
export const OG_IMAGE_PATH = "/images/story-dining.png";
export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`;

const ALL_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

/** schema.org Restaurant JSON-LD — values from SiteFooter and contact.ts only. */
export function getRestaurantJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: RESTAURANT_NAME,
    url: SITE_URL,
    logo: RESTAURANT_LOGO_URL,
    image: OG_IMAGE_URL,
    telephone: RESTAURANT_PHONE,
    address: {
      "@type": "PostalAddress",
      streetAddress: RESTAURANT_ADDRESS.streetAddress,
      addressLocality: RESTAURANT_ADDRESS.addressLocality,
      postalCode: RESTAURANT_ADDRESS.postalCode,
      addressCountry: RESTAURANT_ADDRESS.addressCountry,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [...ALL_DAYS],
        opens: RESTAURANT_HOURS.opens,
        closes: RESTAURANT_HOURS.closes,
      },
    ],
    servesCuisine: "Indian",
    hasMenu: MENU_URL,
    sameAs: [RESTAURANT_INSTAGRAM_URL],
  };
}
