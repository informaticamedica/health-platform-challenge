import pool from "../db/postgres";

export type ConditionRecord = {
  id: string;
  patient_id: string;
  clinical_status: "active" | "inactive" | "resolved";
  verification_status: "provisional" | "confirmed" | "refuted";
  code: string;
  recorded_date: string;
  notes: string;
  created_by: string;
};

const ConditionModel = {
  async findAll(): Promise<ConditionRecord[]> {
    const { rows } = await pool.query(
      "SELECT * FROM conditions ORDER BY recorded_date DESC, id DESC"
    );
    return rows;
  },

  async findById(id: string): Promise<ConditionRecord | null> {
    const { rows } = await pool.query("SELECT * FROM conditions WHERE id = $1", [
      id,
    ]);
    return rows[0] ?? null;
  },

  async findAllByPatient(patientId: string): Promise<ConditionRecord[]> {
    const { rows } = await pool.query(
      "SELECT * FROM conditions WHERE patient_id = $1 ORDER BY recorded_date DESC, id DESC",
      [patientId]
    );
    return rows;
  },

  async create(
    input: Omit<ConditionRecord, "id">
  ): Promise<ConditionRecord> {
    const query = `
      INSERT INTO conditions
      (patient_id, clinical_status, verification_status, code, recorded_date, notes, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`;
    const { rows } = await pool.query(query, [
      input.patient_id,
      input.clinical_status,
      input.verification_status,
      input.code,
      input.recorded_date,
      input.notes,
      input.created_by,
    ]);
    return rows[0];
  },

  async update(
    id: string,
    input: Omit<ConditionRecord, "id" | "created_by">
  ): Promise<ConditionRecord | null> {
    const query = `
      UPDATE conditions
      SET patient_id = $1,
          clinical_status = $2,
          verification_status = $3,
          code = $4,
          recorded_date = $5,
          notes = $6
      WHERE id = $7
      RETURNING *`;
    const { rows } = await pool.query(query, [
      input.patient_id,
      input.clinical_status,
      input.verification_status,
      input.code,
      input.recorded_date,
      input.notes,
      id,
    ]);
    return rows[0] ?? null;
  },

  async delete(id: string): Promise<boolean> {
    const { rowCount } = await pool.query("DELETE FROM conditions WHERE id = $1", [
      id,
    ]);
    return (rowCount ?? 0) > 0;
  },
};

export default ConditionModel;
