import { cn } from "../utils";
import { ReactNode } from "react";

type SectionBannerVariant = "primary" | "secondary";

type SectionBannerProps = Readonly<{
  variant?: SectionBannerVariant;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}>;

export function SectionBanner({
  variant = "primary",
  title,
  description,
  action,
  className,
}: SectionBannerProps) {
  return (
    <section
      className={cn(
        "mb-8 rounded-3xl border p-6 shadow-xl",
        variant === "primary"
          ? "border-primary/70 bg-gradient-to-r from-primary via-info to-primary text-primary-foreground shadow-primary/30"
          : "border-border bg-card text-primary shadow-primary/10 backdrop-blur",
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">{title}</h1>
          {description ? (
            <p className={cn("mt-1 text-sm", variant === "primary" ? "text-primary-foreground/90" : "text-muted-foreground")}>
              {description}
            </p>
          ) : null}
        </div>
        {action}
      </div>
    </section>
  );
}
