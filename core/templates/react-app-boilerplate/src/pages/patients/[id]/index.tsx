import { CardObservation } from "@/components/observations/CardObservation";
import { NewObservationModal } from "@/components/observations/NewObservationModal";
import { Button, SectionBanner } from "@/components/ui";
import { useAuth } from "@/context/auth";
// import { PatientCard } from "@/components/patients/Patient";
import { ScrollArea } from "@/components/ui/scroll-area";
import usePatientStore from "@/hooks/useStore";
import { getObservationCategories, getObservations } from "@/services/backend";
import { ObservationCategoryType } from "@/types/fhir.type";
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
        if (!session?.accessToken) return;
        const response = await getObservationCategories(session.accessToken);
        if (response.error) {
          setObservationsCategories(FALLBACK_CATEGORIES);
          return;
        }

        setObservationsCategories(response.data);
      } catch {
        setObservationsCategories(FALLBACK_CATEGORIES);
      }
    };

    if (observationsCategories.length === 0) {
      void loadCategories();
    }
  }, [observationsCategories.length, session?.accessToken, setObservationsCategories]);

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

      <SectionBanner
        variant="secondary"
        title={`Observaciones de ${patientObservations?.name ?? ""}`}
        description={`Total: ${patientObservations?.observations?.length ?? 0} registros clinicos`}
        action={<NewObservationModal />}
        className="mb-6"
      />

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
