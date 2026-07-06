import type { Metadata } from "next";
import { Fraunces, Manrope, Fredoka } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Preloader } from "@/components/providers/Preloader";
import { CustomCursor } from "@/components/providers/CustomCursor";
import { ScrollProgress } from "@/components/providers/ScrollProgress";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { GoToTopButton } from "@/components/ui/GoToTopButton";
import { MainContent, PageTransition } from "@/components/layout/MainContent";
import {
  getRestaurantJsonLd,
  getWebSiteJsonLd,
  HOME_DESCRIPTION,
  HOME_KEYWORDS,
  HOME_OG_DESCRIPTION,
  HOME_TITLE,
  jsonLdScript,
  OG_IMAGE_METADATA,
  SITE_NAME,
  SITE_URL,
  THEME_COLOR,
} from "@/lib/site-seo";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const fredoka = Fredoka({
  variable: "--font-round",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: "%s · Teri Meri",
  },
  description: HOME_DESCRIPTION,
  keywords: HOME_KEYWORDS,
  applicationName: SITE_NAME,
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_OG_DESCRIPTION,
    type: "website",
    locale: "en_SA",
    url: "/",
    siteName: SITE_NAME,
    images: [OG_IMAGE_METADATA],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_OG_DESCRIPTION,
    images: [OG_IMAGE_METADATA.url],
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  other: {
    "theme-color": THEME_COLOR,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
  themeColor: THEME_COLOR,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const restaurantJsonLd = getRestaurantJsonLd();
  const webSiteJsonLd = getWebSiteJsonLd();

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(restaurantJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(webSiteJsonLd),
          }}
        />
        <Preloader />
        <CustomCursor />
        <ScrollProgress />
        <SmoothScroll>
          <PageTransition>
            <SiteHeader />
            <main>
              <MainContent>{children}</MainContent>
            </main>
            <SiteFooter />
            <GoToTopButton />
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  );
}
