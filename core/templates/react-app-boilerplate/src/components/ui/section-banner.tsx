import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type SectionBannerVariant = "primary" | "secondary";

type SectionBannerProps = {
  variant?: SectionBannerVariant;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

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
          ? "border-teal-100 bg-gradient-to-r from-teal-700 via-cyan-700 to-sky-700 text-white shadow-cyan-950/20"
          : "border-slate-200 bg-white/70 text-slate-900 shadow-slate-300/20 backdrop-blur",
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description ? (
            <p
              className={cn(
                "mt-1 text-sm",
                variant === "primary" ? "text-cyan-100" : "text-slate-500"
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
        {action}
      </div>
    </section>
  );
}
