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
  metadataBase: new URL("https://terimeri.restaurant"),
  title: {
    default: "Teri Meri — Modern Indian Fine Dining",
    template: "%s · Teri Meri",
  },
  description:
    "Teri Meri is a luxury Indian dining experience — heritage recipes reimagined with cinematic craft, warmth and soul.",
  keywords: [
    "Teri Meri",
    "luxury Indian restaurant",
    "modern Indian fine dining",
    "Indian tasting menu",
  ],
  openGraph: {
    title: "Teri Meri — Modern Indian Fine Dining",
    description:
      "A luxury Indian dining experience — heritage recipes reimagined with cinematic craft.",
    type: "website",
    locale: "en_US",
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
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
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
