import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
  href?: string;
} & (
  | React.ButtonHTMLAttributes<HTMLButtonElement>
  | React.AnchorHTMLAttributes<HTMLAnchorElement>
);

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-rose text-ink hover:bg-rose/90 shadow-sm",
  secondary:
    "border-2 border-gold-light bg-transparent text-ink hover:bg-gold-light/30",
  ghost: "bg-transparent text-gold hover:bg-gold-light/20",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm min-h-10",
  md: "px-6 py-2.5 text-base min-h-11",
  lg: "px-8 py-3 text-lg min-h-12",
};

const baseClasses =
  "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-blush disabled:pointer-events-none disabled:opacity-50";

export const Button = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  children,
  href,
  ...props
}: ButtonProps) => {
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full sm:w-auto",
    className,
  );

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  const buttonProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button
      className={classes}
      type={buttonProps.type ?? "button"}
      {...buttonProps}
    >
      {children}
    </button>
  );
};
