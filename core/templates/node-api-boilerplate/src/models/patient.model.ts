import { v4 } from "uuid";
import pool from "../db/postgres";
import { DatabaseError } from "../services/error.service";

export interface Patient {
  id: number;
  name: string;
  birth_date: number;
  gender: string;
  address?: string;
}

const PatientModel = {
  async findAll(): Promise<Patient[]> {
    try {
      const query = `
        SELECT p.*,
          (
            SELECT count(*) FROM observations o WHERE o.patient_id = p.id
          ) as observations 
        FROM patients p
      `;
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error("Error fetching patients:", error);
      throw new DatabaseError("findAll: Could not fetch patients");
    }
  },

  async findById(id: string): Promise<Patient | null> {
    try {
      const query = `
        SELECT p.*
        FROM patients p WHERE p.id = $1`;
      const { rows } = await pool.query(query, [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`Error fetching patient with id ${id}:`, error);
      throw new DatabaseError("findById: Could not fetch patient");
    }
  },

  async create(patient: Omit<Patient, "id">): Promise<Patient> {
    try {
      console.log({
        patient,
        a: [
          v4(),
          patient.name,
          patient.birth_date,
          patient.gender,
          patient?.address ?? null,
        ],
      });

      const query = `
      INSERT INTO patients (id, name, birth_date, gender, address)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
      const values = [
        v4(),
        patient.name,
        patient.birth_date,
        patient.gender,
        patient?.address ?? null,
      ];
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("Error adding patient:", error);
      throw new DatabaseError("create: Could not add patient");
    }
  },

  async delete(id: number): Promise<boolean> {
    try {
      const query = "DELETE FROM patients WHERE id = $1";
      const { rowCount } = await pool.query(query, [id]);
      return (rowCount ?? 0) > 0;
    } catch (error) {
      console.error(`Error deleting patient with id ${id}:`, error);
      throw new DatabaseError("delete: Could not delete patient");
    }
  },

  async update(patient: Patient): Promise<Patient | null> {
    try {
      const query = `
        UPDATE patients
        SET 
          name = $1,
          birth_date = $2,
          gender = $3,
          address = $4
        WHERE id = $5
        RETURNING *;
      `;
      const values = [
        patient.name,
        patient.birth_date,
        patient.gender,
        patient.address,
        patient.id,
      ];
      const { rows } = await pool.query(query, values);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`Error updating patient with id ${patient.id}:`, error);
      throw new DatabaseError("update: Could not update patient");
    }
  },
};

export default PatientModel;
