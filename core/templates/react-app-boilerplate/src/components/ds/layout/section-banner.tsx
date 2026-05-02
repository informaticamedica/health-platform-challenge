import { cn } from "@/components/ds/utils";
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
          ? "border-[#1F7ACC] bg-gradient-to-r from-[#055CAA] via-[#086BBC] to-[#0E7BD2] text-white shadow-[#003C79]/30"
          : "border-[#D5E6F7] bg-white text-[#0B4C90] shadow-[#2A73B4]/10 backdrop-blur",
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">{title}</h1>
          {description ? (
            <p className={cn("mt-1 text-sm", variant === "primary" ? "text-[#DDEEFF]" : "text-[#5F7E9D]")}>
              {description}
            </p>
          ) : null}
        </div>
        {action}
      </div>
    </section>
  );
}
