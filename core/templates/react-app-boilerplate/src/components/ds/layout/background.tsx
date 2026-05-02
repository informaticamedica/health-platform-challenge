import { ReactNode } from "react";
import { cn } from "@/components/ds/utils";

type BackgroundProps = Readonly<{
  children?: ReactNode;
  imageUrl?: string;
  className?: string;
  overlayClassName?: string;
}>;

export function Background({ children, imageUrl = "/zentricx-background.jpg", className, overlayClassName }: BackgroundProps) {
  return (
    <div className={cn("relative h-screen bg-cover bg-center", className)} style={{ backgroundImage: `url(${imageUrl})` }}>
      <div className={cn("absolute inset-0 bg-black/50 blur-md", overlayClassName)} />
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}
