import { randomUUID } from 'node:crypto';

const tokens = new Map<string, string>();

export class TokenRepository {
  public create(userId: string): string {
    const token = randomUUID();
    tokens.set(token, userId);
    return token;
  }

  public findUserId(token: string): string | undefined {
    return tokens.get(token);
  }
}
