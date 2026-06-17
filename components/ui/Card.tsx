import { cn } from "@/lib/cn";

type CardProps = {
  className?: string;
  children: React.ReactNode;
};

const CardRoot = ({ className, children }: CardProps) => {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gold-light/50 bg-pink-light shadow-md shadow-rose/10",
        className,
      )}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ className, children }: CardProps) => {
  return (
    <div className={cn("border-b border-gold-light/40 px-6 py-4", className)}>
      {children}
    </div>
  );
};

const CardContent = ({ className, children }: CardProps) => {
  return <div className={cn("px-6 py-5", className)}>{children}</div>;
};

const CardFooter = ({ className, children }: CardProps) => {
  return (
    <div
      className={cn(
        "border-t border-gold-light/40 px-6 py-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Content: CardContent,
  Footer: CardFooter,
});
