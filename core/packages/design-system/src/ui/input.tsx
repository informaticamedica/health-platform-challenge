import * as React from "react";
import { cn } from "../utils";

const InputContainer = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("space-y-1", className)} {...props} />;
};

const InputLabel = React.forwardRef<HTMLLabelElement, React.ComponentPropsWithoutRef<"label">>(
  ({ className, htmlFor, ...props }, ref) => {
    return <label ref={ref} htmlFor={htmlFor} className={cn("block text-sm font-semibold text-primary", className)} {...props} />;
  }
);
InputLabel.displayName = "InputLabel";

type InputProps = React.ComponentProps<"input"> & Readonly<{
  label?: React.ReactNode;
}>;

const InputBase = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "border-input bg-card text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/35",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
InputBase.displayName = "Input";

type InputComponent = React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>> & {
  Container: typeof InputContainer;
  Label: typeof InputLabel;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, id, ...props }, ref) => {
  const inputId = React.useId();
  const resolvedId = id ?? inputId;

  if (label === undefined) {
    return <InputBase ref={ref} id={resolvedId} {...props} />;
  }

  return (
    <InputContainer>
      <InputLabel htmlFor={resolvedId}>{label}</InputLabel>
      <InputBase ref={ref} id={resolvedId} {...props} />
    </InputContainer>
  );
}) as InputComponent;
Input.displayName = "Input";

Input.Container = InputContainer;
Input.Label = InputLabel;

export { Input };
