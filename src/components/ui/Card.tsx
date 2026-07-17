import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface-elevated p-6",
        hover &&
          "transition-all duration-200 hover:border-muted-light/40 hover:shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
