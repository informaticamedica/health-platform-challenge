import type { LoginInput, RegisterInput, User } from './auth.types';

import { AuthRepository } from './auth.repository';

import { tokenRepository } from '../../shared/auth/auth.middleware';
import { unauthorizedError, validationError } from '../../shared/errors/compat-error';

export class AuthService {
  private readonly repository = new AuthRepository();

  public register(input: RegisterInput): User {
    const existing = this.repository.findByEmail(input.email);
    if (existing) throw validationError('El usuario ya existe');

    return this.repository.create(input);
  }

  public login(input: LoginInput): { token: string } {
    const user = this.repository.findByEmail(input.email);
    if (!user || user.password !== input.password) throw unauthorizedError('Credenciales invalidas');

    return { token: tokenRepository.create(user.id) };
  }
}
