import { ScrollArea } from "../ui/scroll-area";
import { DeleteObservationModal } from "./DeleteObservationModal";
import { EditObservationModal } from "./EditObservationModal";
import { ObservationType } from "@/types/dto.type";
import { ObservationCategoryType } from "@/types/fhir.type";
import { v4 } from "uuid";

export const CardObservation = ({
  observation,
  categories,
}: {
  observation: ObservationType;
  categories: ObservationCategoryType[];
}) => (
  <div key={v4()} className="p-4 border rounded-md shadow bg-white">
    <div className="flex justify-between">
      <div className="flex w-full">
        <div className="w-4/6">
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
          </p>{" "}
        </div>
        <div className="w-auto">
          <strong>Componentes</strong>
          <ScrollArea className="h-40" type="always">
            {observation.components?.map((c) => (
              <div key={v4()} className="mr-5">
                <div className="flex flex-col bg-slate-100 m-2 p-2 rounded w-full">
                  <div className="flex  pr-2">
                    <strong>Código:</strong>
                    <div className="px-2">{c.code}</div>
                  </div>
                  <div className="flex ">
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
      <div className="flex flex-col justify-between">
        <EditObservationModal observation={observation} />
        <DeleteObservationModal id={observation.id} />
      </div>
    </div>
  </div>
);
