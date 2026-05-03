import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { XIcon } from "lucide-react";
import { cn } from "../utils";

export const chipVariantsConfig = {
  variants: {
    variant: {
      default: "border-secondary bg-secondary text-secondary-foreground",
      outline: "border-secondary bg-transparent text-secondary",
      muted: "border-border bg-tertiary text-tertiary-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
} as const;

export const chipVariantOptions = Object.keys(chipVariantsConfig.variants.variant) as Array<
  keyof typeof chipVariantsConfig.variants.variant
>;

const chipVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-1 text-xs font-semibold transition-colors",
  chipVariantsConfig,
);

type ChipProps = Readonly<
  React.HTMLAttributes<HTMLSpanElement> &
    VariantProps<typeof chipVariants> & {
      showClose?: boolean;
      onClose?: () => void;
    }
>;

export function Chip({
  className,
  variant,
  children,
  showClose = true,
  onClose,
  ...props
}: ChipProps) {
  return (
    <span className={cn(chipVariants({ variant }), className)} {...props}>
      <span>{children}</span>
      {showClose ? (
        <button
          type="button"
          aria-label="Quitar"
          onClick={onClose}
          className="inline-flex size-3.5 items-center justify-center rounded-full"
        >
          <XIcon className="size-3" />
        </button>
      ) : null}
    </span>
  );
}
