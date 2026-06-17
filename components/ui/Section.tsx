import { cn } from "@/lib/cn";
import { Container } from "./Container";

type SectionProps = {
  title?: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
  id?: string;
};

export const Section = ({
  title,
  subtitle,
  className,
  children,
  id,
}: SectionProps) => {
  return (
    <section id={id} className={cn("py-10 sm:py-16", className)}>
      <Container>
        {(title || subtitle) && (
          <header className="mb-8 text-center">
            {title && (
              <h2 className="font-display text-2xl font-semibold tracking-tight text-gold sm:text-3xl md:text-4xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-2 text-base text-ink/80 sm:text-lg">{subtitle}</p>
            )}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
};
