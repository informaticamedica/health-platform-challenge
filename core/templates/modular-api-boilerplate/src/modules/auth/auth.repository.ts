import type { RegisterInput, User } from './auth.types';

import { pool } from '../../config/db';

export class AuthRepository {
  public async create(input: RegisterInput): Promise<User> {
    const result = await pool.query<User>(
      `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, password
      `,
      [input.name, input.email, input.password],
    );

    return result.rows[0];
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const result = await pool.query<User>(
      'SELECT id, name, email, password FROM users WHERE email = $1 LIMIT 1',
      [email],
    );

    return result.rows[0];
  }
}
