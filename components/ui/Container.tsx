import { cn } from "@/lib/cn";

type ContainerProps = {
  className?: string;
  children: React.ReactNode;
};

export const Container = ({ className, children }: ContainerProps) => {
  return (
    <div className={cn("mx-auto w-full max-w-3xl px-4 sm:px-6", className)}>
      {children}
    </div>
  );
};
