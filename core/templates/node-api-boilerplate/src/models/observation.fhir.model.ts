//TODO: Cambiar nombre a .type.ts
export interface Observation {
  id: string;
  patient_id: string;
  user_id: string;
  code: string;
  value: string | null;
  date: string;
  status: string;
  category: string;
  components?: Component[];
}

export interface Component {
  id: string;
  observation_id: string;
  code: string;
  value: number;
  unit: string;
}
