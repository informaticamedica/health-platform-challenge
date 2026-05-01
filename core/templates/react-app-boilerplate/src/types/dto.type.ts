export type ObservationType = {
  id: string;
  code: string;
  value: string;
  date: string;
  patient_id: string;
  user_id: string;
  category: string;
  components?: ComponentObservationTypeDto[];
};

export type ComponentObservationTypeDto = {
  id?: string;
  observation_id?: string;
  code: string;
  value: number;
  unit: string;
};

export type PatientType = {
  id: string;
  name: string;
  gender: string;
  birth_date: string;
  address: string;
};

export type PatientTypeDto = PatientType & {
  observations: number;
};

export type PatientObservationsType = PatientType & {
  observations: ObservationType[]; // Cambia el tipo de observations a ObservationType[]
};

export type StoreType = {
  patients: PatientType[];
  setPatients: (patients: PatientType[]) => void;
};
