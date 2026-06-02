import type { Patient, PatientInput } from './patient.types';

import { pool } from '../../config/db';

const patientColumns = 'id, name, birth_date, gender, address';

export class PatientRepository {
  public async create(input: PatientInput): Promise<Patient> {
    const result = await pool.query<Patient>(
      `
        INSERT INTO patients (name, birth_date, gender, address)
        VALUES ($1, $2, $3, $4)
        RETURNING ${patientColumns}
      `,
      [input.name, input.birth_date, input.gender, input.address ?? null],
    );

    return result.rows[0];
  }

  public async findAll(): Promise<Patient[]> {
    const result = await pool.query<Patient>(
      `SELECT ${patientColumns} FROM patients ORDER BY created_at DESC, id DESC`,
    );

    return result.rows;
  }

  public async findById(id: string): Promise<Patient | undefined> {
    const result = await pool.query<Patient>(`SELECT ${patientColumns} FROM patients WHERE id = $1`, [id]);

    return result.rows[0];
  }

  public async update(id: string, input: PatientInput): Promise<Patient | undefined> {
    const result = await pool.query<Patient>(
      `
        UPDATE patients
        SET name = $1,
            birth_date = $2,
            gender = $3,
            address = $4,
            updated_at = NOW()
        WHERE id = $5
        RETURNING ${patientColumns}
      `,
      [input.name, input.birth_date, input.gender, input.address ?? null, id],
    );

    return result.rows[0];
  }

  public async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM patients WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
