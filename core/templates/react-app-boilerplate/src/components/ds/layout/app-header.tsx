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
        "fixed left-0 right-0 top-0 z-20 border-b border-[#CCE2F8] bg-white/92 px-4 py-3 text-[#0A4C91] shadow-[0_8px_20px_rgba(7,78,150,0.12)] backdrop-blur-md",
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
