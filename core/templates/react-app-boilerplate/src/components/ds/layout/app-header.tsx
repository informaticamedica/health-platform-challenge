import { cn } from "@/components/ds/utils";
import { ReactNode } from "react";

type AppHeaderProps = Readonly<{
  brand: ReactNode;
  actions?: ReactNode;
  className?: string;
  contentClassName?: string;
}>;

export function AppHeader({ brand, actions, className, contentClassName }: AppHeaderProps) {
  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-20 border-b border-white/40 bg-white/70 px-4 py-3 text-slate-800 shadow-sm backdrop-blur-md",
        className
      )}
    >
      <div className={cn("mx-auto flex w-full max-w-7xl items-center justify-between", contentClassName)}>
        <div>{brand}</div>
        <div>{actions}</div>
      </div>
    </header>
  );
}
