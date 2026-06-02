import type { Observation, ObservationComponent, ObservationInput } from './observation.types';
import type { PoolClient } from 'pg';

import { pool } from '../../config/db';

type ObservationRow = Omit<Observation, 'components'>;

const observationColumns = 'id, patient_id, user_id, code, value, date, status, category';

export class ObservationRepository {
  public async create(patientId: string, userId: string, input: ObservationInput): Promise<Observation> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await client.query<ObservationRow>(
        `
          INSERT INTO observations (patient_id, user_id, code, value, date, status, category)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING ${observationColumns}
        `,
        [patientId, userId, input.code, String(input.value), input.date, input.status, input.category],
      );

      await this.replaceComponents(client, result.rows[0].id, input.components);
      await client.query('COMMIT');

      return this.findByIdOrThrow(result.rows[0].id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  public async findById(id: string): Promise<Observation | undefined> {
    const result = await pool.query<ObservationRow>(`SELECT ${observationColumns} FROM observations WHERE id = $1`, [
      id,
    ]);
    if (result.rowCount === 0) return undefined;

    return this.withComponents(result.rows[0]);
  }

  public async findByPatientId(patientId: string): Promise<Observation[]> {
    const result = await pool.query<ObservationRow>(
      `SELECT ${observationColumns} FROM observations WHERE patient_id = $1 ORDER BY date DESC, id DESC`,
      [patientId],
    );

    return Promise.all(result.rows.map((observation) => this.withComponents(observation)));
  }

  public async update(
    id: string,
    userId: string,
    input: ObservationInput,
  ): Promise<Observation | undefined> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await client.query<ObservationRow>(
        `
          UPDATE observations
          SET user_id = $1,
              code = $2,
              value = $3,
              date = $4,
              status = $5,
              category = $6,
              updated_at = NOW()
          WHERE id = $7
          RETURNING ${observationColumns}
        `,
        [userId, input.code, String(input.value), input.date, input.status, input.category, id],
      );

      if (result.rowCount === 0) {
        await client.query('ROLLBACK');
        return undefined;
      }

      await this.replaceComponents(client, id, input.components);
      await client.query('COMMIT');

      return this.findByIdOrThrow(result.rows[0].id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  public async delete(id: string): Promise<Observation | undefined> {
    const observation = await this.findById(id);
    if (!observation) return undefined;

    await pool.query('DELETE FROM observations WHERE id = $1', [id]);
    return observation;
  }

  public async deleteByPatientId(patientId: string): Promise<void> {
    await pool.query('DELETE FROM observations WHERE patient_id = $1', [patientId]);
  }

  private async findByIdOrThrow(id: string): Promise<Observation> {
    const observation = await this.findById(id);
    if (!observation) throw new Error('No se encontro la observacion luego de la operacion.');

    return observation;
  }

  private async withComponents(observation: ObservationRow): Promise<Observation> {
    const result = await pool.query<ObservationComponent>(
      'SELECT code, value::float AS value, unit FROM observation_components WHERE observation_id = $1 ORDER BY id ASC',
      [observation.id],
    );

    return {
      ...observation,
      components: result.rows.length > 0 ? result.rows : undefined,
    };
  }

  private async replaceComponents(
    client: PoolClient,
    observationId: string,
    components: ObservationInput['components'],
  ): Promise<void> {
    await client.query('DELETE FROM observation_components WHERE observation_id = $1', [observationId]);

    for (const component of components ?? []) {
      await client.query(
        `
          INSERT INTO observation_components (observation_id, code, value, unit)
          VALUES ($1, $2, $3, $4)
        `,
        [observationId, component.code, component.value, component.unit],
      );
    }
  }
}
