import { PatientTypeDto } from "@/types/dto.type";
import { Card } from "@ds";
import { CalendarDaysIcon, MapPinIcon, PencilIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { DeletePatientModal } from "./DeletePatientModal";
import { PatientFormModal } from "./PatientFormModal";

export const PatientCard = ({ patient }: { patient: PatientTypeDto }) => {
  const navigate = useNavigate();

  let observationsLabel = `${patient.observations} observaciones`;
  if (patient.observations === "0") observationsLabel = "Sin observaciones";
  else if (patient.observations === "1") observationsLabel = "1 observacion";
  console.log({ patient });
  return (
    <Card
      variant="primary"
      clickable
      className="group relative"
      title={
        <Link
          to={`/patients/${patient.id}`}
          className="relative z-20 text-lg font-semibold text-slate-900"
        >
          {patient.name}
        </Link>
      }
      subtitle={`Genero: ${patient.gender}`}
      meta={
        <div className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
          {observationsLabel}
        </div>
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
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-700 transition hover:bg-slate-100"
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
      <button
        type="button"
        aria-label={`Ver detalle de ${patient.name}`}
        className="absolute inset-0 z-0 rounded-2xl"
        onClick={() => navigate(`/patients/${patient.id}`)}
      />
      <div className="relative z-10 space-y-2 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <CalendarDaysIcon className="size-4 text-slate-400" />
          {new Date(patient.birth_date).toLocaleDateString()}
        </p>
        <p className="flex items-center gap-2">
          <MapPinIcon className="size-4 text-slate-400" />
          {patient.address}
        </p>
      </div>
    </Card>
  );
};
