import { cn } from "@/lib/cn";

type SpinnerSize = "sm" | "md";

type SpinnerProps = {
  size?: SpinnerSize;
  className?: string;
  "aria-hidden"?: boolean;
};

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "size-4 border-2",
  md: "size-6 border-2",
};

export const Spinner = ({
  size = "md",
  className,
  "aria-hidden": ariaHidden = true,
}: SpinnerProps) => {
  return (
    <span
      role="status"
      aria-hidden={ariaHidden}
      className={cn(
        "inline-block animate-spin rounded-full border-gold-light border-t-gold",
        sizeClasses[size],
        className,
      )}
    />
  );
};
