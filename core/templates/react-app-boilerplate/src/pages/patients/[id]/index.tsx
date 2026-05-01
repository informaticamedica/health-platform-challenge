import { CardObservation } from "@/components/observations/CardObservation";
import { NewObservationModal } from "@/components/observations/NewObservationModal";
import { useAuth } from "@/context/auth";
// import { PatientCard } from "@/components/patients/Patient";
import { ScrollArea } from "@/components/ui/scroll-area";
import usePatientStore from "@/hooks/useStore";
import { getObservations } from "@/services/backend";
import { ObservationCategoryType } from "@/types/fhir.type";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 } from "uuid";

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

  // const { observations, ...patient } = patientObservations;
  return (
    <div>
      <div className="container mx-auto p-6 pt-28">
        <div className="flex  justify-between">
          <div className="w-full">
            {/* <PatientCard
              patient={{ ...patient, observations: observations?.length }}
            /> */}
            <h1 className="text-2xl font-bold mb-4">
              Observaciones de <strong>{patientObservations?.name}</strong>
            </h1>
            <div className="flex justify-between w-full">
              <h2 className="text-xl font-bold mb-2 bg-white px-2 rounded">
                Lista de Observaciones (
                {patientObservations?.observations?.length}){" "}
              </h2>

              <NewObservationModal />
            </div>
            <ScrollArea>
              <div className=" pt-2  grid grid-cols-2 gap-6 w-full ">
                {patientObservations?.observations?.toReversed()?.map((obs) => (
                  <CardObservation
                    key={v4()}
                    observation={obs}
                    categories={observationsCategories}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
