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
  OG_IMAGE_PATH,
  SITE_NAME,
  SITE_URL,
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

const homeDescription =
  "Teri Meri is a luxury Indian dining experience — heritage recipes reimagined with cinematic craft, warmth and soul.";

const homeOgDescription =
  "A luxury Indian dining experience — heritage recipes reimagined with cinematic craft.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Teri Meri — Modern Indian Fine Dining",
    template: "%s · Teri Meri",
  },
  description: homeDescription,
  keywords: [
    "Teri Meri",
    "luxury Indian restaurant",
    "modern Indian fine dining",
    "Indian tasting menu",
  ],
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    title: "Teri Meri — Modern Indian Fine Dining",
    description: homeOgDescription,
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    images: [
      {
        url: OG_IMAGE_PATH,
        alt: "Teri Meri dining room with tables ready for guests",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teri Meri — Modern Indian Fine Dining",
    description: homeOgDescription,
    images: [OG_IMAGE_PATH],
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const restaurantJsonLd = getRestaurantJsonLd();

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(restaurantJsonLd).replace(/</g, "\\u003c"),
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
