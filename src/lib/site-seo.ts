import { MENU_CATEGORIES } from "@/data/menu-data";

/** Canonical site URL — override with NEXT_PUBLIC_SITE_URL in production. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://terimeri.restaurant";

export const SITE_NAME = "Teri Meri";

/** Official business name (SiteFooter address block). */
export const RESTAURANT_NAME = "Teri Meri Biryani & Restaurant";

export const RESTAURANT_PHONE = "+966535004311";

export const RESTAURANT_MAPS_URL =
  "https://maps.app.goo.gl/82Ea7QzncuRPmeq8A";

export const RESTAURANT_ADDRESS = {
  streetAddress: "Al Muallifin Street, Al Aziziyah District",
  addressLocality: "Jeddah",
  postalCode: "23342",
  addressCountry: "SA",
} as const;

/** Approximate coordinates for Al Aziziyah, Jeddah — refine in Search Console if needed. */
export const RESTAURANT_GEO = {
  latitude: 21.5753,
  longitude: 39.1728,
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
export const OG_IMAGE_WIDTH = 767;
export const OG_IMAGE_HEIGHT = 921;
export const OG_IMAGE_ALT =
  "Teri Meri dining room with tables ready for guests";

export const HOME_TITLE = "Teri Meri — Indian Restaurant in Jeddah";
export const HOME_DESCRIPTION =
  "Teri Meri is an Indian restaurant in Jeddah, Saudi Arabia — biryani, tandoor kebabs, curries, and Desi comfort food. Open daily 12:30 PM – 12:30 AM.";
export const HOME_OG_DESCRIPTION =
  "Indian restaurant in Jeddah — biryani, tandoor, and bold Desi flavours. Open daily.";

export const HOME_KEYWORDS = [
  "Teri Meri",
  "Teri Meri Jeddah",
  "Indian restaurant Jeddah",
  "biryani restaurant Jeddah",
  "Hyderabadi biryani Jeddah",
  "Indian food Jeddah",
  "tandoor restaurant Jeddah",
  "restaurant Al Aziziyah Jeddah",
  "best biryani Jeddah",
  "Desi food Jeddah",
  "Saudi Arabia Indian restaurant",
];

export const MENU_TITLE = "The Menu · Teri Meri";
export const MENU_DESCRIPTION =
  "Browse the full Teri Meri menu in Jeddah — Hyderabadi biryani, Karachi biryani, tandoor kebabs, curries, Chinese, and family packs. Order by phone or WhatsApp.";
export const MENU_KEYWORDS = [
  "Teri Meri menu",
  "biryani menu Jeddah",
  "Hyderabadi biryani Jeddah",
  "Karachi biryani Jeddah",
  "tandoor menu Jeddah",
  "Indian restaurant menu Jeddah",
  "butter chicken Jeddah",
  "mutton biryani Jeddah",
  "family biryani pack Jeddah",
  "Teri Meri prices",
];

export const THEME_COLOR = "#1f5b3a";
export const BACKGROUND_COLOR = "#f6cc9c";

const ALL_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const OG_IMAGE_METADATA = {
  url: OG_IMAGE_PATH,
  width: OG_IMAGE_WIDTH,
  height: OG_IMAGE_HEIGHT,
  alt: OG_IMAGE_ALT,
} as const;

function parsePriceSr(price: string): string | undefined {
  const match = price.match(/(\d+(?:\.\d+)?)/);
  return match?.[1];
}

/** schema.org Restaurant JSON-LD — values from SiteFooter and contact.ts only. */
export function getRestaurantJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: RESTAURANT_NAME,
    description: HOME_DESCRIPTION,
    url: SITE_URL,
    logo: RESTAURANT_LOGO_URL,
    image: OG_IMAGE_URL,
    telephone: RESTAURANT_PHONE,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: RESTAURANT_ADDRESS.streetAddress,
      addressLocality: RESTAURANT_ADDRESS.addressLocality,
      postalCode: RESTAURANT_ADDRESS.postalCode,
      addressCountry: RESTAURANT_ADDRESS.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: RESTAURANT_GEO.latitude,
      longitude: RESTAURANT_GEO.longitude,
    },
    hasMap: RESTAURANT_MAPS_URL,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [...ALL_DAYS],
        opens: RESTAURANT_HOURS.opens,
        closes: RESTAURANT_HOURS.closes,
      },
    ],
    servesCuisine: ["Indian", "Hyderabadi", "Pakistani"],
    hasMenu: MENU_URL,
    sameAs: [RESTAURANT_INSTAGRAM_URL],
  };
}

/** Site-wide search — menu dish finder. */
export function getWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${MENU_URL}#search`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Full menu structured data for the /menu page. */
export function getMenuJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `${RESTAURANT_NAME} Menu`,
    description: MENU_DESCRIPTION,
    url: MENU_URL,
    hasMenuSection: MENU_CATEGORIES.map((category) => ({
      "@type": "MenuSection",
      name: category.category,
      hasMenuItem: category.subsections.flatMap((subsection) =>
        subsection.items.map((item) => {
          const price = parsePriceSr(item.price);
          return {
            "@type": "MenuItem",
            name: item.name,
            ...(price
              ? {
                  offers: {
                    "@type": "Offer",
                    price,
                    priceCurrency: "SAR",
                  },
                }
              : {}),
          };
        })
      ),
    })),
  };
}

export function jsonLdScript(json: object) {
  return JSON.stringify(json).replace(/</g, "\\u003c");
}
