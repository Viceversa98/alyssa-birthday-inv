import { cn } from "@/lib/cn";

type SkeletonProps = {
  className?: string;
};

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-xl bg-gold-light/30",
        className,
      )}
    />
  );
};
