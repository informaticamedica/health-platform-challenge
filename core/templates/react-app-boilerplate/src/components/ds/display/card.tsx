import { cn } from "@/lib/utils";
import { KeyboardEvent, MouseEvent, ReactNode } from "react";

type CardVariant = "primary" | "secondary";

type CardProps = {
  variant?: CardVariant;
  title?: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  tabIndex?: number;
  role?: string;
};

export function Card({
  variant = "primary",
  title,
  subtitle,
  meta,
  footer,
  children,
  className,
  bodyClassName,
  onClick,
  onKeyDown,
  tabIndex,
  role,
}: CardProps) {
  return (
    <article
      role={role}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={cn(
        "rounded-2xl border p-5 shadow-sm transition",
        variant === "primary"
          ? "border-slate-200 bg-white/80 shadow-slate-200/60 backdrop-blur hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-300/40"
          : "border-slate-200 bg-white hover:shadow-md",
        className
      )}
    >
      {title || subtitle || meta ? (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title ? <h3 className="text-lg font-semibold text-slate-900">{title}</h3> : null}
            {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
          </div>
          {meta}
        </div>
      ) : null}

      <div className={bodyClassName}>{children}</div>

      {footer ? <div className="mt-5 border-t border-slate-100 pt-4">{footer}</div> : null}
    </article>
  );
}
