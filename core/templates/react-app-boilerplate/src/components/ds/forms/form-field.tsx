import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type FormFieldProps = {
  label: ReactNode;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
};

export function FormField({ label, htmlFor, children, className, labelClassName }: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className={cn("mb-1 block text-sm font-medium", labelClassName)}>
        {label}
      </label>
      {children}
    </div>
  );
}
