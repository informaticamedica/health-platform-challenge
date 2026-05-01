import { PatientObservationsType, PatientTypeDto } from "@/types/dto.type";
import { ObservationCategoryType } from "@/types/fhir.type";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Store {
  patients: PatientTypeDto[];
  setPatients: (patients: PatientTypeDto[]) => void;
  patientObservations: PatientObservationsType;
  setPatientObservations: (
    patientObservations: PatientObservationsType
  ) => void;
  observationsCategories: ObservationCategoryType[];
  setObservationsCategories: (o: ObservationCategoryType[]) => void;
}
//TODO: separar en dos stores
//TODO: ver inferencia de tipos
const usePatientStore = create<Store>()(
  devtools((set) => ({
    patients: [],
    setPatients: (patients) => set({ patients }),
    patientObservations: {} as PatientObservationsType,
    setPatientObservations: (patientObservations) =>
      set({ patientObservations }),
    observationsCategories: [],
    setObservationsCategories: (observationsCategories) =>
      set({ observationsCategories }),
  }))
);

export default usePatientStore;
