import { Card, Chip, ScrollArea } from "@platform/design-system";
import { DeleteObservationModal } from "./DeleteObservationModal";
import { EditObservationModal } from "./EditObservationModal";
import { ObservationType } from "@/types/dto.type";
import { ObservationCategoryType } from "@/types/fhir.type";
import { ActivityIcon, CalendarDaysIcon, UserIcon } from "lucide-react";

const shortId = (id?: string) => (id ? id.slice(0, 8) : "-");

export const CardObservation = ({
  observation,
  categories,
}: Readonly<{
  observation: ObservationType;
  categories: ObservationCategoryType[];
}>) => {
  const categoryDisplay = observation.category
    ? categories?.find((c) => c.code === observation.category)?.display ??
      observation.category
    : "Sin categoria";

  return (
    <Card
      variant="secondary"
      title={`Observacion ${shortId(observation.id)}`}
      className="border-primary/25 bg-card shadow-md shadow-primary/10"
      subtitle={
        <div className="mt-1 flex items-center gap-2">
          <Chip variant="outline" showClose={false}>{categoryDisplay}</Chip>
          <Chip variant="muted" showClose={false}>ID #{shortId(observation.id)}</Chip>
        </div>
      }
      meta={
        <div className="flex items-center gap-2">
          <EditObservationModal observation={observation} />
          <DeleteObservationModal id={observation.id} />
        </div>
      }
    >
      <Card.Body className="flex w-full flex-col gap-3 md:flex-row">
        <div className="md:w-1/2">
          <div className="mb-2 flex flex-wrap gap-2">
            <Chip variant="default" showClose={false}>Codigo: {observation.code}</Chip>
            <Chip variant="default" showClose={false}>Valor: {observation.value}</Chip>
          </div>

          <div className="space-y-1.5 text-sm text-foreground">
            <p className="flex items-center gap-2">
              <CalendarDaysIcon className="size-4 text-info" />
              <strong className="text-primary">Fecha:</strong> {new Date(observation.date).toLocaleDateString()}
            </p>
            <p className="flex items-center gap-2">
              <ActivityIcon className="size-4 text-info" />
              <strong className="text-primary">ID Paciente:</strong>{" "}
              <span title={observation.patient_id}>{shortId(observation.patient_id)}</span>
            </p>
            <p className="flex items-center gap-2">
              <UserIcon className="size-4 text-info" />
              <strong className="text-primary">ID Usuario:</strong>{" "}
              <span title={observation.user_id}>{shortId(observation.user_id)}</span>
            </p>
          </div>
        </div>
        <div className="md:w-1/2">
          <strong className="text-primary">Componentes</strong>
          <ScrollArea className="mt-2 h-32 rounded-lg border border-primary/25 bg-card p-2" type="always">
            {observation.components?.map((c) => (
              <div key={`${observation.id}-${c.code}-${c.unit}`} className="mb-1.5">
                <div className="flex flex-col rounded-md border border-primary/20 bg-background p-2">
                  <div className="flex pr-2">
                    <strong className="text-primary">Codigo:</strong>
                    <div className="px-2 text-foreground">{c.code}</div>
                  </div>
                  <div className="flex">
                    <strong className="text-primary">Valor:</strong>
                    <div className="flex px-2 text-foreground">
                      {c.value} {c.unit}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </Card.Body>
    </Card>
  );
};
