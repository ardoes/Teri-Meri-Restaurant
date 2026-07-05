import { cn } from "@/lib/utils";
import { SliceButtonLayers } from "@/components/ui/SliceButtonLayers";

type SliceButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "green" | "orange" | "on-green";
};

export function SliceButton({
  variant = "orange",
  className,
  children,
  ...props
}: SliceButtonProps) {
  return (
    <button
      type="button"
      className={cn("btn slice-btn", `btn--${variant}`, className)}
      {...props}
    >
      <SliceButtonLayers />
      <span className="slice-btn__content">{children}</span>
    </button>
  );
}
