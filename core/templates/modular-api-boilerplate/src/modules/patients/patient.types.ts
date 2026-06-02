export type Patient = {
  id: string;
  name: string;
  birth_date: string;
  gender: 'male' | 'female' | 'other';
  address?: string;
};

export type PatientInput = Omit<Patient, 'id'>;
