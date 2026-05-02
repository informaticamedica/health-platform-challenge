import { CardObservation } from "@/components/observations/CardObservation";
import { NewObservationModal } from "@/components/observations/NewObservationModal";
import { Button } from "@/components/ui";
import { useAuth } from "@/context/auth";
// import { PatientCard } from "@/components/patients/Patient";
import { ScrollArea } from "@/components/ui/scroll-area";
import usePatientStore from "@/hooks/useStore";
import { getObservations } from "@/services/backend";
import { ObservationCategoryType } from "@/types/fhir.type";
import axios from "axios";
import { ArrowLeftIcon } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const FALLBACK_CATEGORIES: ObservationCategoryType[] = [
  { code: "vital-signs", display: "Vital Signs", definition: "Vital signs" },
  { code: "exam", display: "Exam", definition: "Exam findings" },
  { code: "laboratory", display: "Laboratory", definition: "Lab results" },
];

export default function ObservationsPage() {
  const { session, signOut } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    patientObservations,
    setPatientObservations,
    observationsCategories,
    setObservationsCategories,
  } = usePatientStore();

  useEffect(() => {
    const loadPatient = async () => {
      if (!session?.accessToken || !id) {
        navigate("/");
        return;
      }
      const response = await getObservations(session.accessToken, { id });
      if (response.error) {
        if (response.status === 401) {
          await signOut();
          navigate("/");
        }
        return;
      }
      setPatientObservations(response.data);
    };

    void loadPatient();
  }, [id, navigate, session?.accessToken, setPatientObservations, signOut]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const apiObservationsCategories = await axios.get(
          "https://terminology.hl7.org/6.1.0/CodeSystem-observation-category.json"
        );
        const categories: ObservationCategoryType[] =
          apiObservationsCategories.data.concept;
        setObservationsCategories(categories);
      } catch {
        setObservationsCategories(FALLBACK_CATEGORIES);
      }
    };

    if (observationsCategories.length === 0) {
      void loadCategories();
    }
  }, [observationsCategories.length, setObservationsCategories]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-28 sm:px-6 lg:px-8">
      <Button
        variant="outline"
        className="mb-4"
        onClick={() => navigate("/patients")}
      >
        <ArrowLeftIcon className="mr-1 size-4" />
        Volver al listado
      </Button>

      <div className="mb-6 rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Observaciones de {patientObservations?.name}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Total: {patientObservations?.observations?.length ?? 0} registros clinicos
            </p>
          </div>
          <NewObservationModal />
        </div>
      </div>

      <ScrollArea>
        <div className="grid grid-cols-1 gap-5 pb-2 lg:grid-cols-2">
          {patientObservations?.observations?.toReversed()?.map((obs) => (
            <CardObservation
              key={obs.id}
              observation={obs}
              categories={observationsCategories}
            />
          ))}
        </div>
      </ScrollArea>

      {patientObservations?.observations?.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-500">
          Este paciente todavia no tiene observaciones.
        </div>
      ) : null}
    </div>
  );
}
