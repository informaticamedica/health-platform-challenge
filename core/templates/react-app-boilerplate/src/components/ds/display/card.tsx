import { cn } from "@/components/ds/utils";
import { ReactNode, isValidElement } from "react";

type CardVariant = "primary" | "secondary";

type CardProps = Readonly<{
  variant?: CardVariant;
  title?: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
  clickable?: boolean;
  clickableLabel?: string;
  onClickablePress?: () => void;
}>;

const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mb-4 flex items-start justify-between gap-4", className)} {...props} />
);

type CardTitleProps = Omit<React.HTMLAttributes<HTMLHeadingElement>, "children"> & Readonly<{
  children: ReactNode;
}>;

const CardTitle = ({ className, children, ...props }: CardTitleProps) => (
  <h3 className={cn("text-lg font-bold text-[#0A4E94]", className)} {...props}>
    {children}
  </h3>
);

type CardSubtitleProps = Omit<React.HTMLAttributes<HTMLParagraphElement>, "children"> & Readonly<{
  children: ReactNode;
}>;

const CardSubtitle = ({ className, children, ...props }: CardSubtitleProps) => (
  <p className={cn("text-sm text-[#587191]", className)} {...props}>
    {children}
  </p>
);

const CardMeta = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={className} {...props} />
);

const CardBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={className} {...props} />
);

const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-5 border-t border-[#D8E7F8] pt-4", className)} {...props} />
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
  clickable = false,
  clickableLabel,
  onClickablePress,
}: CardProps) => {
  const isClickable = clickable && Boolean(onClickablePress);
  const renderTitle = () => {
    if (title === null || title === undefined) return null;
    return isValidElement(title) ? title : <CardTitle>{title}</CardTitle>;
  };

  const renderSubtitle = () => {
    if (subtitle === null || subtitle === undefined) return null;
    return isValidElement(subtitle) ? subtitle : <CardSubtitle>{subtitle}</CardSubtitle>;
  };

  return (
    <article
      className={cn(
        "relative rounded-2xl border p-5 shadow-sm transition",
        variant === "primary"
          ? "border-[#D5E6F7] bg-white shadow-[0_12px_26px_rgba(7,82,159,0.12)] backdrop-blur hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(7,82,159,0.18)]"
          : "border-[#DCE9F8] bg-[#F7FBFF] shadow-[0_8px_20px_rgba(7,82,159,0.09)] hover:shadow-[0_12px_24px_rgba(7,82,159,0.14)]",
        isClickable && "cursor-pointer",
        className
      )}
    >
      {isClickable ? (
        <button
          type="button"
          aria-label={clickableLabel ?? "Abrir detalle"}
          className="absolute inset-0 z-10 rounded-2xl"
          onClick={onClickablePress}
        />
      ) : null}

      {title || subtitle || meta ? (
        <CardHeader>
          <div>
            {renderTitle()}
            {renderSubtitle()}
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
