import { randomUUID } from 'node:crypto';

import type { RegisterInput, User } from './auth.types';

const users = new Map<string, User>();

export class AuthRepository {
  public create(input: RegisterInput): User {
    const user = { ...input, id: randomUUID() };
    users.set(user.id, user);
    return user;
  }

  public findByEmail(email: string): User | undefined {
    return Array.from(users.values()).find((user) => user.email === email);
  }
}
