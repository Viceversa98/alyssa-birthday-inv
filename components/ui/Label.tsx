import { cn } from "@/lib/cn";

type LabelProps = {
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
};

export const Label = ({ htmlFor, className, children }: LabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block text-sm font-medium text-ink",
        className,
      )}
    >
      {children}
    </label>
  );
};
