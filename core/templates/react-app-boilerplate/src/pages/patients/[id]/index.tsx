import { CardObservation } from "@/components/observations/CardObservation";
import { NewObservationModal } from "@/components/observations/NewObservationModal";
import { Button, Chip, ScrollArea, SectionBanner } from "@platform/design-system";
import { useAuth } from "@/context/auth";
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

    loadPatient().catch((error: unknown) => {
      console.error("Error loading patient observations", error);
    });
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
      loadCategories().catch((error: unknown) => {
        console.error("Error loading observation categories", error);
      });
    }
  }, [
    observationsCategories.length,
    session?.accessToken,
    setObservationsCategories,
  ]);

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
        description={
          <span className="inline-flex items-center gap-2">
            <span>Total de registros clinicos:</span>
            <Chip variant="outline" showClose={false} className="border-secondary text-secondary">
              {patientObservations?.observations?.length ?? 0}
            </Chip>
          </span>
        }
        action={<NewObservationModal />}
        className="mb-6 border-secondary/40 bg-gradient-to-r from-card via-tertiary to-card text-primary shadow-lg shadow-secondary/20"
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
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground">
          Este paciente todavia no tiene observaciones.
        </div>
      ) : null}
    </div>
  );
}
