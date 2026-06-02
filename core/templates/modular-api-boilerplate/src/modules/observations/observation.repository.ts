import { randomUUID } from 'node:crypto';

import type { Observation, ObservationInput } from './observation.types';

const observations = new Map<string, Observation>();

export class ObservationRepository {
  public create(patientId: string, userId: string, input: ObservationInput): Observation {
    const observation = { ...input, id: randomUUID(), patient_id: patientId, user_id: userId };
    observations.set(observation.id, observation);
    return observation;
  }

  public findById(id: string): Observation | undefined {
    return observations.get(id);
  }

  public findByPatientId(patientId: string): Observation[] {
    return Array.from(observations.values()).filter(
      (observation) => observation.patient_id === patientId,
    );
  }

  public update(id: string, userId: string, input: ObservationInput): Observation | undefined {
    const current = observations.get(id);
    if (!current) return undefined;

    const observation = { ...input, id, patient_id: current.patient_id, user_id: userId };
    observations.set(id, observation);
    return observation;
  }

  public delete(id: string): Observation | undefined {
    const observation = observations.get(id);
    if (!observation) return undefined;

    observations.delete(id);
    return observation;
  }

  public deleteByPatientId(patientId: string): void {
    for (const [id, observation] of observations.entries()) {
      if (observation.patient_id === patientId) observations.delete(id);
    }
  }
}
