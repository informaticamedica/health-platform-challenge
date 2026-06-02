import type { Patient, PatientInput } from './patient.types';

import { PatientRepository } from './patient.repository';

import { notFoundError } from '../../shared/errors/compat-error';

export class PatientService {
  private readonly repository = new PatientRepository();

  public findAll(): Patient[] {
    return this.repository.findAll();
  }

  public findById(id: string): Patient {
    const patient = this.repository.findById(id);
    if (!patient) throw notFoundError(`Paciente no encontrado con id = ${id}`);

    return patient;
  }

  public create(input: PatientInput): Patient {
    return this.repository.create(input);
  }

  public update(id: string, input: PatientInput): Patient {
    const patient = this.repository.update(id, input);
    if (!patient) throw notFoundError(`Paciente no encontrado con id = ${id}`);

    return patient;
  }

  public delete(id: string): boolean {
    const deleted = this.repository.delete(id);
    if (!deleted) throw notFoundError(`Paciente no encontrado con id = ${id}`);

    return true;
  }
}
