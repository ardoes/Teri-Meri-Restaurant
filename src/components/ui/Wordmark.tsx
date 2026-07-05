import { cn } from "@/lib/utils";

type WordmarkProps = {
  className?: string;
  /** Tailwind text-color class for "Teri" (default: brand orange) */
  teriClassName?: string;
  /** Tailwind text-color class for "Meri" (default: brand green) */
  meriClassName?: string;
  /** Playful hover split on Teri / Meri (header link) */
  interactive?: boolean;
};

/**
 * The Teri Meri wordmark — "Teri" and "Meri" carry the brand colors.
 * Reused across the header, preloader and footer with color overrides.
 */
export function Wordmark({
  className,
  teriClassName = "text-orange",
  meriClassName = "text-green",
  interactive = false,
}: WordmarkProps) {
  return (
    <span
      className={cn(
        "font-display leading-none tracking-tight",
        interactive && "wordmark-interactive",
        className
      )}
    >
      <span className={cn(teriClassName, interactive && "wordmark-teri")}>
        Teri
      </span>
      <span className="px-[0.12em]" />
      <span className={cn(meriClassName, interactive && "wordmark-meri")}>
        Meri
      </span>
    </span>
  );
}
