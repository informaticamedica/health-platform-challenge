import { ConditionType } from "@/types/dto.type";
import { Card, Chip } from "@platform/design-system";

export function ConditionCard({ condition }: { condition: ConditionType }) {
  return (
    <Card
      variant="secondary"
      title={`Condition ${condition.id}`}
      subtitle={
        <div className="mt-1 flex items-center gap-2">
          <Chip variant="outline" showClose={false}>
            {condition.clinical_status}
          </Chip>
          <Chip variant="muted" showClose={false}>
            {condition.verification_status}
          </Chip>
        </div>
      }
    >
      <Card.Body className="space-y-2 text-sm">
        <p>
          <strong>Codigo:</strong> {condition.code}
        </p>
        <p>
          <strong>Fecha:</strong>{" "}
          {new Date(condition.recorded_date).toLocaleDateString()}
        </p>
        <p>
          <strong>Notas:</strong> {condition.notes || "-"}
        </p>
      </Card.Body>
    </Card>
  );
}
