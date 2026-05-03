export interface ObservationComponents {
  id: string;
  code: string;
  value: number;
  unit: string;
  observation_id: string;
}

export interface Observations {
  id: string;
  code: string;
  value: string | null;
  date: string | null;
  status: string;
  category: string;
  patient_id: string;
  user_id: string;
}

export interface Patients {
  id: string;
  name: string;
  birth_date: string;
  gender: string;
  address: string | null;
}

export interface Users {
  id: string;
  name: string;
  email: string;
  password: string;
  jwt_token: string | null;
}
