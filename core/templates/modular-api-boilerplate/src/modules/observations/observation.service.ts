import type { Observation, ObservationInput } from './observation.types';

import { ObservationRepository } from './observation.repository';
import { observationCategories } from './observation.schemas';

import { notFoundError, validationError } from '../../shared/errors/compat-error';
import { PatientService } from '../patients/patient.service';

export class ObservationService {
  private readonly repository = new ObservationRepository();
  private readonly patientService = new PatientService();

  public findByPatientId(patientId: string) {
    const patient = this.patientService.findById(patientId);
    return { ...patient, observations: this.repository.findByPatientId(patientId) };
  }

  public createForPatient(patientId: string, userId: string, input: ObservationInput): Observation {
    this.patientService.findById(patientId);
    return this.repository.create(patientId, userId, input);
  }

  public update(id: string, userId: string, input: ObservationInput): Observation {
    const observation = this.repository.update(id, userId, input);
    if (!observation) throw notFoundError('Observacion no encontrada');

    return observation;
  }

  public delete(id: string): Observation {
    const observation = this.repository.delete(id);
    if (!observation) throw notFoundError('Observacion no encontrada');

    return observation;
  }

  public deleteByPatientId(patientId: string): void {
    this.repository.deleteByPatientId(patientId);
  }

  public categories() {
    return observationCategories.map((code) => ({ code, display: code, definition: code }));
  }

  public loincSuggestions(query: string, limit: number) {
    return loincSuggestions
      .filter((item) => !query || item.code.includes(query) || item.display.toLowerCase().includes(query))
      .slice(0, limit);
  }

  public toFhir(id: string) {
    const observation = this.repository.findById(id);
    if (!observation) throw validationError('Observation not found');

    const patient = this.patientService.findById(observation.patient_id);
    return {
      resourceType: 'Observation',
      id: observation.id,
      status: observation.status || 'final',
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/observation-category',
              code: observation.category,
              display: observation.category,
            },
          ],
        },
      ],
      code: {
        coding: [{ system: 'http://loinc.org', code: observation.code, display: observation.code }],
        text: observation.code,
      },
      subject: {
        reference: `Patient/${observation.patient_id}`,
        display: patient.name,
      },
      effectiveDateTime: observation.date,
      component: observation.components?.map((component) => ({
        code: {
          coding: [{ system: 'http://loinc.org', code: component.code, display: component.code }],
          text: component.code,
        },
        valueQuantity: {
          value: component.value,
          unit: component.unit,
          system: 'http://loinc.org',
          code: component.code,
        },
      })),
    };
  }
}

const loincSuggestions = [
  { code: '8480-6', display: 'Systolic blood pressure' },
  { code: '8462-4', display: 'Diastolic blood pressure' },
  { code: '8867-4', display: 'Heart rate' },
  { code: '8310-5', display: 'Body temperature' },
];
