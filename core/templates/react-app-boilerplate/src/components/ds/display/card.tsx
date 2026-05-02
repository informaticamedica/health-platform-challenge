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

const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mb-4 flex items-start justify-between gap-4", className)} {...props} />
);

const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-lg font-semibold text-slate-900", className)} {...props} />
);

const CardSubtitle = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-slate-500", className)} {...props} />
);

const CardMeta = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={className} {...props} />
);

const CardBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={className} {...props} />
);

const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-5 border-t border-slate-100 pt-4", className)} {...props} />
);

type CardComponent = ((props: CardProps) => JSX.Element) & {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Subtitle: typeof CardSubtitle;
  Meta: typeof CardMeta;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
};

export const Card = (({
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
}: CardProps) => {
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
        <CardHeader>
          <div>
            {title ? <CardTitle>{title}</CardTitle> : null}
            {subtitle ? <CardSubtitle>{subtitle}</CardSubtitle> : null}
          </div>
          {meta ? <CardMeta>{meta}</CardMeta> : null}
        </CardHeader>
      ) : null}

      <CardBody className={bodyClassName}>{children}</CardBody>

      {footer ? <CardFooter>{footer}</CardFooter> : null}
    </article>
  );
}) as CardComponent;

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Meta = CardMeta;
Card.Body = CardBody;
Card.Footer = CardFooter;
