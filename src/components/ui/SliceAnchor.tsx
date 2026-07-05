import { cn } from "@/lib/utils";
import { SliceButtonLayers } from "@/components/ui/SliceButtonLayers";

type SliceAnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "green" | "orange" | "on-green";
};

export function SliceAnchor({
  variant = "green",
  className,
  children,
  ...props
}: SliceAnchorProps) {
  return (
    <a
      className={cn("btn slice-btn", `btn--${variant}`, className)}
      {...props}
    >
      <SliceButtonLayers />
      <span className="slice-btn__content">{children}</span>
    </a>
  );
}
