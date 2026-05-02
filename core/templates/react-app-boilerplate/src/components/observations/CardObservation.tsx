import { Card } from "@/components/ui";
import { ScrollArea } from "../ui/scroll-area";
import { DeleteObservationModal } from "./DeleteObservationModal";
import { EditObservationModal } from "./EditObservationModal";
import { ObservationType } from "@/types/dto.type";
import { ObservationCategoryType } from "@/types/fhir.type";

export const CardObservation = ({
  observation,
  categories,
}: {
  observation: ObservationType;
  categories: ObservationCategoryType[];
}) => (
  <Card variant="secondary">
    <div className="flex justify-between gap-4">
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <div className="md:w-1/2">
          <p>
            <strong>ID:</strong> {observation.id}
          </p>
          <p>
            <strong>Categoría:</strong>{" "}
            {categories?.find((c) => c.code === observation.category)?.display}
          </p>
          <p>
            <strong>Código:</strong> {observation.code}
          </p>
          <p>
            <strong>Valor:</strong> {observation.value}
          </p>
          <p>
            <strong>Fecha:</strong>{" "}
            {new Date(observation.date).toLocaleDateString()}
          </p>
          <p>
            <strong>ID Paciente:</strong> {observation.patient_id}
          </p>
          <p>
            <strong>ID Usuario:</strong> {observation.user_id}
          </p>
        </div>
        <div className="md:w-1/2">
          <strong className="text-slate-800">Componentes</strong>
          <ScrollArea className="mt-2 h-40 rounded-lg border border-slate-100 bg-slate-50 p-2" type="always">
            {observation.components?.map((c) => (
              <div key={`${observation.id}-${c.code}-${c.unit}`} className="mb-2">
                <div className="flex flex-col rounded-md border border-slate-200 bg-white p-2">
                  <div className="flex pr-2">
                    <strong>Código:</strong>
                    <div className="px-2">{c.code}</div>
                  </div>
                  <div className="flex">
                    <strong>Valor:</strong>
                    <div className="flex px-2">
                      {c.value} {c.unit}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-3">
        <EditObservationModal observation={observation} />
        <DeleteObservationModal id={observation.id} />
      </div>
    </div>
  </Card>
);
