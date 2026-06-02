import jwt from 'jsonwebtoken';

const getJwtSecret = (): string => process.env.JWT_SECRET || 'secret';

export class TokenRepository {
  public create(userId: string): string {
    return jwt.sign({ id: userId }, getJwtSecret(), { expiresIn: '8h' });
  }

  public findUserId(token: string): string | undefined {
    const payload = jwt.verify(token, getJwtSecret());
    if (typeof payload === 'string') return undefined;

    return typeof payload.id === 'string' ? payload.id : undefined;
  }
}
