export type ObservationComponent = {
  code: string;
  value: number;
  unit: string;
};

export type Observation = {
  id: string;
  patient_id: string;
  user_id: string;
  code: string;
  value: string | number;
  date: string;
  status: 'final' | 'preliminary' | '';
  category: string;
  components?: ObservationComponent[];
};

export type ObservationInput = Omit<Observation, 'id' | 'patient_id' | 'user_id'>;
