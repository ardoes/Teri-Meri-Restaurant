import Link from "next/link";
import { cn } from "@/lib/utils";
import { SliceButtonLayers } from "@/components/ui/SliceButtonLayers";

type Variant = "green" | "orange" | "on-green";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  withArrow?: boolean;
  className?: string;
  target?: string;
  rel?: string;
  scroll?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  "aria-label"?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "green",
  withArrow = true,
  className,
  target,
  rel,
  scroll,
  onClick,
  "aria-label": ariaLabel,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      scroll={scroll}
      onClick={onClick}
      aria-label={ariaLabel}
      data-cursor="hover"
      className={cn("btn slice-btn", `btn--${variant}`, className)}
    >
      <SliceButtonLayers />
      <span className="slice-btn__content">
        {children}
        {withArrow && (
          <span aria-hidden className="btn__arrow">
            →
          </span>
        )}
      </span>
    </Link>
  );
}
