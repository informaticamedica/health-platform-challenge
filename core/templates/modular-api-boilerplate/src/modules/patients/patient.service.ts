import type { Patient, PatientInput } from './patient.types';

import { PatientRepository } from './patient.repository';

import { notFoundError } from '../../shared/errors/compat-error';

export class PatientService {
  private readonly repository = new PatientRepository();

  public findAll(): Promise<Patient[]> {
    return this.repository.findAll();
  }

  public async findById(id: string): Promise<Patient> {
    const patient = await this.repository.findById(id);
    if (!patient) throw notFoundError(`Paciente no encontrado con id = ${id}`);

    return patient;
  }

  public create(input: PatientInput): Promise<Patient> {
    return this.repository.create(input);
  }

  public async update(id: string, input: PatientInput): Promise<Patient> {
    const patient = await this.repository.update(id, input);
    if (!patient) throw notFoundError(`Paciente no encontrado con id = ${id}`);

    return patient;
  }

  public async delete(id: string): Promise<boolean> {
    const deleted = await this.repository.delete(id);
    if (!deleted) throw notFoundError(`Paciente no encontrado con id = ${id}`);

    return true;
  }
}
