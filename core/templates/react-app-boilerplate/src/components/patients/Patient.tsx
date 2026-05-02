import { PatientTypeDto } from "@/types/dto.type";
import { CalendarDaysIcon, MapPinIcon, PencilIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { DeletePatientModal } from "./DeletePatientModal";
import { PatientFormModal } from "./PatientFormModal";

export const PatientCard = ({ patient }: { patient: PatientTypeDto }) => {
  const navigate = useNavigate();

  const isInteractiveTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false;
    return Boolean(target.closest("button, a, [data-no-card-nav='true']"));
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(event) => {
        if (isInteractiveTarget(event.target)) return;
        navigate(`/patients/${patient.id}`);
      }}
      onKeyDown={(event) => {
        if (isInteractiveTarget(event.target)) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(`/patients/${patient.id}`);
        }
      }}
      className="group cursor-pointer rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm shadow-slate-200/60 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-300/40"
    >
      <div>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
          <Link
            to={`/patients/${patient.id}`}
            onClick={(event) => event.stopPropagation()}
            className="text-lg font-semibold text-slate-900"
          >
            {patient.name}
          </Link>
            <p className="text-sm text-slate-500">Genero: {patient.gender}</p>
          </div>

          <div className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
            {patient.observations} observaciones
          </div>
        </div>

        <div className="space-y-2 text-sm text-slate-600">
          <p className="flex items-center gap-2">
            <CalendarDaysIcon className="size-4 text-slate-400" />
            {new Date(patient.birth_date).toLocaleDateString()}
          </p>
          <p className="flex items-center gap-2">
            <MapPinIcon className="size-4 text-slate-400" />
            {patient.address}
          </p>
        </div>
      </div>

      <div
        data-no-card-nav="true"
        onClick={(event) => event.stopPropagation()}
        className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-4"
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
        <DeletePatientModal patientId={patient.id} patientName={patient.name} />
      </div>
    </div>
  );
};
