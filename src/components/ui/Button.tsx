import { cn } from "@/lib/utils";
import Link from "next/link";

interface ButtonProps {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  className?: string;
  external?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  loading?: boolean;
  "aria-label"?: string;
}

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  external,
  type = "button",
  onClick,
  disabled,
  loading,
  ...aria
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-1.5 font-medium transition-colors duration-200 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary: "bg-foreground text-surface hover:bg-foreground/90",
    secondary:
      "bg-surface-elevated text-foreground border border-border hover:bg-border-subtle",
    ghost: "text-muted hover:text-foreground hover:bg-border-subtle",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
  };

  const classes = cn(base, variants[variant], sizes[size], className);

  if (href && !disabled) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...aria}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...aria}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      {...aria}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
