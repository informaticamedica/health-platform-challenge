import { randomUUID } from 'node:crypto';

import type { Patient, PatientInput } from './patient.types';

const patients = new Map<string, Patient>();

export class PatientRepository {
  public create(input: PatientInput): Patient {
    const patient = { ...input, id: randomUUID() };
    patients.set(patient.id, patient);
    return patient;
  }

  public findAll(): Patient[] {
    return Array.from(patients.values());
  }

  public findById(id: string): Patient | undefined {
    return patients.get(id);
  }

  public update(id: string, input: PatientInput): Patient | undefined {
    if (!patients.has(id)) return undefined;

    const patient = { ...input, id };
    patients.set(id, patient);
    return patient;
  }

  public delete(id: string): boolean {
    return patients.delete(id);
  }
}
