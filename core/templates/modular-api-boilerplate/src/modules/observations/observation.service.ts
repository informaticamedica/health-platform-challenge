import type { Observation, ObservationInput } from './observation.types';

import { ObservationRepository } from './observation.repository';
import { observationCategories } from './observation.schemas';

import { PG_ERROR_CODES } from '../../shared/errors/db-error-codes';
import { notFoundError, unauthorizedError, validationError } from '../../shared/errors/compat-error';
import { PatientService } from '../patients/patient.service';

const hasPgCode = (error: unknown): error is { code: string; constraint?: string } => {
  return typeof error === 'object' && error !== null && 'code' in error;
};

export class ObservationService {
  private readonly repository = new ObservationRepository();
  private readonly patientService = new PatientService();

  public async findByPatientId(patientId: string) {
    const patient = await this.patientService.findById(patientId);
    return { ...patient, observations: await this.repository.findByPatientId(patientId) };
  }

  public async createForPatient(
    patientId: string,
    userId: string,
    input: ObservationInput,
  ): Promise<Observation> {
    await this.patientService.findById(patientId);
    try {
      return await this.repository.create(patientId, userId, input);
    } catch (error) {
      this.mapDbError(error);
    }
  }

  public async update(id: string, userId: string, input: ObservationInput): Promise<Observation> {
    let observation: Observation | undefined;
    try {
      observation = await this.repository.update(id, userId, input);
    } catch (error) {
      this.mapDbError(error);
    }

    if (!observation) throw notFoundError('Observacion no encontrada');

    return observation;
  }

  public async delete(id: string): Promise<Observation> {
    const observation = await this.repository.delete(id);
    if (!observation) throw notFoundError('Observacion no encontrada');

    return observation;
  }

  public async deleteByPatientId(patientId: string): Promise<void> {
    await this.repository.deleteByPatientId(patientId);
  }

  public categories() {
    return observationCategories.map((code) => ({ code, display: code, definition: code }));
  }

  public loincSuggestions(query: string, limit: number) {
    return loincSuggestions
      .filter((item) => !query || item.code.includes(query) || item.display.toLowerCase().includes(query))
      .slice(0, limit);
  }

  public async toFhir(id: string) {
    const observation = await this.repository.findById(id);
    if (!observation) throw validationError('Observation not found');

    const patient = await this.patientService.findById(observation.patient_id);
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

  private mapDbError(error: unknown): never {
    if (hasPgCode(error) && error.code === PG_ERROR_CODES.FOREIGN_KEY_VIOLATION) {
      if (error.constraint?.includes('user')) {
        throw unauthorizedError('El usuario autenticado no existe en la base de datos');
      }

      throw notFoundError('Paciente relacionado no encontrado');
    }

    throw error;
  }
}

const loincSuggestions = [
  { code: '8480-6', display: 'Systolic blood pressure' },
  { code: '8462-4', display: 'Diastolic blood pressure' },
  { code: '8867-4', display: 'Heart rate' },
  { code: '8310-5', display: 'Body temperature' },
];
