import { Button } from "@platform/design-system";

type ResourceView = "observations" | "conditions";

export function ResourceSegmentedControl({
  value,
  onChange,
}: {
  value: ResourceView;
  onChange: (next: ResourceView) => void;
}) {
  return (
    <div className="inline-flex rounded-xl border border-border bg-card p-1">
      <Button
        variant={value === "observations" ? "default" : "ghost"}
        className="h-9 rounded-lg px-4"
        onClick={() => onChange("observations")}
      >
        Observaciones
      </Button>
      <Button
        variant={value === "conditions" ? "default" : "ghost"}
        className="h-9 rounded-lg px-4"
        onClick={() => onChange("conditions")}
      >
        Conditions
      </Button>
    </div>
  );
}

export type { ResourceView };
