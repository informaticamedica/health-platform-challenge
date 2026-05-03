import { ReactNode } from "react";
import { cn } from "../utils";

type BackgroundProps = Readonly<{
  children?: ReactNode;
  imageUrl?: string;
  className?: string;
  overlayClassName?: string;
}>;

export function Background({
  children,
  imageUrl = "/background.jpg",
  className,
  overlayClassName,
}: BackgroundProps) {
  return (
    <div className={cn("relative min-h-dvh overflow-hidden", className)}>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${imageUrl})` }}
        aria-hidden="true"
      />
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-primary via-info to-primary",
          overlayClassName,
        )}
        aria-hidden="true"
      />

      <div aria-hidden="true" className="pointer-events-none absolute -left-20 top-12 h-56 w-56 rounded-full border-[28px] border-info/60" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-14 -top-14 h-72 w-72 rounded-full border-[32px] border-info/45" />
      <div aria-hidden="true" className="pointer-events-none absolute right-20 top-32 text-5xl font-black text-warning">
        +
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute left-16 bottom-24 text-6xl font-black text-white/90">
        +
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute left-48 bottom-16 text-5xl font-black text-info/70">
        +
      </div>

      <div className="relative z-10 flex min-h-dvh items-center justify-center px-4 py-10 sm:px-6">
        {children}
      </div>
    </div>
  );
}
