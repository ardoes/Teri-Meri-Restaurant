import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="eyebrow text-green">404</p>
      <h1 className="mt-6 font-display text-[clamp(2.5rem,8vw,5rem)] leading-[0.95] text-espresso">
        Page not found
      </h1>
      <p className="mt-6 max-w-md text-lg text-muted">
        This table isn&apos;t set yet. Head back to Teri Meri and explore our
        menu or story.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <ButtonLink href="/" variant="green" className="px-8 py-4">
          Back to home
        </ButtonLink>
        <Link
          href="/menu"
          className="text-sm uppercase tracking-[0.22em] text-green underline decoration-gold/50 underline-offset-4 transition-colors hover:text-espresso"
        >
          View menu
        </Link>
      </div>
    </section>
  );
}
