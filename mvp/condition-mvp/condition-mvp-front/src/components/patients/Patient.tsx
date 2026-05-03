import { PatientTypeDto } from "@/types/dto.type";
import { Card, Chip } from "@platform/design-system";
import { CalendarDaysIcon, MapPinIcon, PencilIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { DeletePatientModal } from "./DeletePatientModal";
import { PatientFormModal } from "./PatientFormModal";

export const PatientCard = ({ patient }: Readonly<{ patient: PatientTypeDto }>) => {
  const navigate = useNavigate();

  let observationsLabel = `${patient.observations} observaciones`;
  if (patient.observations === "0") observationsLabel = "Sin observaciones";
  else if (patient.observations === "1") observationsLabel = "1 observacion";

  return (
    <Card
      variant="primary"
      clickable
      clickableLabel={`Ver detalle de ${patient.name}`}
      onClickablePress={() => navigate(`/patients/${patient.id}`)}
      className="group relative"
      title={
        <Link
          to={`/patients/${patient.id}`}
          className="relative z-20 text-lg font-bold text-primary"
        >
          {patient.name}
        </Link>
      }
      subtitle={`Genero: ${patient.gender}`}
      meta={
        <Chip variant="outline" showClose={false}>
          {observationsLabel}
        </Chip>
      }
      footer={
        <div
          data-no-card-nav="true"
          className="relative z-20 flex items-center justify-end gap-2"
        >
          <PatientFormModal
            mode="edit"
            patient={patient}
            trigger={
                <button
                  type="button"
                  onClick={(event) => event.stopPropagation()}
                  className="inline-flex items-center justify-center rounded-lg border border-border bg-card p-2 text-primary transition hover:bg-tertiary"
                >
                  <PencilIcon className="size-4" />
                </button>
            }
          />
          <DeletePatientModal
            patientId={patient.id}
            patientName={patient.name}
          />
        </div>
      }
    >
      <div className="space-y-2 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <CalendarDaysIcon className="size-4 text-info" />
          {new Date(patient.birth_date).toLocaleDateString()}
        </p>
        <p className="flex items-center gap-2">
          <MapPinIcon className="size-4 text-info" />
          {patient.address}
        </p>
      </div>
    </Card>
  );
};
